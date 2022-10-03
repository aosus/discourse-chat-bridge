import fs from 'fs-extra';
import { database_matrix_member } from '../../../module/database_matrix.js';

export default {
    async exec({ meId, roomId, sender, name, checkRoom, roomIdOrAlias, body, replyBody, replySender, roomName, event_id, usersAdmin, RichReply, event, client }) {

        if (body) {

            let memberJson = fs.readJsonSync(`./database/matrix/member/${sender}.json`);
            let message = 'قم بكتابة عنوان الرسالة 📝'
            let reply = RichReply.createFor(roomId, event, message, message);
            await client.sendMessage(roomId, reply).catch(error => console.log(error));
            memberJson.sendMessagePrivate_1 = body;
            fs.writeJsonSync(`./database/matrix/member/${sender}.json`, memberJson, { spaces: '\t' });
            await database_matrix_member({ sender: sender, menu: 'sendMessagePrivate_2' }).catch(error => console.log(error));
        }

        else {
            let message = 'إدخال خاطئ ❌ <br><br>'
            message += 'للرجوع للقائمة الرئيسية ارسل #'
            let reply = RichReply.createFor(roomId, event, message, message);
            await client.sendMessage(roomId, reply).catch(error => console.log(error));
        }

    }
}