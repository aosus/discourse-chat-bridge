import fs from 'fs-extra';

export default async function Crate() {

    let database = fs.existsSync(path.join(process.env.DATAPATH || config?.dataPath, "/database"));
    let telegram = fs.existsSync(path.join(process.env.DATAPATH || config?.dataPath, "/database/telegram"));
    let chat = fs.existsSync(path.join(process.env.DATAPATH || config?.dataPath, "/database/telegram/chat"));
    let from = fs.existsSync(path.join(process.env.DATAPATH || config?.dataPath, "/database/telegram/from"));
    let matrix = fs.existsSync(path.join(process.env.DATAPATH || config?.dataPath, "/database/matrix"));
    let room = fs.existsSync(path.join(process.env.DATAPATH || config?.dataPath, "/database/matrix/room"));
    let direct = fs.existsSync(path.join(process.env.DATAPATH || config?.dataPath, "/database/matrix/direct"));
    let member = fs.existsSync(path.join(process.env.DATAPATH || config?.dataPath, "/database/matrix/member"));
    let EventPosts = fs.existsSync(path.join(process.env.DATAPATH || config?.dataPath, "/database/EventPosts.json"));

    if (database === false) {
        fs.mkdirSync(path.join(process.env.DATAPATH || config?.dataPath, "/database"), { recursive: true });
    }
    if (telegram === false) {
        fs.mkdirSync(path.join(process.env.DATAPATH || config?.dataPath, "/database/telegram"), { recursive: true });
    }
    if (chat === false) {
        fs.mkdirSync(path.join(process.env.DATAPATH || config?.dataPath, "/database/telegram/chat"), { recursive: true });
    }
    if (from === false) {
        fs.mkdirSync(path.join(process.env.DATAPATH || config?.dataPath, "/database/telegram/from"), { recursive: true });
    }
    if (matrix === false) {
        fs.mkdirSync(path.join(process.env.DATAPATH || config?.dataPath, "/database/matrix"), { recursive: true });
    }
    if (room === false) {
        fs.mkdirSync(path.join(process.env.DATAPATH || config?.dataPath, "/database/matrix/room"), { recursive: true });
    }
    if (direct === false) {
        fs.mkdirSync(path.join(process.env.DATAPATH || config?.dataPath, "/database/matrix/direct"), { recursive: true });
    }
    if (member === false) {
        fs.mkdirSync(path.join(process.env.DATAPATH || config?.dataPath, "/database/matrix/member"), { recursive: true });
    }
    if (EventPosts === false) {
        fs.writeJsonSync(path.join(process.env.DATAPATH || config?.dataPath, "/database/EventPosts.json"), []);
    }

}