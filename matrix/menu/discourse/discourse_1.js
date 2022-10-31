import fs from 'fs-extra';
import { database_matrix_member } from '../../../module/database_matrix.js';
import sendMessagePrivate from '../../../discourse/sendMessagePrivate.js';

export default {
    async exec({ meId, roomId, sender, name, checkRoom, roomIdOrAlias, body, replyBody, replySender, roomName, event_id, usersAdmin, RichReply, event, client }) {

        if (body) {

            let memberJson = fs.readJsonSync(`./database/matrix/member/${sender}.json`);
            let title = 'رمز التحقق الخاص بك'
            let raw = `رمز التحقق الخاص بـ ${memberJson?.sender ? sender : memberJson?.name} <br><br>`;
            raw += memberJson?.verification_code;
            memberJson.useername_discourse = body;
            let Private = await sendMessagePrivate(process.env.useername_discourse, title, raw, body).catch(error => console.log(error));

            fs.writeJsonSync(`./database/matrix/member/${sender}.json`, memberJson, { spaces: '\t' });
            
            if (Private?.errors) {
                for (let item of Private?.errors) {
                    let reply = RichReply.createFor(roomId, event, item, item);
                    await client.sendMessage(roomId, reply).catch(error => console.log(error));
                }
            }
            else {
                let message_1 = 'تم إرسال رمز التحقق الخاص بك على الخاص على منصة discourse ✅'
                let message_2 = 'قم بكتابة الرمز المرسل إليك لتفعيل الجسر 📝'
                let reply_1 = RichReply.createFor(roomId, event, message_1, message_1);
                let reply_2 = RichReply.createFor(roomId, event, message_2, message_2);
                await client.sendMessage(roomId, reply_1).catch(error => console.log(error));
                await client.sendMessage(roomId, reply_2).catch(error => console.log(error));
                await database_matrix_member({ sender: sender, menu: 'discourse_2' }).catch(error => console.log(error));
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