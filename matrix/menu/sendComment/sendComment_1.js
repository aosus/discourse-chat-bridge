import fs from 'fs-extra';
import { database_matrix_member } from '../../../module/database_matrix.js';

export default {
    async exec({ meId, roomId, sender, name, checkRoom, roomIdOrAlias, body, replyBody, replySender, roomName, event_id, usersAdmin, RichReply, event, client }) {

        let memberJson = fs.readJsonSync(`./database/matrix/member/${sender}.json`);

        if (body.includes(process.env.url)) {

            let message = 'قم بكتابة التعليق 📝'

            let sp = body?.split('');

            if (sp[sp?.length - 1] === '/') {

                let reply = RichReply.createFor(roomId, event, message, message);
                await client.sendMessage(roomId, reply).catch(error => console.log(error));
                memberJson.sendComment_1 = Number(body?.split('/')?.slice(-2)[0]);
                fs.writeJsonSync(`./database/matrix/member/${sender}.json`, memberJson, { spaces: '\t' });
                await database_matrix_member({ sender: sender, menu: 'sendComment_2' }).catch(error => console.log(error));

            }

            else {

                let reply = RichReply.createFor(roomId, event, message, message);
                await client.sendMessage(roomId, reply).catch(error => console.log(error));
                memberJson.sendComment_1 = Number(body?.split('/')?.slice(-1)[0]);
                fs.writeJsonSync(`./database/matrix/member/${sender}.json`, memberJson, { spaces: '\t' });
                await database_matrix_member({ sender: sender, menu: 'sendComment_2' }).catch(error => console.log(error));

            }
        }

        else if (!isNaN(body)) {

            let message = 'قم بكتابة التعليق 📝'
            let reply = RichReply.createFor(roomId, event, message, message);
            await client.sendMessage(roomId, reply).catch(error => console.log(error));
            memberJson.sendComment_1 = Number(body);
            fs.writeJsonSync(`./database/matrix/member/${sender}.json`, memberJson, { spaces: '\t' });
            await database_matrix_member({ sender: sender, menu: 'sendComment_2' }).catch(error => console.log(error));
        }

        else {
            let message = 'إدخال خاطئ ❌ <br><br>'
            message += 'للرجوع للقائمة الرئيسية ارسل #'
            let reply = RichReply.createFor(roomId, event, message, message);
            await client.sendMessage(roomId, reply).catch(error => console.log(error));
        }

    }
}