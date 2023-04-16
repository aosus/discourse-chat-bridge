import fs from 'fs-extra';
import { database_matrix_member } from '../../../module/database_matrix.js';
import sendComment from '../../../discourse/sendComment.js';
import Translation from '../../../module/translation.js';

export default {
    async exec({ meId, roomId, sender, name, checkRoom, roomIdOrAlias, body, replyBody, replySender, roomName, event_id, usersAdmin, RichReply, event, client }) {

        let memberJson = fs.readJsonSync(`./database/matrix/member/${sender}.json`);
        let config = fs.readJsonSync('./config.json');
        let translation = await Translation(`${process.env.language || config?.language}`);

        if (body) {

            let raw = body;
            let topic_id = memberJson?.sendComment_1
            let seCo = await sendComment(memberJson?.discourse_username, topic_id, raw);

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
                let message = `<b>${translation.comment_posted} ✅ <a href='${process.env.url || config?.url}/t/${topic_slug}/${topic_id}'>${post_number}</a></b>`
                let reply = RichReply.createFor(roomId, event, message, message);
                await client.sendMessage(roomId, reply).catch(error => console.log(error));
            }

            await database_matrix_member({ sender: sender, menu: 'main' }).catch(error => console.log(error));
        }

        else {
            let message = `${translation.err_wrong_entry} ❌ <br><br>`
            message += `${translation.back_main_menu}`
            let reply = RichReply.createFor(roomId, event, message, message);
            await client.sendMessage(roomId, reply).catch(error => console.log(error));
        }

    }
}