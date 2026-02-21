![discourse-chat-bridge](/README/Discourse_Bridge.png)


# Discourse-chat-bridge
<br>
جسر بين منصة Discourse وبرامج التواصل .

- تيليجرام - مدعوم
- matrix - مدعوم

<br>

# مميزات الجسر

- عرض آخر موضوع تم نشره 📄
- عرض الفئات ⬇️
- كتابة موضوع جديد 📝
- كتابة تعليق جديد 💬
- إرسال رسالة خاصة 🔒
- ربط حسابك على منصة Discourse 
- تفعيل البوت لتلقي آخر المواضيع المنشورة

<br>


|  الأمر  | صورة|
|:--------------|-----------------:|
|start | ![discourse-chat-bridge](/README/16.jpg) |
|get_latest_posts | ![discourse-chat-bridge](/README/6.jpg) |
|getCategories | ![discourse-chat-bridge](/README/3.jpg) |
|CreatePosts | ![discourse-chat-bridge](/README/2.jpg) |
|sendComment | ![discourse-chat-bridge](/README/5.jpg) |
|sendMessagePrivate | ![discourse-chat-bridge](/README/4.jpg) |
|discourse | ![discourse-chat-bridge](/README/1.jpg) |
|activation | ![discourse-chat-bridge](/README/7.jpg) |

<br>

# تثبيت البوت 

<br>

**يجب عليك إنشاء مفتاح  api عبر لوحة تحكم Discourse**

![11|328x402](/README/11.png)

<br>

![12|690x93](/README/12.png)

![13|690x193](/README/13.png)


**`قم بإختيار جميع المستخدمين`**

![14|521x99](/README/14.png)

**`قم بتحديدعلى صلاحية الكتابة`** 

![15|690x123](/README/15.png)

**`احفظ المفتاح في مكان آمن واضغط على متابعة`** 

<br>

بعد الإنتهاء من إنشاء مفتاح api قم بإستنساخ المستودع 

```bash
git clone https://github.com/aosus/discourse-chat-bridge

```
آلان قم بإضافة متغيرات البيئة
- url
- discourse_forum_name
- discourse_token
- discourse_username
- telegram_token
- matrix_username
- matrix_password
- matrix_homeserver_url
- matrix_access_token
- matrix_autojoin
- dataPath
- matrix_encryption
- language

مثال 

linux

```bash
export url="https://discourse.aosus.org"
```

windows

```bash
setx url="https://discourse.aosus.org"
```

أو قم بتعديل على ملف config.json
``` ملاحظة / الأولوية لمتغيرات البيئة اذا وجدت ```


```bash
cd discourse-chat-bridge 
nano config.json
```

```json
{
	"url": "https://$DISCOURSE_DOMAIN",
	"discourse_forum_name": "discourse forum name",
	"discourse_token": "discourse tokin",
	"discourse_username": "system",
	"telegram_token": "telegram token",
	"matrix_username": "Username to your Matrix account #aosus",
	"matrix_password": "Password to your Matrix account #*****",
	"matrix_homeserver_url": "https://matrix.org",
	"matrix_access_token": "Put your matrix_access_token here #npm run generate_matrix_token",
	"matrix_autojoin": true,
	"dataPath": "storage",
	"matrix_encryption": true,
	"language": "ar"
}
```

بعد التعديل على ملف config.json قم بحفظه
ثم قم بتثبيت التبعيات وتشغيل البوت

```bash
npm i
npm run generate_matrix_token
npm start
or
node index.js
```


``` ملاحظة / عند كتابة الأمر npm run generate_matrix_token سيتم توليد التوكن لـ (Matrix) بشكل تلقائي وحفظه في ملف config.json ```

<br>

# الاختبارات

لتشغيل الاختبارات:

```bash
npm test
```

لتشغيل الاختبارات مع تقرير التغطية:

```bash
npm run test:coverage
```
