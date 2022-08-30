import { Scenes } from 'telegraf';
import fs from 'fs-extra';
import sendMessagePrivate from '../../discourse/sendMessagePrivate.js';

export default new Scenes.WizardScene(
    'discourse',
    async (ctx) => {
        let id_from = ctx?.from?.id;
        let fromJson = fs.readJsonSync(`./database/telegram/from/${id_from}.json`);

        if (ctx?.chat?.type === 'supergroup' || ctx?.chat?.type === 'group') {

            await ctx?.reply('قم بالدخول على الخاص لربط حسابك ⚠️');
            return ctx.scene.leave();

        }

        else {
            if (fromJson?.access) {
                await ctx?.reply('الحساب مربوط بمنصة discourse بالفعل ⁉️');
                return ctx.scene.leave();
            }

            else {
                await ctx?.reply('قم بكتابة إسم المستخدم الخاص بك على منصة discourse 📝\n\nالإسم بدون علامة @');
                return ctx.wizard.next();
            }
        }
    },
    async (ctx) => {

        if (ctx.message?.text !== undefined) {
            let id_from = ctx?.from?.id;
            let config = fs.readJsonSync(`config.json`);
            let fromJson = fs.readJsonSync(`./database/telegram/from/${id_from}.json`);
            fromJson.useername_discourse = ctx.message?.text;
            fs.writeJsonSync(`./database/telegram/from/${id_from}.json`, fromJson, { spaces: '\t' });
            let title = 'رمز التحقق الخاص بك'
            let raw = `رمز التحقق الخاص بـ ${fromJson?.username ? '@' + fromJson?.username : fromJson?.name} \n\n`;
            raw += fromJson?.verification_code;
            let Private = await sendMessagePrivate(config?.useername_discourse, title, raw, ctx.message?.text);
            if (Private?.errors) {
                for (let item of Private?.errors) {
                    ctx?.reply(item);
                }
                return ctx.scene.leave();
            }
            else {
                await ctx?.reply('تم إرسال رمز التحقق الخاص بك على الخاص على منصة discourse ✅');
                await ctx?.reply('قم بكتابة الرمز المرسل إليك لتفعيل الجسر 📝');
                return ctx.wizard.next();
            }
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
            if (fromJson?.verification_code === ctx.message?.text) {

                fromJson.access = true
                fs.writeJsonSync(`./database/telegram/from/${id_from}.json`, fromJson, { spaces: '\t' });
                ctx?.reply('تم تفعيل الجسر ✅');
            }
            else {
                ctx?.reply('الرمز المدخل خاطئ ❌');
            }
            return ctx.scene.leave();
        }
        else {
            ctx?.reply('إدخال خاطئ ❌');
            return ctx.scene.leave();
        }
    },
)