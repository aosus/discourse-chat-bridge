import fs from 'fs-extra';
import { database_matrix_member } from '../../../module/database_matrix.js';
import sendMessagePrivate from '../../../discourse/sendMessagePrivate.js';

export default {
    async exec({ meId, roomId, sender, name, checkRoom, roomIdOrAlias, body, replyBody, replySender, roomName, event_id, usersAdmin, RichReply, event, client }) {

        if (body) {

            let memberJson = fs.readJsonSync(`./database/matrix/member/${sender}.json`);
            let title = memberJson?.sendMessagePrivate_2
            let raw = body
            let sendTo = memberJson?.sendMessagePrivate_1
            let sePr = await sendMessagePrivate(memberJson?.useername_discourse, title, raw, sendTo).catch(error => console.log(error));
            
            if (sePr?.errors) {

                for (let item of sePr?.errors) {
                    let reply = RichReply.createFor(roomId, event, item, item);
                    await client.sendMessage(roomId, reply).catch(error => console.log(error));
                }
            }

            else {
                let message = 'تم إرسال الرسالة ✅'
                let reply = RichReply.createFor(roomId, event, message, message);
                await client.sendMessage(roomId, reply).catch(error => console.log(error));
                await database_matrix_member({ sender: sender, menu: 'main' }).catch(error => console.log(error));
            }

        }

        else {
            let message = 'إدخال خاطئ ❌ <br><br>'
            message += 'للرجوع للقائمة الرئيسية ارسل #'
            let reply = RichReply.createFor(roomId, event, message, message);
            await client.sendMessage(roomId, reply).catch(error => console.log(error));
        }

    }
}