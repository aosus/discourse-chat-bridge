import fs from 'fs-extra';
import { database_matrix_member } from '../module/database_matrix.js';

export default async function start(roomId, sender, name, body, event, RichReply, client) {

    if (body === 'خدمة' || body === 'خدمه' || body === 'start' || body === '#') {

        await database_matrix_member({ sender: sender, menu: 'main' }).catch(error => console.log(error));

        let config = fs.readJsonSync(`./config.json`);
        let message = `<b>مرحبا بك ${name} في جسر ${config?.title_discourse} 👋</b> <br>`
        message += 'قم بإرسال إسم الخدمة أو رقمها <br><br>'
        message += '▪ عرض آخر موضوع تم نشره 📄 <br>1- get_latest_posts <br><br>'
        message += '▪ عرض الفئات ⬇️ <br>2- getCategories <br><br>'
        message += '▪ كتابة موضوع جديد 📝 <br>3- CreatePosts <br><br>'
        message += '▪ كتابة تعليق جديد 💬 <br>4- sendComment <br><br>'
        message += '▪ إرسال رسالة خاصة 🔒 <br>5- sendMessagePrivate <br><br>'
        message += `▪ ربط حسابك على ${config?.title_discourse} <br>6- discourse <br><br>`
        message += '▪ تفعيل البوت <br>7- activation'
        let reply = RichReply.createFor(roomId, event, message, message);
        await client.sendMessage(roomId, reply).catch(error => console.log(error));

    }

}