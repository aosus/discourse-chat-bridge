![Discourse_Bridge](/README/Discourse_Bridge.png)


# Discourse_Bridge
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
|start | ![Discourse_Bridge](/README/16.jpg) |
|get_latest_posts | ![Discourse_Bridge](/README/6.jpg) |
|getCategories | ![Discourse_Bridge](/README/3.jpg) |
|CreatePosts | ![Discourse_Bridge](/README/2.jpg) |
|sendComment | ![Discourse_Bridge](/README/5.jpg) |
|sendMessagePrivate | ![Discourse_Bridge](/README/4.jpg) |
|discourse | ![Discourse_Bridge](/README/1.jpg) |
|activation | ![Discourse_Bridge](/README/7.jpg) |

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
git clone https://github.com/aosus/discourse_bridge

```
آلان قم بإضافة متغيرات البيئة
- url
- title_discourse
- token_discourse
- useername_discourse
- token_telegram
- username_matrix
- password_matrix
- homeserverUrl
- accessToken
- autoJoin
- dataPath
- encryption

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
cd discourse_bridge 
nano config.json
```

```json
{
	"url": "https://discourse.aosus.org",
	"title_discourse": "مجتمع أسس",
	"token_discourse": "fbb8215419b92f4b34e696af92fd1172aa5bf8d16ce5e79e4f8d6d0dddf049b1",
	"useername_discourse": "system",
	"token_telegram": "5492211333:AAHF6uVuIv8wGkIRtmzFT8hHyabuc4mZb_U",
	"username_matrix": "Username to your Matrix account #aosus",
	"password_matrix": "Password to your Matrix account #*****",
	"homeserverUrl": "https://matrix.org",
	"accessToken": "Put your accessToken here #npm run accessToken",
	"autoJoin": true,
	"dataPath": "storage",
	"encryption": true
}
```

بعد التعديل على ملف config.json قم بحفظه
ثم قم بتثبيت التبعيات وتشغيل البوت

```bash
npm i
npm run accessToken
npm start
or
node index.js
```


``` ملاحظة / عند كتابة الأمر npm run accessToken سيتم توليد التوكن لـ (Matrix) بشكل تلقائي وحفظه في ملف config.json ```