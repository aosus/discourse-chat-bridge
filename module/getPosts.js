import fetch from 'node-fetch';
import fs from 'fs-extra';
import MarkdownIt from 'markdown-it';
import path from "path";
import sendFile from './sendFile.js';

export default async function getPosts(roomId, client) {

    let __dirname = path.resolve();

    if (fs.existsSync(path.join(__dirname, './Posted.json'),) === false) {

        fs.writeJsonSync(path.join(__dirname, './Posted.json'), []);

    }

    setInterval(async () => {

        try {

            let posts = await fetch('https://discourse.aosus.org/posts.json').catch(e => console.log(e));
            let body = await posts?.json();

            if (posts?.status === 200) {

                let latest_posts = body?.latest_posts[0]
                let post_number = latest_posts?.post_number
                let name = latest_posts?.name
                let username = latest_posts?.username
                let topic_id = latest_posts?.topic_id
                let topic_title = latest_posts?.topic_title
                let raw = latest_posts?.raw.slice(0, 900)
                let cooked = latest_posts?.cooked.slice(0, 900)
                let md = new MarkdownIt();
                let caption = md.render(raw);
                let Posted = await fs.readJson(path.join(__dirname, './Posted.json')).catch(e => console.log(e))

                if (post_number === 0 && Posted.includes(topic_id) === false) {

                    let url = await fetch(`https://discourse.aosus.org/t/topic/${topic_id}`).catch(e => console.log(e));
                    let itemprop = await url?.text();
                    let message = `<b>رابط الموضوع:<b> <a href='https://discourse.aosus.org/t/topic/${topic_id}'>${topic_title}</a><br>`
                    message += `<b>الكاتب:<b> <a href='https://discourse.aosus.org/u/${username}'>${name}</a><br>`
                    message += `<b>رقم الموضوع:<b> ${topic_id}`
                    await new Promise(r => setTimeout(r, 2000));

                    if (itemprop.includes('itemprop="image"')) {

                        let url = itemprop.split('itemprop="image" href="')[1]?.split('">')[0]
                        let res = await fetch(url).catch(e => console.log(e));
                        let preview = await res?.arrayBuffer();
                        await fs.writeFile(path.join(__dirname, './preview/preview.jpg'), Buffer.from(preview)).catch(e => console.log(e));
                        await new Promise(r => setTimeout(r, 2000));
                        for (let item of roomId) {

                            await sendFile('./preview/preview.jpg', item, 'm.image', client);
                            await client.sendMessage(item, {
                                "msgtype": "m.notice",
                                "format": "org.matrix.custom.html",
                                "formatted_body": `${caption}\n\n${message}`,
                                "body": `${caption}\n\n${message}`,
                            });
                            
                        }
                        await fs.remove(path.join(__dirname, './preview/preview.jpg')).catch(e => console.log(e));
                        await Posted.push(topic_id);
                        await fs.writeJson(path.join(__dirname, './Posted.json'), Posted).catch(e => console.log(e));

                    }

                    else if (itemprop.includes('itemprop="image"') === false) {

                        for (let item of roomId) {

                            await client.sendMessage(item, {
                                "msgtype": "m.notice",
                                "format": "org.matrix.custom.html",
                                "formatted_body": `${caption}\n\n${message}`,
                                "body": `${caption}\n\n${message}`,
                            });

                        }
                        await Posted.push(topic_id);
                        await fs.writeJson(path.join(__dirname, './Posted.json'), Posted).catch(e => console.log(e));
                    }


                }

            }

        } catch (error) {

            console.log(error);

        }

    }, 10000);

}