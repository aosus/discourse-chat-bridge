import fs from 'fs-extra';
import path from 'path';

export default async function getMenu(sender) {

    let __dirname = path.resolve();
    let config = fs.readJsonSync(path.join(__dirname, '/config.json'));
    let user = fs.readJsonSync(path.join(process.env.DATAPATH || config?.dataPath, `/database/matrix/member/${sender}.json`));

    return user?.menu

}