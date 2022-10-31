import fetch from 'node-fetch';
import fs from 'fs-extra';
import moment from 'moment-hijri';
import EventPosts from '../discourse/EventPosts.js';
import getUserTelegram from '../module/getUserTelegram.js';
moment.locale('en-EN');

export default async function EventPosts_(client) {

    await EventPosts(async e => {

        try {

            let config = fs.readJsonSync('./config.json');
            let name = e?.name;
            let username = e?.username;
            let created_at = e?.created_at;
            let post_number = e?.post_number;
            let post_type = e?.post_type;
            let topic_id = e?.topic_id;
            let topic_slug = e?.topic_slug;
            let topic_title = e?.topic_title;
            let category_id = e?.category_id;
            let cooked = e?.cooked;
            let raw = e?.raw;
            let response = await fetch(process.env.url || config?.url + `/t/${topic_slug}/${topic_id}`, { method: 'GET' });
            let data = await response.text();

            if (data.includes('itemprop="image"')) {

                let getUser = await getUserTelegram();

                for (let item of getUser) {

                    let fromJson = fs.existsSync(`./database/telegram/from/${item}.json`);
                    let chat = fromJson ? fs.readJsonSync(`./database/telegram/from/${item}.json`) : fs.readJsonSync(`./database/telegram/chat/${item}.json`);

                    if (chat?.categories === category_id) {
                        let preview = data.split('itemprop="image" href="')[1]?.split('">')[0];
                        let caption = `<b><a href='${process.env.url || config?.url}/t/${topic_slug}/${topic_id}'>${topic_title}</a></b> \n\n`;
                        caption += `<b>الكاتب:</b> <a href='${process.env.url || config?.url}/u/${username}'>${name}</a> \n`;
                        caption += `<b>وقت النشر:</b> ${moment(created_at).format('LT')}\n`;
                        caption += `<b>رقم الموضوع:</b> ${topic_id}`;
                        await client.telegram.sendPhoto(item, { url: preview }, { caption: caption, parse_mode: 'HTML', disable_web_page_preview: true });
                    }

                    else if (chat?.categories === 0) {
                        let preview = data.split('itemprop="image" href="')[1]?.split('">')[0];
                        let caption = `<b><a href='${process.env.url || config?.url}/t/${topic_slug}/${topic_id}'>${topic_title}</a></b> \n\n`;
                        caption += `<b>الكاتب:</b> <a href='${process.env.url || config?.url}/u/${username}'>${name}</a> \n`;
                        caption += `<b>وقت النشر:</b> ${moment(created_at).format('LT')}\n`;
                        caption += `<b>رقم الموضوع:</b> ${topic_id}`;
                        await client.telegram.sendPhoto(item, { url: preview }, { caption: caption, parse_mode: 'HTML', disable_web_page_preview: true });
                    }
                }

            }

            else {

                let getUser = await getUserTelegram();

                for (let item of getUser) {

                    let fromJson = fs.existsSync(`./database/telegram/from/${item}.json`);
                    let chat = fromJson ? fs.readJsonSync(`./database/telegram/from/${item}.json`) : fs.readJsonSync(`./database/telegram/chat/${item}.json`);

                    if (chat?.categories === category_id) {
                        let caption = `<b><a href='${process.env.url || config?.url}/t/${topic_slug}/${topic_id}'>${topic_title}</a></b> \n\n`;
                        caption += `<b>الكاتب:</b> <a href='${process.env.url || config?.url}/u/${username}'>${name}</a> \n`;
                        caption += `<b>وقت النشر:</b> ${moment(created_at).format('LT')}\n`;
                        caption += `<b>رقم الموضوع:</b> ${topic_id}`;
                        await client.telegram.sendMessage(item, caption, { parse_mode: 'HTML', disable_web_page_preview: true });
                    }

                    else if (chat?.categories === 0) {
                        let caption = `<b><a href='${process.env.url || config?.url}/t/${topic_slug}/${topic_id}'>${topic_title}</a></b> \n\n`;
                        caption += `<b>الكاتب:</b> <a href='${process.env.url || config?.url}/u/${username}'>${name}</a> \n`;
                        caption += `<b>وقت النشر:</b> ${moment(created_at).format('LT')}\n`;
                        caption += `<b>رقم الموضوع:</b> ${topic_id}`;
                        await client.telegram.sendMessage(item, caption, { parse_mode: 'HTML', disable_web_page_preview: true });

                    }
                }
            }

        } catch (error) {

            console.log(error);

        }
    });

}