import { Scenes, Markup } from 'telegraf';
import fs from 'fs-extra';
import sendMessagePrivate from '../../discourse/sendMessagePrivate.js';

export default new Scenes.WizardScene(
    'sendMessagePrivate',
    async (ctx) => {

        let id_from = ctx?.from?.id;
        let fromJson = fs.readJsonSync(`./database/telegram/from/${id_from}.json`);
        if (fromJson?.access === false) {
            let message = 'يجب عليك اولاً ربط حسابك /discourse ❌'
            ctx?.reply(message);
            return ctx.scene.leave();
        }

        else {

            ctx?.reply('قم بكتابة إسم المستخدم المرسل اليه 📝');

            ctx.wizard.state.data = {};
            return ctx.wizard.next();
        }
    },
    async (ctx) => {

        if (ctx.message?.text !== undefined) {

            ctx.wizard.state.data.username = ctx.message?.text
            ctx?.reply('قم بكتابة عنوان الرسالة 📝');
            return ctx.wizard.next();
        }

        else {
            ctx?.reply('إدخال خاطئ ❌');
            return ctx.scene.leave();
        }
    },
    async (ctx) => {

        if (ctx.message?.text !== undefined) {

            ctx.wizard.state.data.title = ctx.message?.text
            ctx?.reply('قم بكتابة الرسالة 📝');
            return ctx.wizard.next();
        }

        else {
            ctx?.reply('إدخال خاطئ ❌');
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
                ctx?.reply('تم إرسال الرسالة ✅');
            }
            return ctx.scene.leave();

        }

        else {
            ctx?.reply('إدخال خاطئ ❌');
            return ctx.scene.leave();
        }

    },
)
