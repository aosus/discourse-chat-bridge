import fs from 'fs-extra';
import sendComment from '../discourse/sendComment.js';

export default async function EventReply(roomId, sender, meId, body, replySender, replyBody, event, RichReply, client) {

    if (replySender?.includes(meId)) {

        let topic_id = replyBody?.split('رقم الموضوع:</b> ')[1];
        let memberJson = fs.readJsonSync(`./database/matrix/member/${sender}.json`);

        if (topic_id) {

            let seCo = await sendComment(memberJson?.useername_discourse, topic_id, body).catch(error => console.log(error));

            if (seCo?.errors) {

                for (let item of seCo?.errors) {
                    let reply = RichReply.createFor(roomId, event, item, item);
                    await client.sendMessage(roomId, reply).catch(error => console.log(error));
                }

            }
            else {

                let topic_slug = seCo?.topic_slug
                let post_number = seCo?.post_number
                let message = `<b>تم نشر التعليق ✅ <a href='${process.env.url}/t/${topic_slug}/${topic_id}'>${post_number}</a></b>`
                let reply = RichReply.createFor(roomId, event, message, message);
                await client.sendMessage(roomId, reply).catch(error => console.log(error));

            }

        }


    }

}
