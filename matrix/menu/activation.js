import fs from 'fs-extra';
import { database_matrix_member } from '../../module/database_matrix.js';
import Translation from '../../module/translation.js';
import path from 'path';

export default {
    async exec({ meId, roomId, sender, name, checkRoom, roomIdOrAlias, body, replyBody, replySender, roomName, event_id, usersAdmin, RichReply, event, client }) {

        let __dirname = path.resolve();
        let config = fs.readJsonSync(path.join(__dirname, '/config.json'));
        let translation = await Translation(`${process.env.LANGUAGE || config?.language}`);

        if (!isNaN(body)) {

            let roomJson = fs.readJsonSync(path.join(process.env.DATAPATH || config?.dataPath, `/database/matrix/${checkRoom}/${roomId}.json`));
            let message = `${translation.active_bot} ✅`;
            let reply = RichReply.createFor(roomId, event, message, message);

            roomJson.evenPost = true;
            roomJson.categories = Number(body)
            fs.writeJsonSync(path.join(process.env.DATAPATH || config?.dataPath, `/database/matrix/${checkRoom}/${roomId}.json`), roomJson, { spaces: '\t' });
            await client.sendMessage(roomId, reply).catch(error => console.log(error));
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