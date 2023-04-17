import fetch from 'node-fetch';
import fs from 'fs-extra';
import moment from 'moment-hijri';
import sendFile from '../sendFile.js';
import get_latest_posts from '../../discourse/get_latest_posts.js';
import getCategories from '../../discourse/getCategories.js';
import { database_matrix_member } from '../../module/database_matrix.js';
import Translation from '../../module/translation.js';
import path from 'path';
moment.locale('en-EN');

export default {
    async exec({ meId, roomId, sender, name, checkRoom, roomIdOrAlias, body, replyBody, replySender, roomName, event_id, usersAdmin, RichReply, event, client }) {

        let __dirname = path.resolve();
        let config = fs.readJsonSync(path.join(__dirname, '/config.json'));
        let memberJson = fs.readJsonSync(path.join(process.env.DATAPATH || config?.dataPath, `/database/matrix/member/${sender}.json`));
        let roomJson = fs.readJsonSync(path.join(process.env.DATAPATH || config?.dataPath, `/database/matrix/${checkRoom}/${roomId}.json`));
        let translation = await Translation(`${process.env.LANGUAGE || config?.language}`);

        if (body === '1' || body === '١' || body === 'get_latest_posts') {

            let get = await get_latest_posts().catch(error => console.log(error));
            let response = await fetch(process.env.URL || config?.url + `/t/${get?.topic_slug}/${get?.topic_id}`, { method: 'GET' });
            let data = await response?.text();

            if (data.includes('itemprop="image"')) {

                let preview = data.split('itemprop="image" href="')[1]?.split('">')[0];
                let caption = `<b><a href='${process.env.URL || config?.url}/t/${get?.topic_slug}/${get?.topic_id}'>${get?.topic_title}</a></b> <br><br>`;
                caption += `<b>${translation.writer}:</b> <a href='${process.env.URL || config?.url}/u/${get?.username}'>${get?.name}</a> <br>`;
                caption += `<b>${translation.date}:</b> ${moment(get?.created_at).format('iYYYY/iM/iD')}<br>`;
                caption += `<b>${translation.number_topic}:</b> ${get?.topic_id}`;
                let reply = RichReply.createFor(roomId, event, caption, caption);

                await sendFile(roomId, preview, 'm.image', client).catch(error => console.log(error));
                await client.sendMessage(roomId, reply).catch(error => console.log(error));

            }

            else {
                let caption = `<b><a href='${process.env.URL || config?.url}/t/${get?.topic_slug}/${get?.topic_id}'>${get?.topic_title}</a></b> <br><br>`;
                caption += `<b>${translation.writer}:</b> <a href='${process.env.URL || config?.url}/u/${get?.username}'>${get?.name}</a> <br>`;
                caption += `<b>${translation.date}:</b> ${moment(get?.created_at).format('iYYYY/iM/iD')}<br>`;
                caption += `<b>${translation.number_topic}:</b> ${get?.topic_id}`;
                let reply = RichReply.createFor(roomId, event, caption, caption);
                await client.sendMessage(roomId, reply).catch(error => console.log(error));
            }

        }

        else if (body === '2' || body === '٢' || body === 'getCategories') {

            let Categories = await getCategories().catch(error => console.log(error));
            let url = process.env.URL || config?.url;
            let title = process.env.DISCOURSE_FORUM_NAME || config?.discourse_forum_name;
            let message = `${translation.categories} ${title} ⬇️<br><br>`

            for (let item of Categories) {
                let id = item?.id;
                let name = item?.name;
                let topics_all_time = item?.topics_all_time;
                let slug = item?.slug
                message += `<b><a href='${url}/c/${slug}/${id}'>${name}</a></b> <br>`
                message += `${translation.number_of_topics_posted}: ${topics_all_time}<br>`
            }

            let reply = RichReply.createFor(roomId, event, message, message);
            await client.sendMessage(roomId, reply).catch(error => console.log(error));

        }

        else if (body === '3' || body === '٣' || body === 'CreatePosts') {

            if (memberJson?.access) {

                await database_matrix_member({ sender: sender, menu: 'CreatePosts_1' }).catch(error => console.log(error));
                let Categories = await getCategories().catch(error => console.log(error));
                let message = `<b>${translation.send_category_id} ⬇️</b> <br><br>`

                for (let item of Categories) {
                    message += `▪ ${item?.name}<br>`
                    message += `▪ ${translation.id}: ${item?.id}<br><br>`
                }
                let reply = RichReply.createFor(roomId, event, message, message);
                await client.sendMessage(roomId, reply).catch(error => console.log(error));
            }

            else {
                let message = `${translation.first_link_your_account_matrix} ❌`
                let reply = RichReply.createFor(roomId, event, message, message);
                await client.sendMessage(roomId, reply).catch(error => console.log(error));
            }

        }

        else if (body === '4' || body === '٤' || body === 'sendComment') {

            if (memberJson?.access) {

                await database_matrix_member({ sender: sender, menu: 'sendComment_1' }).catch(error => console.log(error));
                let message = `${translation.send_id_or_url_topic} 🌐`
                let reply = RichReply.createFor(roomId, event, message, message);
                await client.sendMessage(roomId, reply).catch(error => console.log(error));
            }

            else {
                let message = `${translation.first_link_your_account_matrix} ❌`
                let reply = RichReply.createFor(roomId, event, message, message);
                await client.sendMessage(roomId, reply).catch(error => console.log(error));
            }

        }

        else if (body === '5' || body === '٥' || body === 'sendMessagePrivate') {

            if (memberJson?.access) {

                await database_matrix_member({ sender: sender, menu: 'sendMessagePrivate_1' }).catch(error => console.log(error));
                let message = `${translation.username_send_to} 📝`
                let reply = RichReply.createFor(roomId, event, message, message);
                await client.sendMessage(roomId, reply).catch(error => console.log(error));
            }

            else {
                let message = `${translation.first_link_your_account_matrix} ❌`
                let reply = RichReply.createFor(roomId, event, message, message);
                await client.sendMessage(roomId, reply).catch(error => console.log(error));
            }

        }

        else if (body === '6' || body === '٦' || body === 'discourse') {

            if (checkRoom === 'direct') {

                if (memberJson?.access) {

                    let message = `${translation.err_linked_to_discourse} ⁉️`
                    let reply = RichReply.createFor(roomId, event, message, message);
                    await client.sendMessage(roomId, reply).catch(error => console.log(error));
                }

                else {

                    await database_matrix_member({ sender: sender, menu: 'discourse_1' }).catch(error => console.log(error));
                    let message = `${translation.enter_your_username_discourse} 📝<br><br>${translation.sign_}`
                    let reply = RichReply.createFor(roomId, event, message, message);
                    await client.sendMessage(roomId, reply).catch(error => console.log(error));

                }

            }

            else {
                let message = `${translation.send_me_private_message_to_link_your_account} ⚠️`
                let reply = RichReply.createFor(roomId, event, message, message);
                await client.sendMessage(roomId, reply).catch(error => console.log(error));
            }

        }

        else if (body === '7' || body === '٧' || body === 'activation') {

            if (checkRoom === 'room') {
                if (roomJson?.evenPost) {

                    let message = `${translation.err_active_in_the_chat} ⁉️`;
                    let reply = RichReply.createFor(roomId, event, message, message);
                    await client.sendMessage(roomId, reply).catch(error => console.log(error));

                }

                else {

                    if (usersAdmin?.includes(sender)) {

                        await getCategories().then(async e => {

                            let message = `<b>${translation.category_id}</b> <br><br>`
                            for (let item of e) {

                                message += `▪ ${item?.name}<br>`
                                message += `▪ ${translation.id}: ${item?.id}<br><br>`

                            }
                            message += `${translation.category_id_all}`
                            let reply = RichReply.createFor(roomId, event, message, message);
                            await client.sendMessage(roomId, reply).catch(error => console.log(error));
                            await database_matrix_member({ sender: sender, menu: 'activation' }).catch(error => console.log(error));
                        });

                    }

                    else {

                        let message = `${translation.admin_activate} ❌`;
                        let reply = RichReply.createFor(roomId, event, message, message);
                        await client.sendMessage(roomId, reply).catch(error => console.log(error));
                    }

                }
            }

            else if (checkRoom === 'direct') {

                if (roomJson?.evenPost) {

                    let message = `${translation.err_active_in_the_chat} ⁉️`;
                    let reply = RichReply.createFor(roomId, event, message, message);
                    await client.sendMessage(roomId, reply).catch(error => console.log(error));

                }

                else {

                    let message = `${translation.active_bot} ✅`;
                    let reply = RichReply.createFor(roomId, event, message, message);
                    roomJson.evenPost = true;
                    roomJson.categories = 0;
                    fs.writeJsonSync(path.join(process.env.DATAPATH || config?.dataPath, `/database/matrix/${checkRoom}/${roomId}.json`), roomJson, { spaces: '\t' });
                    await client.sendMessage(roomId, reply).catch(error => console.log(error));
                }

            }

        }

    }
}