import fs from 'fs-extra';
import { database_matrix_member } from '../../../module/database_matrix.js';
import Translation from '../../../module/translation.js';
import path from 'path';

export default {
    async exec({ meId, roomId, sender, name, checkRoom, roomIdOrAlias, body, replyBody, replySender, roomName, event_id, usersAdmin, RichReply, event, client }) {

        let __dirname = path.resolve();
        let config = fs.readJsonSync(path.join(__dirname, '/config.json'));
        let memberJson = fs.readJsonSync(path.join(process.env.DATAPATH || config?.dataPath, `/database/matrix/member/${sender}.json`));
        let translation = await Translation(`${process.env.LANGUAGE || config?.language}`);

        if (memberJson?.verification_code === body) {

            let message = `${translation.active_bridge} ✅`
            let reply = RichReply.createFor(roomId, event, message, message);
            await client.sendMessage(roomId, reply).catch(error => console.log(error));
            memberJson.access = true;
            fs.writeJsonSync(path.join(process.env.DATAPATH || config?.dataPath, `/database/matrix/member/${sender}.json`), memberJson, { spaces: '\t' });
            await database_matrix_member({ sender: sender, menu: 'main' }).catch(error => console.log(error));
        }

        else {
            let message = `${translation.err_verification_code}❌ <br><br>`
            message += `${translation.back_main_menu}`
            let reply = RichReply.createFor(roomId, event, message, message);
            await client.sendMessage(roomId, reply).catch(error => console.log(error));
        }

    }
}