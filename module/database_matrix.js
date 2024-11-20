import fs from 'fs-extra';
import random from './random.js';
import path from 'path';

export async function database_matrix({ roomId: roomId, sender: sender, name: name, checkRoom: checkRoom, roomIdOrAlias: roomIdOrAlias }) {

    let __dirname = path.resolve();
    let config = fs.readJsonSync(path.join(__dirname, '/config.json'));
    let create_db_user = fs.existsSync(path.join(process.env.DATAPATH || config?.dataPath, `/database/matrix/${checkRoom}/${roomId}.json`));

    if (create_db_user === false) {

        if (checkRoom === 'room') {

            let opj = {
                roomId: roomId,
                name: name,
                checkRoom: checkRoom,
                roomIdOrAlias: roomIdOrAlias,
                evenPost: false,
                categories: null
            }

            fs.writeJsonSync(path.join(process.env.DATAPATH || config?.dataPath, `/database/matrix/${checkRoom}/${roomId}.json`), opj, { spaces: '\t' });
        }

        else if (checkRoom === 'direct') {

            let opj = {
                roomId: roomId,
                sender: sender,
                name: name,
                checkRoom: checkRoom,
                evenPost: false,
                categories: null,
            }

            fs.writeJsonSync(path.join(process.env.DATAPATH || config?.dataPath, `/database/matrix/${checkRoom}/${roomId}.json`), opj, { spaces: '\t' });

        }

    }

    else {

        let db_user = fs.readJsonSync(path.join(process.env.DATAPATH || config?.dataPath, `/database/matrix/${checkRoom}/${roomId}.json`));
        db_user.name = name;

        if (checkRoom === 'direct') {
            db_user.sender = sender;
        }

        else if (checkRoom === 'room') {
            db_user.roomIdOrAlias = roomIdOrAlias;
        }

        fs.writeJsonSync(path.join(process.env.DATAPATH || config?.dataPath, `/database/matrix/${checkRoom}/${roomId}.json`), db_user, { spaces: '\t' });
    }

}


export async function database_matrix_member({ sender: sender, name: name, menu: menu }) {
    let __dirname = path.resolve();
    let config = fs.readJsonSync(path.join(__dirname, '/config.json'));

    if (sender && name) {

        let create_db_user = fs.existsSync(path.join(process.env.DATAPATH || config?.dataPath, `/database/matrix/member/${sender}.json`));

        if (create_db_user === false) {

            let opj = {
                sender: sender,
                name: name,
                verification_code: random(10),
                access: false,
                menu: 'main'
            }

            fs.writeJsonSync(path.join(process.env.DATAPATH || config?.dataPath, `/database/matrix/member/${sender}.json`), opj, { spaces: '\t' });
        }

        else {

            let db_user = fs.readJsonSync(path.join(process.env.DATAPATH || config?.dataPath, `/database/matrix/member/${sender}.json`));
            db_user.name = name;
            db_user.sender = sender;
            fs.writeJsonSync(path.join(process.env.DATAPATH || config?.dataPath, `/database/matrix/member/${sender}.json`), db_user, { spaces: '\t' });
        }
    }

    else {
        let db_user = fs.readJsonSync(path.join(process.env.DATAPATH || config?.dataPath, `/database/matrix/member/${sender}.json`));
        db_user.menu = menu;
        fs.writeJsonSync(path.join(process.env.DATAPATH || config?.dataPath, `/database/matrix/member/${sender}.json`), db_user, { spaces: '\t' });
    }

}