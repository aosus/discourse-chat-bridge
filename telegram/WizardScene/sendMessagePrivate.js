import { Scenes, Markup } from 'telegraf';
import fs from 'fs-extra';
import sendMessagePrivate from '../../discourse/sendMessagePrivate.js';
import Translation from '../../module/translation.js';

let config = fs.readJsonSync('./config.json');
let translation = await Translation(`${process.env.language || config?.language}`);

export default new Scenes.WizardScene(
    'sendMessagePrivate',
    async (ctx) => {

        let id_from = ctx?.from?.id;
        let fromJson = fs.readJsonSync(`./database/telegram/from/${id_from}.json`);
        if (fromJson?.access === false) {
            let message = `${translation.first_link_your_account} /discourse ❌`
            ctx?.reply(message);
            return ctx.scene.leave();
        }

        else {

            ctx?.reply(`${translation.username_send_to} 📝`);

            ctx.wizard.state.data = {};
            return ctx.wizard.next();
        }
    },
    async (ctx) => {

        if (ctx.message?.text !== undefined) {

            ctx.wizard.state.data.username = ctx.message?.text
            ctx?.reply(`${translation.title_message_private} 📝`);
            return ctx.wizard.next();
        }

        else {
            ctx?.reply(`${translation.err_wrong_entry} ❌`);
            return ctx.scene.leave();
        }
    },
    async (ctx) => {

        if (ctx.message?.text !== undefined) {

            ctx.wizard.state.data.title = ctx.message?.text
            ctx?.reply(`${translation.content_message_private} 📝`);
            return ctx.wizard.next();
        }

        else {
            ctx?.reply(`${translation.err_wrong_entry} ❌`);
            return ctx.scene.leave();
        }
    },
    async (ctx) => {

        if (ctx.message?.text !== undefined) {

            let id_from = ctx?.from?.id;
            let fromJson = fs.readJsonSync(`./database/telegram/from/${id_from}.json`);
            let title = ctx.wizard.state.data.title;
            let raw = ctx.message?.text;
            let sendTo = ctx.wizard.state.data.username;
            let sePr = await sendMessagePrivate(fromJson?.useername_discourse, title, raw, sendTo);
            if (sePr?.errors) {

                for (let item of sePr?.errors) {
                    ctx?.reply(item);
                }
            }

            else {
                ctx?.reply(`${translation.message_sent} ✅`);
            }
            return ctx.scene.leave();

        }

        else {
            ctx?.reply(`${translation.err_wrong_entry} ❌`);
            return ctx.scene.leave();
        }

    },
)