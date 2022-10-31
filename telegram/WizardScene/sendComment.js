import { Scenes } from 'telegraf';
import fs from 'fs-extra';
import sendComment from '../../discourse/sendComment.js';

let config = fs.readJsonSync('./config.json');

export default new Scenes.WizardScene(
    'sendComment',
    async (ctx) => {
        let id_from = ctx?.from?.id;
        let fromJson = fs.readJsonSync(`./database/telegram/from/${id_from}.json`);
        if (fromJson?.access === false) {
            let message = 'يجب عليك اولاً ربط حسابك /discourse ❌'
            ctx?.reply(message);
            return ctx.scene.leave();
        }

        else {

            ctx?.reply('قم بإرسال رقم او رابط الموضوع 🌐');
            ctx.wizard.state.data = {};
            return ctx.wizard.next();
        }
    },
    async (ctx) => {

        if (ctx.message?.text !== undefined) {

            let text = ctx.message?.text;

            if (text.includes(process.env.url || config?.url)) {

                let sp = text.split('');

                if (sp[sp.length - 1] === '/') {

                    ctx.wizard.state.data.topic_id = Number(text.split('/').slice(-2)[0]);
                    ctx?.reply('قم بكتابة التعليق 📝');

                }

                else {

                    ctx.wizard.state.data.topic_id = Number(text.split('/').slice(-1)[0]);
                    ctx?.reply('قم بكتابة التعليق 📝');

                }

            }

            else if (!isNaN(text)) {

                ctx.wizard.state.data.topic_id = Number(text);
                ctx?.reply('قم بكتابة التعليق 📝');
            }

            return ctx.wizard.next();
        }

        else {
            ctx?.reply('إدخال خاطئ ❌');
            return ctx.scene.leave();
        }
    },
    async (ctx) => {

        if (ctx.message?.text !== undefined) {

            let url = process.env.url || config?.url
            let id_from = ctx?.from?.id;
            let fromJson = fs.readJsonSync(`./database/telegram/from/${id_from}.json`);
            let raw = ctx.message?.text;
            let topic_id = ctx.wizard.state.data.topic_id
            let seCo = await sendComment(fromJson?.useername_discourse, topic_id, raw);

            if (seCo?.errors) {
                for (let item of seCo?.errors) {
                    ctx?.reply(item);
                }
            }

            else {
                let topic_slug = seCo?.topic_slug
                let topic_id = seCo?.topic_id
                let post_number = seCo?.post_number
                let message = `<b>تم نشر التعليق ✅ <a href='${url}/t/${topic_slug}/${topic_id}'>${post_number}</a></b>`
                await ctx?.reply(message, { parse_mode: 'HTML', disable_web_page_preview: true });
            }
            return ctx.scene.leave();
        }

        else {
            ctx?.reply('إدخال خاطئ ❌');
            return ctx.scene.leave();
        }

    }
)