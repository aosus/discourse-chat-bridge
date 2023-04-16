import fs from 'fs-extra';
import { database_matrix_member } from '../../../module/database_matrix.js';
import sendMessagePrivate from '../../../discourse/sendMessagePrivate.js';
import Translation from '../../../module/translation.js';

export default {
    async exec({ meId, roomId, sender, name, checkRoom, roomIdOrAlias, body, replyBody, replySender, roomName, event_id, usersAdmin, RichReply, event, client }) {

        let config = fs.readJsonSync('./config.json');
        let translation = await Translation(`${process.env.LANGUAGE || config?.language}`);

        if (body) {

            let memberJson = fs.readJsonSync(`./database/matrix/member/${sender}.json`);
            let title = `${translation.verification_code}`
            let raw = `${translation.verification_code_for} ${memberJson?.sender ? sender : memberJson?.name} <br><br>`;
            raw += memberJson?.verification_code;
            memberJson.discourse_username = body;
            let Private = await sendMessagePrivate(process.env.DISCOURSE_USERNAME || config?.discourse_username, title, raw, body).catch(error => console.log(error));

            fs.writeJsonSync(`./database/matrix/member/${sender}.json`, memberJson, { spaces: '\t' });

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

        else {
            let message = `${translation.err_wrong_entry} ❌ <br><br>`
            message += `${translation.back_main_menu}`
            let reply = RichReply.createFor(roomId, event, message, message);
            await client.sendMessage(roomId, reply).catch(error => console.log(error));
        }

    }
}