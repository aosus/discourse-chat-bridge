import fs from 'fs-extra';
import { database_matrix_member } from '../../../module/database_matrix.js';
import sendMessagePrivate from '../../../discourse/sendMessagePrivate.js';
import Translation from '../../../module/translation.js';
import path from 'path';

export default {
    async exec({ meId, roomId, sender, name, checkRoom, roomIdOrAlias, body, replyBody, replySender, roomName, event_id, usersAdmin, RichReply, event, client }) {

        let __dirname = path.resolve();
        let config = fs.readJsonSync(path.join(__dirname, '/config.json'));
        let translation = await Translation(`${process.env.LANGUAGE || config?.language}`);

        if (!body) {
            try {
                let memberJson;
                try {
                    memberJson = fs.readJsonSync(path.join(process.env.DATAPATH || config?.dataPath, `/database/matrix/member/${sender}.json`));
                } catch (error) {
                    memberJson = {};
                }

                let privateRoomId = memberJson.private_room_id;
                
                // Check if the private room exists and the bot is still in it
                if (privateRoomId) {
                    try {
                        await client.getRoomState(privateRoomId);
                    } catch (error) {
                        // Room doesn't exist or bot is not in it anymore
                        privateRoomId = null;
                    }
                }

                // Create new room if needed
                if (!privateRoomId) {
                    privateRoomId = await client.createRoom({
                        visibility: "private",
                        preset: "private_chat",
                        invite: [sender],
                        is_direct: true,
                        room_version: "1"
                    });
                    
                    memberJson.private_room_id = privateRoomId;
                    fs.writeJsonSync(path.join(process.env.DATAPATH || config?.dataPath, `/database/matrix/member/${sender}.json`), memberJson, { spaces: '\t' });
                }

                let message = `${translation.link_your_account_to} ${process.env.DISCOURSE_FORUM_NAME || config?.discourse_forum_name} 🔗<br><br>`;
                message += `${translation.write_discourse_username} 📝`;
                
                let reply = RichReply.createFor(privateRoomId, event, message, message);
                await client.sendMessage(privateRoomId, reply);
                await database_matrix_member({ sender: sender, menu: 'discourse_1' });
                
            } catch (error) {
                console.error('Error handling private room:', error);
                let errorMsg = `${translation.err_creating_private_room} ❌`;
                let reply = RichReply.createFor(roomId, event, errorMsg, errorMsg);
                await client.sendMessage(roomId, reply);
            }
            return;
        }

        let memberJson = fs.readJsonSync(path.join(process.env.DATAPATH || config?.dataPath, `/database/matrix/member/${sender}.json`));
        let title = `${translation.verification_code}`
        let raw = `${translation.verification_code_for} ${memberJson?.sender ? sender : memberJson?.name} <br><br>`;
        raw += memberJson?.verification_code;
        memberJson.discourse_username = body;
        let Private = await sendMessagePrivate(process.env.DISCOURSE_USERNAME || config?.discourse_username, title, raw, body).catch(error => console.log(error));

        fs.writeJsonSync(path.join(process.env.DATAPATH || config?.dataPath, `/database/matrix/member/${sender}.json`), memberJson, { spaces: '\t' });

        if (Private?.errors) {
            for (let item of Private?.errors) {
                let reply = RichReply.createFor(roomId, event, item, item);
                await client.sendMessage(roomId, reply).catch(error => console.log(error));
            }
        }
        else {
            let message_1 = `${translation.send_verification_code} ✅`
            let message_2 = `${translation.write_verification_code} 📝`
            let reply_1 = RichReply.createFor(roomId, event, message_1, message_1);
            let reply_2 = RichReply.createFor(roomId, event, message_2, message_2);
            await client.sendMessage(roomId, reply_1).catch(error => console.log(error));
            await client.sendMessage(roomId, reply_2).catch(error => console.log(error));
            await database_matrix_member({ sender: sender, menu: 'discourse_2' }).catch(error => console.log(error));
        }

    }
}