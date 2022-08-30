import fs from 'fs-extra';

export default async function Crate() {

    let database = fs.existsSync('./database');
    let telegram = fs.existsSync('./database/telegram');
    let chat = fs.existsSync('./database/telegram/chat');
    let from = fs.existsSync('./database/telegram/from');
    let EventPosts = fs.existsSync('./database/EventPosts.json');

    if (database === false) {
        fs.mkdirSync('./database', { recursive: true });
    }
    if (telegram === false) {
        fs.mkdirSync('./database/telegram', { recursive: true });
    }
    if (chat === false) {
        fs.mkdirSync('./database/telegram/chat', { recursive: true });
    }
    if (from === false) {
        fs.mkdirSync('./database/telegram/from', { recursive: true });
    }
    if (EventPosts === false) {
        fs.writeJsonSync('./database/EventPosts.json', []);
    }

}