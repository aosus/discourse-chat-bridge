# matrix-discourse-bridge
جسر بين منصة discourse وغرف أسس على ماتريكس لإرسال آخر المواضيع المنشورة على الموقع والتعليق عليها.


# طريقة التثبيت

استنساخ المستودع

```bash
git clone https://github.com/aosus/matrix-discourse-bridge
```
تثبيت الحزم 

```bash
cd matrix-discourse-bridge
npm i
```

قم بتعديل على التفاصيل في ملف config.js

```bash
nano config.json
```

```json
{
    "username_matrix": "Username to your Matrix account",
    "password_matrix": "Password to your Matrix account",
    "homeserverUrl": "https://matrix.org",
    "accessToken": "Put your accessToken here",
    "autoJoin": true,
    "dataPath": "storage",
    "encryption": true,
    "roomId": [
        "!XdYFruiyThDuTFUxMD:matrix.org",
        "!XbICMGPZGzlPAbkZqW:aosus.org"
    ],
    "username_discourse": "Username to your discourse.aosus.org account",
    "password_discourse": "Passwordto your discourse.aosus.org account"
}
```

للحصول على accessToken

```bash
npm run accessToken
or 
node accessToken.js
```

تشغيل البرنامج النصي 

```bash
npm start 
or 
node index.js
```

