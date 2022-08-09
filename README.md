# matrix-discourse-bridge
جسر بين منصة discourse وغرف أسس على مارتريكس لإرسال آخر المواضيع المنشورة على الموقع والتعليق عليها.
#

# طريقة التثبيت
#
استنساخ المستودع

```
git clone https://github.com/aosus/matrix_aosus
```
تثبيت الحزم 

```
cd matrix_aosus
npm i
```

قم بتعديل على التفاصيل في ملف config.js

```
nano config.json
```

```
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

```
npm run accessToken
or 
node accessToken.js
```

تشغيل البرنامج النصي 

```
npm start 
or 
node index.js
```

