import { Scenes } from 'telegraf';
import fs from 'fs-extra';
import getCategories from '../../discourse/getCategories.js';
import Translation from '../../module/translation.js';

let config = fs.readJsonSync('./config.json');
let translation = await Translation(`${process.env.LANGUAGE || config?.language}`);

export default new Scenes.WizardScene(
    'activation',
    async (ctx) => {
        let type = ctx?.chat?.type;
        let id_from = ctx?.from?.id;
        let id_chat = ctx?.chat?.id;

        if (type === 'private') {
            let fromJson = fs.readJsonSync(`./database/telegram/from/${id_from}.json`);
            if (fromJson?.evenPost) {
                await ctx?.reply(`${translation.err_active_in_the_chat} ⁉️`);
                return ctx.scene.leave();
            }
            else {
                fromJson.evenPost = true
                fromJson.categories = 0
                fs.writeJsonSync(`./database/telegram/from/${id_from}.json`, fromJson, { spaces: '\t' });
                await ctx?.reply(`${translation.active_bot} ✅`);
                return ctx.scene.leave();
            }
        }

        else {

            let chatJson = fs.readJsonSync(`./database/telegram/chat/${id_chat}.json`);

            if (chatJson?.evenPost) {

                let Administrators = await ctx?.getChatAdministrators();
                let checkAdmin = Administrators?.some(e => e?.user?.id === ctx?.from?.id);
                if (checkAdmin === false) {
                    await ctx?.reply(`${translation.admin_activate} ❌`);
                }

                else {
                    await ctx?.reply(`${translation.err_active_in_the_chat} ⁉️`);
                }

                return ctx.scene.leave();
            }

            else {
                let Administrators = await ctx?.getChatAdministrators();
                let checkAdmin = Administrators?.some(e => e?.user?.id === ctx?.from?.id);
                if (checkAdmin) {
                    await getCategories().then(async e => {

                        let message = `<b>${translation.category_id}</b> \n\n`
                        for (let item of e) {

                            message += `▪ ${item?.name}\n`
                            message += `▪ ${translation.id}: ${item?.id}\n\n`

                        }
                        message += `${translation.category_id_all}`
                        await ctx?.reply(message, { parse_mode: 'HTML' });
                    });
                    return ctx.wizard.next();
                }

                else {
                    await ctx?.reply(`${translation.admin_activate} ❌`);
                    return ctx.scene.leave();
                }
            }

        }

    },
    async (ctx) => {

        let id_chat = ctx?.chat?.id;

        if (ctx?.message?.text !== undefined && !isNaN(ctx?.message?.text)) {

            let chatJson = fs.readJsonSync(`./database/telegram/chat/${id_chat}.json`);
            chatJson.categories = Number(ctx?.message?.text);
            chatJson.evenPost = true
            fs.writeJsonSync(`./database/telegram/chat/${id_chat}.json`, chatJson, { spaces: '\t' });
            ctx?.reply(`${translation.active_bot} ✅`);
            return ctx.scene.leave();
        }

        else {
            ctx?.reply(`${translation.err_wrong_entry} ❌`);
            return ctx.scene.leave();
        }
    }
)