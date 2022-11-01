import database_telegram from '../../module/database_telegram.js';
import fs from 'fs-extra';
import Translation from '../../module/translation.js';

export default async function start(client, Markup) {

    client.start(async (ctx) => {
        let config = fs.readJsonSync('./config.json');
        let translation = await Translation(`${process.env.language || config?.language}`);
        let id_from = ctx?.from?.id;
        let id_chat = ctx?.chat?.id;
        let username_from = ctx?.from?.username;
        let username_chat = ctx?.chat?.username;
        let name_from = ctx?.from?.first_name ? ctx?.from?.first_name : ctx?.from?.last_name ? ctx?.from?.last_name : undefined;
        let name_chat = ctx?.chat?.first_name ? ctx?.chat?.first_name : ctx?.chat?.last_name ? ctx?.chat?.last_name : ctx?.chat?.title;
        let type = ctx?.chat?.type;
        let message_id = ctx?.message?.message_id;
        let but_1 = [
            Markup.button.url(process.env.title_discourse || config?.title_discourse, process.env.url || config?.url)
        ];
        let button = Markup.inlineKeyboard([but_1]);
        let message = `<b>${translation.welcome} ${name_from} ${translation.in_the_bridge} ${process.env.title_discourse || config?.title_discourse} 👋</b> \n\n`
        message += `▪ ${translation.view_last_topic} 📄 \n/get_latest_posts \n`
        message += `▪ ${translation.view_categories} ⬇️ \n/getCategories \n`
        message += `▪ ${translation.write_new_topic} 📝 \n/CreatePosts \n`
        message += `▪ ${translation.write_new_comment} 💬 \n/sendComment \n`
        message += `▪ ${translation.send_message_private} 🔒 \n/sendMessagePrivate \n`
        message += `▪ ${translation.link_your_account_to} ${process.env.title_discourse || config?.title_discourse} \n/discourse \n`
        message += `▪ ${translation.activate_the_bot} \n/activation`

        if (type === 'group' || type === 'supergroup') {

            await database_telegram(id_from, username_from, name_from, 'from'); // from || user
            await database_telegram(id_chat, username_chat, name_chat, 'chat', message_id); // chat || supergroup or group
            await ctx.reply(message, { parse_mode: 'HTML', reply_markup: button.reply_markup });

        }

        else if (type === 'private') {

            await database_telegram(id_chat, username_chat, name_chat, 'from', message_id); // from || user
            await ctx.reply(message, { parse_mode: 'HTML', reply_markup: button.reply_markup });

        }

    });

}