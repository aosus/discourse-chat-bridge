import fetch from 'node-fetch';
import moment from 'moment-hijri';
import EventPosts from '../discourse/EventPosts.js';
import getrRoomMatrix from '../module/getrRoomMatrix.js';
import sendFile from './sendFile.js';
import fs from 'fs-extra';
import Translation from '../module/translation.js';


export default async function EventPosts_(client) {

    await EventPosts(async e => {

        try {

            let config = fs.readJsonSync('./config.json');
            let translation = await Translation(`${process.env.LANGUAGE || config?.language}`);
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
            let response = await fetch(process.env.URL || config?.url + `/t/${topic_slug}/${topic_id}`, { method: 'GET' });
            let data = await response?.text();

            if (data.includes('itemprop="image"')) {

                let getRoom = await getrRoomMatrix('all');

                for (let item of getRoom?.array) {

                    if (item?.categories === category_id) {
                        let preview = data.split('itemprop="image" href="')[1]?.split('">')[0];
                        let caption = `<b><a href='${process.env.URL || config?.url}/t/${topic_slug}/${topic_id}'>${topic_title}</a></b> <br><br>`;
                        caption += `<b>${translation.writer}:</b> <a href='${process.env.URL || config?.url}/u/${username}'>${name}</a> <br>`;
                        caption += `<b>${translation.date}:</b> ${moment(created_at).format('iYYYY/iM/iD')}<br>`;
                        caption += `<b>${translation.number_topic}:</b> ${topic_id}`;

                        await sendFile(item?.roomId, preview, 'm.image', client).catch(error => console.log(error));
                        await client.sendMessage(item?.roomId, {
                            "msgtype": "m.notice",
                            "format": "org.matrix.custom.html",
                            "formatted_body": caption,
                            "body": caption,
                        }).catch(error => console.log(error));
                    }

                    else if (item?.categories === 0) {
                        let preview = data.split('itemprop="image" href="')[1]?.split('">')[0];
                        let caption = `<b><a href='${process.env.URL || config?.url}/t/${topic_slug}/${topic_id}'>${topic_title}</a></b> <br><br>`;
                        caption += `<b>${translation.writer}:</b> <a href='${process.env.URL || config?.url}/u/${username}'>${name}</a> <br>`;
                        caption += `<b>${translation.date}:</b> ${moment(created_at).format('iYYYY/iM/iD')}<br>`;
                        caption += `<b>${translation.number_topic}:</b> ${topic_id}`;

                        await sendFile(item?.roomId, preview, 'm.image', client).catch(error => console.log(error));
                        await client.sendMessage(item?.roomId, {
                            "msgtype": "m.notice",
                            "format": "org.matrix.custom.html",
                            "formatted_body": caption,
                            "body": caption,
                        }).catch(error => console.log(error));
                    }
                }

            }

            else {

                let getRoom = await getrRoomMatrix('all');

                for (let item of getRoom?.array) {

                    if (item?.categories === category_id) {
                        let caption = `<b><a href='${process.env.URL || config?.url}/t/${topic_slug}/${topic_id}'>${topic_title}</a></b> <br><br>`;
                        caption += `<b>${translation.writer}:</b> <a href='${process.env.URL || config?.url}/u/${username}'>${name}</a> <br>`;
                        caption += `<b>${translation.date}:</b> ${moment(created_at).format('iYYYY/iM/iD')}<br>`;
                        caption += `<b>${translation.number_topic}:</b> ${topic_id}`;
                        await client.sendMessage(item?.roomId, {
                            "msgtype": "m.notice",
                            "format": "org.matrix.custom.html",
                            "formatted_body": caption,
                            "body": caption,
                        }).catch(error => console.log(error));
                    }

                    else if (item?.categories === 0) {
                        let caption = `<b><a href='${process.env.URL || config?.url}/t/${topic_slug}/${topic_id}'>${topic_title}</a></b> <br><br>`;
                        caption += `<b>${translation.writer}:</b> <a href='${process.env.URL || config?.url}/u/${username}'>${name}</a> <br>`;
                        caption += `<b>${translation.date}:</b> ${moment(created_at).format('iYYYY/iM/iD')}<br>`;
                        caption += `<b>${translation.number_topic}:</b> ${topic_id}`;
                        await client.sendMessage(item?.roomId, {
                            "msgtype": "m.notice",
                            "format": "org.matrix.custom.html",
                            "formatted_body": caption,
                            "body": caption,
                        }).catch(error => console.log(error));

                    }
                }
            }

        } catch (error) {

            console.log(error);

        }
    });

}