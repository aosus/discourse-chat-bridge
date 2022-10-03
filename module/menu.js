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

export default {
    main: {
        name: 'القائمة الرئيسية',
        module: main
    },
    CreatePosts_1: {
        name: 'كتابة موضوع جديد 📝 #1',
        module: CreatePosts_1
    },
    CreatePosts_2: {
        name: 'كتابة موضوع جديد 📝 #2',
        module: CreatePosts_2
    },
    CreatePosts_3: {
        name: 'كتابة موضوع جديد 📝 #3',
        module: CreatePosts_3
    },
    activation: {
        name: 'تفعيل البوت ✅',
        module: activation
    },
    sendComment_1: {
        name: 'كتابة تعليق جديد 💬 #1',
        module: sendComment_1
    },
    sendComment_2: {
        name: 'كتابة تعليق جديد 💬 #2',
        module: sendComment_2
    },
    sendMessagePrivate_1: {
        name: 'إرسال رسالة خاصة 🔒 #1',
        module: sendMessagePrivate_1
    },
    sendMessagePrivate_2: {
        name: 'إرسال رسالة خاصة 🔒 #2',
        module: sendMessagePrivate_2
    },
    sendMessagePrivate_3: {
        name: 'إرسال رسالة خاصة 🔒 #3',
        module: sendMessagePrivate_3
    },
    discourse_1: {
        name: 'ربط الحساب على منصة discourse ✅ #1',
        module: discourse_1
    },
    discourse_2: {
        name: 'ربط الحساب على منصة discourse ✅ #2',
        module: discourse_2
    }
}