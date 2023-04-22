import fs from 'fs-extra';
import main from '../matrix/menu/main.js';
import CreatePosts_1 from '../matrix/menu/CreatePosts/CreatePosts_1.js';
import CreatePosts_2 from '../matrix/menu/CreatePosts/CreatePosts_2.js';
import CreatePosts_3 from '../matrix/menu/CreatePosts/CreatePosts_3.js';
import activation from '../matrix/menu/activation.js';
import sendComment_1 from '../matrix/menu/sendComment/sendComment_1.js';
import sendComment_2 from '../matrix/menu/sendComment/sendComment_2.js';
import sendMessagePrivate_1 from '../matrix/menu/sendMessagePrivate/sendMessagePrivate_1.js';
import sendMessagePrivate_2 from '../matrix/menu/sendMessagePrivate/sendMessagePrivate_2.js';
import sendMessagePrivate_3 from '../matrix/menu/sendMessagePrivate/sendMessagePrivate_3.js';
import discourse_1 from '../matrix/menu/discourse/discourse_1.js';
import discourse_2 from '../matrix/menu/discourse/discourse_2.js';
import Translation from './translation.js';
import path from 'path';

let __dirname = path.resolve();
let config = fs.readJsonSync(path.join(__dirname, '/config.json'));
let translation = await Translation(`${process.env.LANGUAGE || config?.language}`);

export default {
    main: {
        name: `${translation.main_menu}`,
        module: main
    },
    CreatePosts_1: {
        name: `${translation.write_new_topic} 📝 #1`,
        module: CreatePosts_1
    },
    CreatePosts_2: {
        name: `${translation.write_new_topic} 📝 #2`,
        module: CreatePosts_2
    },
    CreatePosts_3: {
        name: `${translation.write_new_topic} 📝 #3`,
        module: CreatePosts_3
    },
    activation: {
        name: `${translation.activate_the_bot}✅`,
        module: activation
    },
    sendComment_1: {
        name: `${translation.write_new_comment} 💬 #1`,
        module: sendComment_1
    },
    sendComment_2: {
        name: `${translation.write_new_comment} 💬 #2`,
        module: sendComment_2
    },
    sendMessagePrivate_1: {
        name: `${translation.send_message_private} 🔒 #1`,
        module: sendMessagePrivate_1
    },
    sendMessagePrivate_2: {
        name: `${translation.send_message_private} 🔒 #2`,
        module: sendMessagePrivate_2
    },
    sendMessagePrivate_3: {
        name: `${translation.send_message_private} 🔒 #3`,
        module: sendMessagePrivate_3
    },
    discourse_1: {
        name: `${translation.first_link_your_account} discourse✅ #1`,
        module: discourse_1
    },
    discourse_2: {
        name: `${translation.first_link_your_account} discourse ✅ #2`,
        module: discourse_2
    }
}