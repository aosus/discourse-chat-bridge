import getCategories from '../../discourse/getCategories.js';
import fs from 'fs-extra';

export default async function getCategories_(client) {

    client.command('getCategories', async (ctx) => {

        let config = fs.readJsonSync('./config.json');
        let Categories = await getCategories();
        let url = process.env.url || config?.url;
        let title = process.env.title_discourse || config?.title_discourse;
        let message = `فئات ${title} ⬇️\n\n`

        for (let item of Categories) {
            let id = item?.id;
            let name = item?.name;
            let topics_all_time = item?.topics_all_time;
            let slug = item?.slug
            message += `<b><a href='${url}/c/${slug}/${id}'>${name}</a></b> \n`
            message += `عدد المواضيع المنشورة: ${topics_all_time}\n`
        }

        await ctx.reply(message, { parse_mode: 'HTML', disable_web_page_preview: true });
    });
}