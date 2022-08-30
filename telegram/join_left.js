import fs from 'fs-extra';
import database_telegram from '../module/database_telegram.js';

export default async function join_left(client) {

    client.on("my_chat_member", async (ctx) => {

        let config = fs.readJsonSync('config.json');
        let id_from = ctx?.from?.id;
        let id_chat = ctx?.chat?.id;
        let username_chat = ctx?.chat?.username;
        let name_from = ctx?.from?.first_name ? ctx?.from?.first_name : ctx?.from?.last_name ? ctx?.from?.last_name : undefined;
        let name_chat = ctx?.chat?.first_name ? ctx?.chat?.first_name : ctx?.chat?.last_name ? ctx?.chat?.last_name : ctx?.chat?.title;
        let type = ctx?.chat?.type;

        if (ctx?.update?.my_chat_member?.new_chat_member?.status === 'member' || ctx?.update?.my_chat_member?.new_chat_member?.status === 'administrator') {

            if (type === 'private') {
                await database_telegram(id_chat, username_chat, name_chat, 'from');
            }

            else {
                await database_telegram(id_chat, username_chat, name_chat, 'chat');
            }
        }

        else if (ctx?.update?.my_chat_member?.new_chat_member?.status === 'left' || ctx?.update?.my_chat_member?.new_chat_member?.status === 'kicked') {

            if (type === 'private') {

                let fromJson = fs.readJsonSync(`./database/telegram/from/${id_from}.json`);
                fromJson.evenPost = false
                fromJson.categories = null
                fromJson.access = false
                fs.writeJsonSync(`./database/telegram/from/${id_from}.json`, fromJson, { spaces: '\t' });

            }

            else {

                let chatJson = fs.readJsonSync(`./database/telegram/chat/${id_chat}.json`);
                chatJson.evenPost = false
                chatJson.categories = null
                chatJson.access = false
                fs.writeJsonSync(`./database/telegram/chat/${id_chat}.json`, chatJson, { spaces: '\t' });
            }

        }
    });

}