import fs from 'fs-extra';
import { database_matrix_member } from '../../module/database_matrix.js';

export default {
    async exec({ meId, roomId, sender, name, checkRoom, roomIdOrAlias, body, replyBody, replySender, roomName, event_id, usersAdmin, RichReply, event, client }) {

        if (!isNaN(body)) {

            let roomJson = fs.readJsonSync(`./database/matrix/${checkRoom}/${roomId}.json`);
            let message = 'تم تفعيل البوت ✅';
            let reply = RichReply.createFor(roomId, event, message, message);

            roomJson.evenPost = true;
            roomJson.categories = Number(body)
            fs.writeJsonSync(`./database/matrix/${checkRoom}/${roomId}.json`, roomJson, { spaces: '\t' });
            await client.sendMessage(roomId, reply).catch(error => console.log(error));
            await database_matrix_member({ sender: sender, menu: 'main' }).catch(error => console.log(error));
        }

        else {
            let message = 'إدخال خاطئ ❌ <br><br>'
            message += 'للرجوع للقائمة الرئيسية ارسل #'
            let reply = RichReply.createFor(roomId, event, message, message);
            await client.sendMessage(roomId, reply).catch(error => console.log(error));
        }

    }
}