import fs from 'fs-extra';
import random from './random.js';

export default async function database_telegram(id, username, name, type, message_id) {

    let create_db_user = fs.existsSync(`./database/telegram/${type}/${id}.json`);

    if (create_db_user === false) {

        if (type === 'chat') {

            let opj = {
                id: id,
                username: username,
                name: name,
                type: type,
                evenPost: false,
                categories: null,
                message_id: message_id
            }

            fs.writeJsonSync(`./database/telegram/${type}/${id}.json`, opj, { spaces: '\t' });
        }

        else if (type === 'from') {

            let opj = {
                id: id,
                username: username,
                name: name,
                type: type,
                evenPost: false,
                categories: null,
                message_id: message_id,
                verification_code: random(10),
                access: false
            }

            fs.writeJsonSync(`./database/telegram/${type}/${id}.json`, opj, { spaces: '\t' });

        }


    }

    else {

        let db_user = fs.readJsonSync(`./database/telegram/${type}/${id}.json`);
        db_user.username = username;
        db_user.name = name;
        if (message_id) {
            db_user.message_id = message_id;
        }
        fs.writeJsonSync(`./database/telegram/${type}/${id}.json`, db_user, { spaces: '\t' });
    }

}