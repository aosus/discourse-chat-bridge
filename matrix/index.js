import {
    matrix_autoJoinRoomsMixin,
    LogLevel,
    LogService,
    MatrixClient,
    RustSdkCryptoStorageProvider,
    SimpleFsStorageProvider,
    RichReply,
    RichRepliesPreprocessor
} from "matrix-bot-sdk";
import getMenu from '../module/getMenu.js';
import start from './start.js';
import menu from '../module/menu.js';
import { database_matrix, database_matrix_member } from '../module/database_matrix.js';
import EventPosts_ from './EventPosts.js';
import EventReply from './EventReply.js';
import * as path from "path";
import fs from 'fs-extra';

export default async function MatrixBot() {

    try {

        let config = fs.readJsonSync('./config.json');
        LogService.setLevel(LogLevel.name);

        let storage = new SimpleFsStorageProvider(path.join(process.env.DATAPATH || config?.dataPath, "matrix.json"));
        // Prepare a crypto store if we need that
        let cryptoStore;
        if (process.env.MATRIX_ENCRYPTION === "true" || config?.matrix_encryption) {
            cryptoStore = new RustSdkCryptoStorageProvider(path.join(process.env.DATAPATH || config?.dataPath, "encrypted"));
        }
        // Now create the client
        let client = new MatrixClient(process.env.MATRIX_HOMESERVER_URL || config?.matrix_homeserver_url, process.env.MATRIX_ACCESS_TOKEN || config?.matrix_access_token, storage, cryptoStore);
        // Setup the matrix_autoJoin mixin (if enabled)
        if (process.env.MATRIX_ACCESS_TOKEN === "true" || config?.matrix_autoJoin) {
            matrix_autoJoinRoomsMixin.setupOnClient(client);
        }

        client.addPreprocessor(new RichRepliesPreprocessor(false));

        client.on("room.message", async (roomId, event) => {

            if (!event?.content) return; // Ignore redacted events that come through
            if (event?.sender === await client.getUserId()) return; // Ignore ourselves
            if (event?.sender.includes('telegram')) return; // Ignore user telegram
            if (event?.content?.msgtype !== "m.text") return; // Ignore non-text messages
            if (event.unsigned.age > 1000 * 60) return; // older than a minute

            let meId = await client.getUserId();
            let sender = event?.sender;
            let roomIdOrAlias = await client?.getPublishedAlias(roomId)
            let Profile = await client.getUserProfile(sender);
            let body = event?.content?.body;
            let name = Profile?.displayname;
            let external_url = event?.content?.external_url;
            let msgtype = event?.content?.msgtype;
            let replyBody = event?.mx_richreply?.fallbackHtmlBody;
            let replySender = event?.mx_richreply?.fallbackSender;
            let DirectoryVisibility = await client.getDirectoryVisibility(roomId);
            let type = event?.type;
            let event_id = event?.event_id;
            let roomState = await client.getRoomState(roomId);
            let roomfindName = roomState.find(e => e?.type === 'm.room.name');
            let roomfindAdmin = roomState.find(e => e?.type === 'm.room.power_levels');
            let roomName = roomfindName?.content?.name;
            let checkRoom = roomName ? 'room' : 'direct';
            let usersAdmin = Object.keys(roomfindAdmin?.content?.users);

            await database_matrix({ roomId: roomId, sender: sender, name: roomName ? roomName : name, checkRoom: checkRoom, roomIdOrAlias: roomIdOrAlias });
            await database_matrix_member({ sender: sender, name: name });
            await start(roomId, sender, name, body, event, RichReply, client);
            await EventReply(roomId, sender, meId, body, replySender, replyBody, event, RichReply, client);
            await menu[await getMenu(sender)]?.module?.exec({
                meId: meId,
                roomId: roomId,
                sender: sender,
                name: name,
                checkRoom: checkRoom,
                roomIdOrAlias: roomIdOrAlias,
                body: body,
                replyBody: replyBody,
                replySender: replySender,
                roomName: roomName ? roomName : name,
                event_id: event_id,
                usersAdmin: usersAdmin,
                RichReply: RichReply,
                event: event,
                client: client
            });

            console.log(`#Matrix sender: ${sender} ${checkRoom}: ${roomIdOrAlias ? roomIdOrAlias : roomName ? roomName : name}`);


        });

        await EventPosts_(client).catch(error => console.log(error));

        await client.start().then(() => console.log('Matrix is ready!'));

    } catch (error) {

        console.log(error);

        if (error?.body[0]?.errcode === 'M_UNKNOWN') {

            console.log('Run the command "npm run generate_matrix_token" and restart the bridge');
        }

    }

}