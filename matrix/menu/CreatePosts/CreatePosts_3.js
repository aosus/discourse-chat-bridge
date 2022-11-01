import fs from 'fs-extra';
import CreatePosts from '../../../discourse/CreatePosts.js';
import { database_matrix_member } from '../../../module/database_matrix.js';
import Translation from '../../../module/translation.js';

export default {
    async exec({ meId, roomId, sender, name, checkRoom, roomIdOrAlias, body, replyBody, replySender, roomName, event_id, usersAdmin, RichReply, event, client }) {

        let config = fs.readJsonSync('./config.json');
        let translation = await Translation(`${process.env.language || config?.language}`);

        if (body) {

            let memberJson = fs.readJsonSync(`./database/matrix/member/${sender}.json`);
            let url = process.env.url || config?.url
            let category = memberJson?.CreatePosts_1;
            let title = memberJson?.CreatePosts_2;
            let raw = body;
            let crPo = await CreatePosts(memberJson?.useername_discourse, title, raw, category).catch(error => console.log(error));

            if (crPo?.errors) {
                for (let item of crPo?.errors) {
                    let reply = RichReply.createFor(roomId, event, item, item);
                    await client.sendMessage(roomId, reply).catch(error => console.log(error));
                }
            }

            else if (crPo?.topic_id && crPo?.topic_slug) {
                let topic_id = crPo?.topic_id;
                let topic_slug = crPo?.topic_slug;
                let message = `<b><a href='${url}/t/${topic_slug}/${topic_id}'>${title}</a></b> <br>`
                let reply = RichReply.createFor(roomId, event, message, message);
                await client.sendMessage(roomId, reply).catch(error => console.log(error));
            }

            else {
                let message = `${translation.wrong_data_entered} ❌ <br><br>`
                message += `${translation.back_main_menu_2}`
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