import getCategories from '../../discourse/getCategories.js';
import fs from 'fs-extra';
import Translation from '../../module/translation.js';

export default async function getCategories_(client) {

    client.command('getCategories', async (ctx) => {

        let config = fs.readJsonSync('./config.json');
        let Categories = await getCategories();
        let url = process.env.url || config?.url;
        let title = process.env.discourse_forum_name || config?.discourse_forum_name;
        let translation = await Translation(`${process.env.language || config?.language}`);
        let message = `${translation.categories} ${title} ⬇️\n\n`

        for (let item of Categories) {
            let id = item?.id;
            let name = item?.name;
            let topics_all_time = item?.topics_all_time;
            let slug = item?.slug
            message += `<b><a href='${url}/c/${slug}/${id}'>${name}</a></b> \n`
            message += `${translation.number_of_topics_posted}: ${topics_all_time}\n`
        }

        await ctx.reply(message, { parse_mode: 'HTML', disable_web_page_preview: true });
    });
}