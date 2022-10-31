import fs from 'fs-extra';
import { database_matrix_member } from '../../../module/database_matrix.js';
import sendComment from '../../../discourse/sendComment.js';

export default {
    async exec({ meId, roomId, sender, name, checkRoom, roomIdOrAlias, body, replyBody, replySender, roomName, event_id, usersAdmin, RichReply, event, client }) {

        let memberJson = fs.readJsonSync(`./database/matrix/member/${sender}.json`);
        let config = fs.readJsonSync('./config.json');
        
        if (body) {

            let raw = body;
            let topic_id = memberJson?.sendComment_1
            let seCo = await sendComment(memberJson?.useername_discourse, topic_id, raw);

            if (seCo?.errors) {
                for (let item of seCo?.errors) {
                    let reply = RichReply.createFor(roomId, event, item, item);
                    await client.sendMessage(roomId, reply).catch(error => console.log(error));
                }
            }

            else {
                let topic_slug = seCo?.topic_slug
                let topic_id = seCo?.topic_id
                let post_number = seCo?.post_number
                let message = `<b>تم نشر التعليق ✅ <a href='${process.env.url || config?.url}/t/${topic_slug}/${topic_id}'>${post_number}</a></b>`
                let reply = RichReply.createFor(roomId, event, message, message);
                await client.sendMessage(roomId, reply).catch(error => console.log(error));
            }

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