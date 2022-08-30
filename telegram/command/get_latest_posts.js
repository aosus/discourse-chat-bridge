import fetch from 'node-fetch';
import fs from 'fs-extra';
import moment from 'moment-hijri';
import get_latest_posts from '../../discourse/get_latest_posts.js';
moment.locale('en-EN');

export default async function get_latest_posts_(client) {

    client.command('get_latest_posts', async (ctx) => {

        let get = await get_latest_posts();
        let config = fs.readJsonSync('config.json');
        let response = await fetch(config?.url + `/t/${get?.topic_slug}/${get?.topic_id}`, { method: 'GET' });
        let data = await response.text();
        if (data.includes('itemprop="image"')) {
            let preview = data.split('itemprop="image" href="')[1]?.split('">')[0];
            let caption = `<b><a href='${config?.url}/t/${get?.topic_slug}/${get?.topic_id}'>${get?.topic_title}</a></b> \n\n`;
            caption += `<b>الكاتب:</b> <a href='${config?.url}/u/${get?.username}'>${get?.name}</a> \n`;
            caption += `<b>التاريخ:</b> ${moment(get?.created_at).format('iYYYY/iM/iD')}\n`;
            caption += `<b>رقم الموضوع:</b> ${get?.topic_id}`;
            await ctx.replyWithPhoto({ url: preview }, { caption: caption, parse_mode: 'HTML', disable_web_page_preview: true });

        }

        else {
            let caption = `<b><a href='${config?.url}/t/${get?.topic_slug}/${get?.topic_id}'>${get?.topic_title}</a></b> \n\n`;
            caption += `<b>الكاتب:</b> <a href='${config?.url}/u/${get?.username}'>${get?.name}</a> \n`;
            caption += `<b>التاريخ:</b> ${moment(get?.created_at).format('iYYYY/iM/iD')}\n`;
            caption += `<b>رقم الموضوع:</b> ${get?.topic_id}`;
            await ctx.reply(caption, { parse_mode: 'HTML' });
        }

    });
}