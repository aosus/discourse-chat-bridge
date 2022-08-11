import { Telegraf } from 'telegraf';
import fs from 'fs-extra';
import path from "path";

export default async function getUserTelegram(id) {

    try {

        let config = await fs.readJson(path.join(path.resolve(), './config.json')).catch(e => console.log(e));
        let bot = new Telegraf(config.Token_Bot_Telegram);
        let getChat = await bot.telegram.getChat(id);

        bot.launch();

        return getChat?.username ? getChat?.username : getChat?.first_name;

    } catch (error) {

        return 'aosus'

    }

}