import fs from 'fs-extra';

export default async function getMenu(sender) {

    let user = fs.readJsonSync(`./database/matrix/member/${sender}.json`);

    return user?.menu
    
}