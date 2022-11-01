import fs from 'fs-extra';
import { database_matrix_member } from '../../../module/database_matrix.js';
import Translation from '../../../module/translation.js';

export default {
    async exec({ meId, roomId, sender, name, checkRoom, roomIdOrAlias, body, replyBody, replySender, roomName, event_id, usersAdmin, RichReply, event, client }) {

        let config = fs.readJsonSync('./config.json');
        let translation = await Translation(`${process.env.language || config?.language}`);

        if (body) {
            
            let memberJson = fs.readJsonSync(`./database/matrix/member/${sender}.json`);
            let message = `${translation.topic_content} 📝`
            let reply = RichReply.createFor(roomId, event, message, message);
            await client.sendMessage(roomId, reply).catch(error => console.log(error));
            memberJson.CreatePosts_2 = body;
            fs.writeJsonSync(`./database/matrix/member/${sender}.json`, memberJson, { spaces: '\t' });
            await database_matrix_member({ sender: sender, menu: 'CreatePosts_3' }).catch(error => console.log(error));
        }

        else {
            let message = `${translation.err_wrong_entry} ❌ <br><br>`
            message += `${translation.back_main_menu}`
            let reply = RichReply.createFor(roomId, event, message, message);
            await client.sendMessage(roomId, reply).catch(error => console.log(error));
        }

    }
}