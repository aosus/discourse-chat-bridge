import { Telegraf, Markup, Scenes, session } from 'telegraf';
import fs from 'fs-extra';
import command from './command/index.js';
import WizardScene from './WizardScene/WizardScene.js';
import join_left from './join_left.js';
import EventText from './EventText.js';
import EventPosts_ from './EventPosts_.js';

export default async function telegram() {

    try {

        let config = fs.readJsonSync('./config.json');
        let options = { channelMode: true, polling: true };
        let client = new Telegraf(process.env.token_telegram || config?.token_telegram, options);
        let stage = new Scenes.Stage(WizardScene);
        client.use(session())
        client.use(stage.middleware());
        await join_left(client); // إنظمام ومغادرة الأعضاء
        await command(client, Markup); // أوامر البوت
        await EventText(client); // حدث تلقي رسالة جديده
        await EventPosts_(client); // حدث عند إنشاء موصوع جديد على discourse
        client.launch().then(() => console.log('Telegram is ready!'));
        client.catch((error) => {
            console.log(error);
        });

    } catch (error) {

        console.log(error);

    }

}