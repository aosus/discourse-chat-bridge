import moment from 'moment-hijri';
import Crate from './module/Crate.js';
import telegram from './telegram/index.js';
moment.locale('en-EN');

console.log('starting discourse bridge: ', moment().format('LT'));

await Crate() //  إنشاء مجلدات قاعدة البيانات
await telegram() // بوت تيليجرام