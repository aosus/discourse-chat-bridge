import database_telegram from '../../module/database_telegram.js';
import fs from 'fs-extra';

export default async function start(client, Markup) {

    client.start(async (ctx) => {
        let config = fs.readJsonSync('./config.json');
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
        let message = `<b>مرحبا بك ${name_from} في جسر ${process.env.title_discourse || config?.title_discourse} 👋</b> \n\n`
        message += '▪ عرض آخر موضوع تم نشره 📄 \n/get_latest_posts \n'
        message += '▪ عرض الفئات ⬇️ \n/getCategories \n'
        message += '▪ كتابة موضوع جديد 📝 \n/CreatePosts \n'
        message += '▪ كتابة تعليق جديد 💬 \n/sendComment \n'
        message += '▪ إرسال رسالة خاصة 🔒 \n/sendMessagePrivate \n'
        message += `▪ ربط حسابك على ${process.env.title_discourse || config?.title_discourse} \n/discourse \n`
        message += '▪ تفعيل البوت \n/activation'

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