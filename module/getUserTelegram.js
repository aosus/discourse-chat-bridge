import fs from 'fs-extra';

export default async function getUserTelegram() {

    let chat = fs.readdirSync('./database/telegram/chat');
    let from = fs.readdirSync('./database/telegram/from');
    let array = []

    for (let item of chat) {

        let id = item.split('.json')[0]
        let chatJson = fs.readJsonSync(`./database/telegram/chat/${item}`);
        if (chatJson?.evenPost) {

            array.push(id);
        }
    }

    for (let item of from) {

        let id = item.split('.json')[0]
        let fromJson = fs.readJsonSync(`./database/telegram/from/${item}`);
        if (fromJson?.evenPost) {

            array.push(id);
        }
    }

    return array
}