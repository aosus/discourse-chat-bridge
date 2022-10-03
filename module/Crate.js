import fs from 'fs-extra';

export default async function Crate() {

    let database = fs.existsSync('./database');
    let telegram = fs.existsSync('./database/telegram');
    let chat = fs.existsSync('./database/telegram/chat');
    let from = fs.existsSync('./database/telegram/from');
    let matrix = fs.existsSync('./database/matrix');
    let room = fs.existsSync('./database/matrix/room');
    let direct = fs.existsSync('./database/matrix/direct');
    let member = fs.existsSync('./database/matrix/member');
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
    if (matrix === false) {
        fs.mkdirSync('./database/matrix', { recursive: true });
    }
    if (room === false) {
        fs.mkdirSync('./database/matrix/room', { recursive: true });
    }
    if (direct === false) {
        fs.mkdirSync('./database/matrix/direct', { recursive: true });
    }
    if (member === false) {
        fs.mkdirSync('./database/matrix/member', { recursive: true });
    }
    if (EventPosts === false) {
        fs.writeJsonSync('./database/EventPosts.json', []);
    }

}