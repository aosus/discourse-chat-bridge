import { Scenes } from 'telegraf';
import fs from 'fs-extra';
import CreatePosts from '../../discourse/CreatePosts.js';
import getCategories from '../../discourse/getCategories.js';
import Translation from '../../module/translation.js';
import path from 'path';

let __dirname = path.resolve();
let config = fs.readJsonSync(path.join(__dirname, '/config.json'));
let translation = await Translation(`${process.env.LANGUAGE || config?.language}`);

export default new Scenes.WizardScene(
    'CreatePosts',
    async (ctx) => {

        let id_from = ctx?.from?.id;
        let fromJson = fs.readJsonSync(path.join(process.env.DATAPATH || config?.dataPath, `/database/telegram/from/${id_from}.json`));
        if (fromJson?.access === false) {
            let message = `${translation.first_link_your_account} /discourse ❌`
            ctx?.reply(message);
            return ctx.scene.leave();
        }

        else {

            let Categories = await getCategories();
            let message = `<b>${translation.send_category_id} ⬇️</b> \n\n`

            for (let item of Categories) {
                message += `▪ ${item?.name}\n`
                message += `▪ ${translation.id}: ${item?.id}\n\n`
            }

            await ctx.reply(message, { parse_mode: 'HTML' });
            ctx.wizard.state.data = {};
            return ctx.wizard.next();
        }

    },
    async (ctx) => {

        if (ctx.message?.text !== undefined && !isNaN(ctx?.message?.text)) {

            ctx.wizard.state.data.category = Number(ctx.message?.text);
            ctx?.reply(`${translation.topic_title} 📝`)
            return ctx.wizard.next();
        }

        else {
            ctx?.reply(`${translation.err_wrong_entry} ❌`);
            return ctx.scene.leave();
        }
    },
    async (ctx) => {

        if (ctx.message?.text !== undefined) {

            ctx.wizard.state.data.title = ctx.message?.text;
            ctx?.reply(`${translation.topic_content} 📝`)
            return ctx.wizard.next();

        }

        else {
            ctx?.reply(`${translation.err_wrong_entry} ❌`);
            return ctx.scene.leave();
        }

    },
    async (ctx) => {

        if (ctx.message?.text !== undefined) {

            let url = process.env.URL || config?.url
            let id_from = ctx?.from?.id;
            let fromJson = fs.readJsonSync(path.join(process.env.DATAPATH || config?.dataPath, `/database/telegram/from/${id_from}.json`));
            let category = ctx.wizard.state.data.category;
            let title = ctx.wizard.state.data.title;
            let raw = ctx.message?.text;
            let crPo = await CreatePosts(fromJson?.discourse_username, title, raw, category);

            if (crPo?.errors) {
                for (let item of crPo?.errors) {
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
            ctx?.reply(`${translation.err_wrong_entry} ❌`);
            return ctx.scene.leave();
        }

    },
)