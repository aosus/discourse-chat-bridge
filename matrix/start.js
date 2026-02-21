import fs from 'fs-extra';
import Translation from '../module/translation.js';
import path from 'path';

export default async function start(roomId, sender, name, body, event, RichReply, client) {
    if (body === 'start' || body === '#') {
        let __dirname = path.resolve();
        let config = fs.readJsonSync(path.join(__dirname, '/config.json'));
        let translation = await Translation(`${process.env.LANGUAGE || config?.language}`);
        
        let message = `<b>${translation.welcome} ${name} ${translation.in_the_bridge} ${process.env.DISCOURSE_FORUM_NAME || config?.discourse_forum_name} 👋</b> <br>`;
        message += `${translation.send_number_or_name_service} <br><br>`;
        message += `▪ ${translation.view_last_topic} 📄 <br>1- get_latest_posts <br><br>`;
        message += `▪ ${translation.view_categories} ⬇️ <br>2- getCategories <br><br>`;
        message += `▪ ${translation.write_new_topic} 📝 <br>3- CreatePosts <br><br>`;
        message += `▪ ${translation.write_new_comment} 💬 <br>4- sendComment <br><br>`;
        message += `▪ ${translation.send_message_private} 🔒 <br>5- sendMessagePrivate <br><br>`;
        message += `▪ ${translation.link_your_account_to} ${process.env.DISCOURSE_FORUM_NAME || config?.discourse_forum_name} <br>6- discourse <br><br>`;
        message += `▪ ${translation.activate_the_bot} <br>7- activation`;

        let reply = RichReply.createFor(roomId, event, message, message);
        await client.sendMessage(roomId, reply);
    }
}