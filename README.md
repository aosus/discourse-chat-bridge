![Discourse_Bridge](/README/Discourse_Bridge.png)


# Discourse_Bridge
<br>
جسر بين منصة Discourse وبرامج التواصل .

- تيليجرام - مدعوم
- matrix - قريباً

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
git clone https://github.com/aosus/Discourse_Bridge

```

الآن قم بتعديل على ملف config.json

```bash
cd Discourse_Bridge 
nano config.json
```

```json
{
    "url": "https://discourse.aosus.org",
    "title_discourse": "مجتمع أسس",
    "token_discourse": "fbb8215419b92f4b3j87eyf7fd1172aa5bf8d16ce5e79e4f8d6d0dddf049b1",
    "useername_discourse": "admin",
    "token_telegram": "5492299293:AAHF6uVuIv8JnG7hnzFT8hHyabuc4mZb_U"
}
```

بعد التعديل على ملف config.json قم بتثبيت التبعيات وتشغيل البوت

```bash
npm i
npm start
or
node index.js
```



