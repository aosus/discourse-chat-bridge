import { Scenes } from 'telegraf';
import fs from 'fs-extra';
import sendMessagePrivate from '../../discourse/sendMessagePrivate.js';
import Translation from '../../module/translation.js';

let config = fs.readJsonSync('./config.json');
let translation = await Translation(`${process.env.language || config?.language}`);

export default new Scenes.WizardScene(
    'discourse',
    async (ctx) => {
        let id_from = ctx?.from?.id;
        let fromJson = fs.readJsonSync(`./database/telegram/from/${id_from}.json`);

        if (ctx?.chat?.type === 'supergroup' || ctx?.chat?.type === 'group') {

            await ctx?.reply(`${translation.send_me_private_message_to_link_your_account} ⚠️`);
            return ctx.scene.leave();

        }

        else {
            if (fromJson?.access) {
                await ctx?.reply(`${translation.err_linked_to_discourse} ⁉️`);
                return ctx.scene.leave();
            }

            else {
                await ctx?.reply(`${translation.enter_your_username_discourse} 📝\n\n${translation.sign_}`);
                return ctx.wizard.next();
            }
        }
    },
    async (ctx) => {

        if (ctx.message?.text !== undefined) {
            let id_from = ctx?.from?.id;
            let fromJson = fs.readJsonSync(`./database/telegram/from/${id_from}.json`);
            fromJson.discourse_username = ctx.message?.text;
            fs.writeJsonSync(`./database/telegram/from/${id_from}.json`, fromJson, { spaces: '\t' });
            let title = `${translation.verification_code}`
            let raw = `${translation.verification_code_for} ${fromJson?.username ? '@' + fromJson?.username : fromJson?.name} \n\n`;
            raw += fromJson?.verification_code;
            let Private = await sendMessagePrivate(process.env.discourse_username || config?.discourse_username, title, raw, ctx.message?.text);
            if (Private?.errors) {
                for (let item of Private?.errors) {
                    ctx?.reply(item);
                }
                return ctx.scene.leave();
            }
            else {
                await ctx?.reply(`${translation.send_verification_code} ✅`);
                await ctx?.reply(`${translation.write_verification_code} 📝`);
                return ctx.wizard.next();
            }
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
            if (fromJson?.verification_code === ctx.message?.text) {

                fromJson.access = true
                fs.writeJsonSync(`./database/telegram/from/${id_from}.json`, fromJson, { spaces: '\t' });
                ctx?.reply(`${translation.active_bridge} ✅`);
            }
            else {
                ctx?.reply(`${translation.err_verification_code}❌`);
            }
            return ctx.scene.leave();
        }
        else {
            ctx?.reply(`${translation.err_wrong_entry} ❌`);
            return ctx.scene.leave();
        }
    },
)