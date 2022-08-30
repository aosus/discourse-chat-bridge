import { Scenes } from 'telegraf';
import fs from 'fs-extra';
import CreatePosts from '../../discourse/CreatePosts.js';
import getCategories from '../../discourse/getCategories.js';

export default new Scenes.WizardScene(
    'CreatePosts',
    async (ctx) => {

        let id_from = ctx?.from?.id;
        let fromJson = fs.readJsonSync(`./database/telegram/from/${id_from}.json`);
        if (fromJson?.access === false) {
            let message = 'يجب عليك اولاً ربط حسابك /discourse ❌'
            ctx?.reply(message);
            return ctx.scene.leave();
        }

        else {

            let Categories = await getCategories();
            let message = '<b>قم بإرسال رقم الفئة ⬇️</b> \n\n'

            for (let item of Categories) {
                message += `▪ ${item?.name}\n`
                message += `▪ المعرف: ${item?.id}\n\n`
            }

            await ctx.reply(message, { parse_mode: 'HTML' });
            ctx.wizard.state.data = {};
            return ctx.wizard.next();
        }

    },
    async (ctx) => {

        if (ctx.message?.text !== undefined && !isNaN(ctx?.message?.text)) {

            ctx.wizard.state.data.category = Number(ctx.message?.text);
            ctx?.reply('قم بكتابة عنوان الموضوع 📝')
            return ctx.wizard.next();
        }

        else {
            ctx?.reply('إدخال خاطئ ❌');
            return ctx.scene.leave();
        }
    },
    async (ctx) => {

        if (ctx.message?.text !== undefined) {

            ctx.wizard.state.data.title = ctx.message?.text;
            ctx?.reply('قم بكتابة محتوى الموضوع 📝')
            return ctx.wizard.next();

        }

        else {
            ctx?.reply('إدخال خاطئ ❌');
            return ctx.scene.leave();
        }

    },
    async (ctx) => {

        if (ctx.message?.text !== undefined) {

            let config = fs.readJsonSync('config.json');
            let url = config?.url
            let id_from = ctx?.from?.id;
            let fromJson = fs.readJsonSync(`./database/telegram/from/${id_from}.json`);
            let category = ctx.wizard.state.data.category;
            let title = ctx.wizard.state.data.title;
            let raw = ctx.message?.text;
            let crPo = await CreatePosts(fromJson?.useername_discourse, title, raw, category);

            if (crPo?.errors) {
                for (let item of Private?.errors) {
                    ctx?.reply(item);
                }
            }

            else {
                let topic_id = crPo?.topic_id;
                let topic_title = ctx.wizard.state.data.title;
                let topic_slug = crPo?.topic_slug;
                let message = `<b><a href='${url}/t/${topic_slug}/${topic_id}'>${topic_title}</a></b> \n`
                await ctx?.reply(message, { parse_mode: 'HTML', disable_web_page_preview: true });
            }

            return ctx.scene.leave()
        }

        else {
            ctx?.reply('إدخال خاطئ ❌');
            return ctx.scene.leave();
        }

    },
)