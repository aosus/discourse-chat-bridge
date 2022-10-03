import fetch from 'node-fetch';
import fs from 'fs-extra';
import moment from 'moment-hijri';
import sendFile from '../sendFile.js';
import get_latest_posts from '../../discourse/get_latest_posts.js';
import getCategories from '../../discourse/getCategories.js';
import { database_matrix_member } from '../../module/database_matrix.js';
moment.locale('en-EN');

export default {
    async exec({ meId, roomId, sender, name, checkRoom, roomIdOrAlias, body, replyBody, replySender, roomName, event_id, usersAdmin, RichReply, event, client }) {

        let config = fs.readJsonSync('config.json');
        let memberJson = fs.readJsonSync(`./database/matrix/member/${sender}.json`);
        let roomJson = fs.readJsonSync(`./database/matrix/${checkRoom}/${roomId}.json`);

        if (body === '1' || body === '١' || body === 'get_latest_posts') {

            let get = await get_latest_posts().catch(error => console.log(error));
            let response = await fetch(config?.url + `/t/${get?.topic_slug}/${get?.topic_id}`, { method: 'GET' });
            let data = await response?.text();

            if (data.includes('itemprop="image"')) {

                let preview = data.split('itemprop="image" href="')[1]?.split('">')[0];
                let caption = `<b><a href='${config?.url}/t/${get?.topic_slug}/${get?.topic_id}'>${get?.topic_title}</a></b> <br><br>`;
                caption += `<b>الكاتب:</b> <a href='${config?.url}/u/${get?.username}'>${get?.name}</a> <br>`;
                caption += `<b>التاريخ:</b> ${moment(get?.created_at).format('iYYYY/iM/iD')}<br>`;
                caption += `<b>رقم الموضوع:</b> ${get?.topic_id}`;
                let reply = RichReply.createFor(roomId, event, caption, caption);

                await sendFile(roomId, preview, 'm.image', client).catch(error => console.log(error));
                await client.sendMessage(roomId, reply).catch(error => console.log(error));

            }

            else {
                let caption = `<b><a href='${config?.url}/t/${get?.topic_slug}/${get?.topic_id}'>${get?.topic_title}</a></b> <br><br>`;
                caption += `<b>الكاتب:</b> <a href='${config?.url}/u/${get?.username}'>${get?.name}</a> <br>`;
                caption += `<b>التاريخ:</b> ${moment(get?.created_at).format('iYYYY/iM/iD')}<br>`;
                caption += `<b>رقم الموضوع:</b> ${get?.topic_id}`;
                let reply = RichReply.createFor(roomId, event, caption, caption);
                await client.sendMessage(roomId, reply).catch(error => console.log(error));
            }

        }

        else if (body === '2' || body === '٢' || body === 'getCategories') {

            let Categories = await getCategories().catch(error => console.log(error));
            let url = config?.url;
            let title = config?.title_discourse;
            let message = `فئات ${title} ⬇️<br><br>`

            for (let item of Categories) {
                let id = item?.id;
                let name = item?.name;
                let topics_all_time = item?.topics_all_time;
                let slug = item?.slug
                message += `<b><a href='${url}/c/${slug}/${id}'>${name}</a></b> <br>`
                message += `عدد المواضيع المنشورة: ${topics_all_time}<br>`
            }

            let reply = RichReply.createFor(roomId, event, message, message);
            await client.sendMessage(roomId, reply).catch(error => console.log(error));

        }

        else if (body === '3' || body === '٣' || body === 'CreatePosts') {

            if (memberJson?.access) {

                await database_matrix_member({ sender: sender, menu: 'CreatePosts_1' }).catch(error => console.log(error));
                let Categories = await getCategories().catch(error => console.log(error));
                let message = '<b>قم بإرسال رقم الفئة ⬇️</b> <br><br>'

                for (let item of Categories) {
                    message += `▪ ${item?.name}<br>`
                    message += `▪ المعرف: ${item?.id}<br><br>`
                }
                let reply = RichReply.createFor(roomId, event, message, message);
                await client.sendMessage(roomId, reply).catch(error => console.log(error));
            }

            else {
                let message = 'يجب عليك اولاً ربط حسابك بإرسال كلمة discourse او رقم 6 ❌'
                let reply = RichReply.createFor(roomId, event, message, message);
                await client.sendMessage(roomId, reply).catch(error => console.log(error));
            }

        }

        else if (body === '4' || body === '٤' || body === 'sendComment') {

            if (memberJson?.access) {

                await database_matrix_member({ sender: sender, menu: 'sendComment_1' }).catch(error => console.log(error));
                let message = 'قم بإرسال رقم او رابط الموضوع 🌐'
                let reply = RichReply.createFor(roomId, event, message, message);
                await client.sendMessage(roomId, reply).catch(error => console.log(error));
            }

            else {
                let message = 'يجب عليك اولاً ربط حسابك بإرسال كلمة discourse او رقم 6 ❌'
                let reply = RichReply.createFor(roomId, event, message, message);
                await client.sendMessage(roomId, reply).catch(error => console.log(error));
            }

        }

        else if (body === '5' || body === '٥' || body === 'sendMessagePrivate') {

            if (memberJson?.access) {

                await database_matrix_member({ sender: sender, menu: 'sendMessagePrivate_1' }).catch(error => console.log(error));
                let message = 'قم بكتابة إسم المستخدم المرسل اليه 📝'
                let reply = RichReply.createFor(roomId, event, message, message);
                await client.sendMessage(roomId, reply).catch(error => console.log(error));
            }

            else {
                let message = 'يجب عليك اولاً ربط حسابك بإرسال كلمة discourse او رقم 6 ❌'
                let reply = RichReply.createFor(roomId, event, message, message);
                await client.sendMessage(roomId, reply).catch(error => console.log(error));
            }

        }

        else if (body === '6' || body === '٦' || body === 'discourse') {

            if (checkRoom === 'direct') {

                if (memberJson?.access) {

                    let message = 'الحساب مربوط بمنصة discourse بالفعل ⁉️'
                    let reply = RichReply.createFor(roomId, event, message, message);
                    await client.sendMessage(roomId, reply).catch(error => console.log(error));
                }

                else {

                    await database_matrix_member({ sender: sender, menu: 'discourse_1' }).catch(error => console.log(error));
                    let message = 'قم بكتابة إسم المستخدم الخاص بك على منصة discourse 📝<br><br>الإسم بدون علامة @'
                    let reply = RichReply.createFor(roomId, event, message, message);
                    await client.sendMessage(roomId, reply).catch(error => console.log(error));

                }

            }

            else {
                let message = 'قم بالدخول على الخاص لربط حسابك ⚠️'
                let reply = RichReply.createFor(roomId, event, message, message);
                await client.sendMessage(roomId, reply).catch(error => console.log(error));
            }

        }

        else if (body === '7' || body === '٧' || body === 'activation') {

            if (checkRoom === 'room') {
                if (roomJson?.evenPost) {

                    let message = 'البوت مفعل في المحادثة بالفعل ⁉️';
                    let reply = RichReply.createFor(roomId, event, message, message);
                    await client.sendMessage(roomId, reply).catch(error => console.log(error));

                }

                else {

                    if (usersAdmin?.includes(sender)) {

                        await getCategories().then(async e => {

                            let message = '<b>قم بإرسال معرف الفئة لتلقي آخر المواضيع</b> <br><br>'
                            for (let item of e) {

                                message += `▪ ${item?.name}<br>`
                                message += `▪ المعرف: ${item?.id}<br><br>`

                            }
                            message += 'لتلقي المواضيع من جميع الفئات ارسل رقم 0'
                            let reply = RichReply.createFor(roomId, event, message, message);
                            await client.sendMessage(roomId, reply).catch(error => console.log(error));
                            await database_matrix_member({ sender: sender, menu: 'activation' }).catch(error => console.log(error));
                        });

                    }

                    else {

                        let message = 'يجب ان تكون مشرف لتفعيل البوت ❌';
                        let reply = RichReply.createFor(roomId, event, message, message);
                        await client.sendMessage(roomId, reply).catch(error => console.log(error));
                    }

                }
            }

            else if (checkRoom === 'direct') {

                if (roomJson?.evenPost) {

                    let message = 'البوت مفعل في المحادثة بالفعل ⁉️';
                    let reply = RichReply.createFor(roomId, event, message, message);
                    await client.sendMessage(roomId, reply).catch(error => console.log(error));

                }

                else {

                    let message = 'تم تفعيل البوت ✅';
                    let reply = RichReply.createFor(roomId, event, message, message);
                    roomJson.evenPost = true;
                    roomJson.categories = 0;
                    fs.writeJsonSync(`./database/matrix/${checkRoom}/${roomId}.json`, roomJson, { spaces: '\t' });
                    await client.sendMessage(roomId, reply).catch(error => console.log(error));
                }

            }

        }

    }
}