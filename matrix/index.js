import {
    AutojoinRoomsMixin,
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
import path from 'path';
import fs from 'fs-extra';

export default async function MatrixBot() {
    try {
        let __dirname = path.resolve();
        let config = fs.readJsonSync(path.join(__dirname, '/config.json'));
        LogService.setLevel(LogLevel.name);

        let storage = new SimpleFsStorageProvider(path.join(process.env.DATAPATH || config?.dataPath, "matrix.json"));
        let client = new MatrixClient(process.env.MATRIX_HOMESERVER_URL || config?.matrix_homeserver_url, process.env.MATRIX_ACCESS_TOKEN || config?.matrix_access_token, storage);

        client.on("room.message", async (roomId, event) => {
            if (!event?.content) return;
            if (event?.sender === await client.getUserId()) return;
            if (event?.sender.includes('telegram')) return;
            if (event?.content?.msgtype !== "m.text") return;
            if (event.unsigned.age > 1000 * 60) return;

            let meId = await client.getUserId();
            let sender = event?.sender;
            let roomIdOrAlias = await client?.getPublishedAlias(roomId);
            let Profile = await client.getUserProfile(sender);
            let body = event?.content?.body;
            let name = Profile?.displayname;
            let roomState = await client.getRoomState(roomId);
            let roomfindName = roomState.find(e => e?.type === 'm.room.name');
            let roomfindAdmin = roomState.find(e => e?.type === 'm.room.power_levels');
            let roomName = roomfindName?.content?.name;
            let checkRoom = roomName ? 'room' : 'direct';
            let usersAdmin = Object.keys(roomfindAdmin?.content?.users);
            
            try {
                let memberJson = fs.readJsonSync(path.join(process.env.DATAPATH || config?.dataPath, `/database/matrix/member/${sender}.json`));
                
                // Process messages if they're in the private room or if user is authenticated
                if (roomId === memberJson?.private_room_id || memberJson?.access) {
                    await database_matrix({ roomId, sender, name: roomName || name, checkRoom, roomIdOrAlias });
                    await database_matrix_member({ sender, name });
                    await start(roomId, sender, name, body, event, RichReply, client);
                    await menu[await getMenu(sender)]?.module?.exec({
                        meId,
                        roomId,
                        sender,
                        name,
                        checkRoom,
                        roomIdOrAlias,
                        body,
                        roomName: roomName || name,
                        event_id: event?.event_id,
                        usersAdmin,
                        RichReply,
                        event,
                        client
                    });
                }
                
                console.log(`#Matrix sender: ${sender} ${checkRoom}: ${roomIdOrAlias || roomName || name}`);
                
            } catch (error) {
                // Handle new users or missing files
                if (error.code === 'ENOENT' && (body === 'start' || body === '#' || body === '6' || body === '٦' || body === 'discourse')) {
                    await database_matrix({ roomId, sender, name: roomName || name, checkRoom, roomIdOrAlias });
                    await database_matrix_member({ sender, name });
                    await start(roomId, sender, name, body, event, RichReply, client);
                }
            }
        });

        await client.start();
        console.log("Matrix is ready!");

    } catch (error) {
        console.error("Error in MatrixBot:", error);
    }
}