import { Scenes } from 'telegraf';
import fs from 'fs-extra';
import getCategories from '../../discourse/getCategories.js';

export default new Scenes.WizardScene(
    'activation',
    async (ctx) => {
        let type = ctx?.chat?.type;
        let id_from = ctx?.from?.id;
        let id_chat = ctx?.chat?.id;

        if (type === 'private') {
            let fromJson = fs.readJsonSync(`./database/telegram/from/${id_from}.json`);
            if (fromJson?.evenPost) {
                await ctx?.reply('البوت مفعل في المحادثة بالفعل ⁉️');
                return ctx.scene.leave();
            }
            else {
                fromJson.evenPost = true
                fromJson.categories = 0
                fs.writeJsonSync(`./database/telegram/from/${id_from}.json`, fromJson, { spaces: '\t' });
                await ctx?.reply('تم تفعيل البوت ✅');
                return ctx.scene.leave();
            }
        }

        else {

            let chatJson = fs.readJsonSync(`./database/telegram/chat/${id_chat}.json`);

            if (chatJson?.evenPost) {

                let Administrators = await ctx?.getChatAdministrators();
                let checkAdmin = Administrators?.some(e => e?.user?.id === ctx?.from?.id);
                if (checkAdmin === false) {
                    await ctx?.reply('يجب ان تكون مشرف لتفعيل البوت ❌');
                }

                else {
                    await ctx?.reply('البوت مفعل في المحادثة بالفعل ⁉️');
                }

                return ctx.scene.leave();
            }

            else {
                let Administrators = await ctx?.getChatAdministrators();
                let checkAdmin = Administrators?.some(e => e?.user?.id === ctx?.from?.id);
                if (checkAdmin) {
                    await getCategories().then(async e => {

                        let message = '<b>قم بإرسال معرف الفئة لتلقي آخر المواضيع</b> \n\n'
                        for (let item of e) {

                            message += `▪ ${item?.name}\n`
                            message += `▪ المعرف: ${item?.id}\n\n`

                        }
                        message += 'لتلقي المواضيع من جميع الفئات ارسل رقم 0'
                        await ctx?.reply(message, { parse_mode: 'HTML' });
                    });
                    return ctx.wizard.next();
                }

                else {
                    await ctx?.reply('يجب ان تكون مشرف لتفعيل البوت ❌');
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
            ctx?.reply('تم تفعيل البوت ✅');
            return ctx.scene.leave();
        }

        else {
            ctx?.reply('إدخال خاطئ ❌');
            return ctx.scene.leave();
        }
    }
)