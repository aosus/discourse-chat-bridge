import fs from 'fs-extra';
import path from "path";
import { RichReply, RichRepliesPreprocessor } from "matrix-bot-sdk";
import Comments from './Comments.js';
import getUserTelegram from './getUserTelegram.js';

export default async function MessageHandler(client) {

    try {

        await client.addPreprocessor(new RichRepliesPreprocessor(false));
        client.on("room.message", async (roomId, event) => {

            if (!event?.content) return; // Ignore redacted events that come through
            if (event?.sender === await client.getUserId()) return; // Ignore ourselves
            if (event?.content?.msgtype !== "m.text") return; // Ignore non-text messages
            let MeId = await client.getUserId();
            let sender = event?.sender;
            let Profile = await client.getUserProfile(sender);
            let body = event?.content?.body;
            let name = Profile?.displayname;
            let external_url = event?.content?.external_url;
            let msgtype = event?.content?.msgtype;
            let replyBody = event?.mx_richreply?.fallbackHtmlBody;
            let replySender = event?.mx_richreply?.fallbackSender;
            if (!replyBody?.split('رقم الموضوع:<b> ')[1]?.split('</p>')[0]) return;
            let config = fs.readJSONSync(path.join(path.resolve(), "config.json"));
            let topic_id = replyBody?.split('رقم الموضوع:<b> ')[1]?.split('</p>')[0];

            if (sender?.includes('@telegram')) {

                let name = name.includes('(Telegram)') ? name.split('(Telegram)')[0] : name
                let id_telegram = sender.split('@telegram_')[1]?.split(':aosus.org')[0];
                let username = await getUserTelegram(id_telegram);
                let comment = `تم كتابة **[الرد](${external_url})** من قبل **[${name}](https://t.me/${username})** :  \n\n`
                comment += body
                await Comments(topic_id, comment, config?.username_discourse, config?.password_discourse);

            }

            else if (sender?.includes('@telegram') === false) {

                let comment = `تم كتابة **الرد** من قبل **[${name}](https://matrix.to/#/${sender})** : \n\n`
                comment += body
                await Comments(topic_id, comment, config?.username_discourse, config?.password_discourse);

            }


        });

    } catch (error) {

        console.log(error);

    }

}