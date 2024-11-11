# التثبيت

## discourse من API الحصول على مفتاح 
![11|328x402](11.png)

<br>

![12|690x93](12.png)

![13|690x193](13.png)


قم بإختيار جميع المستخدمين

![14|521x99](14.png)

قم بتحديد على صلاحية الكتابة

![15|690x123](15.png)

احفظ المفتاح في مكان آمن واضغط على متابعة

### docker-compose.yml التثبيت باستخدام 

```yaml
services:
    discourse-chat-bridge:
        image: oci.aosus.org/aosus/discourse-chat-bridge:latest
        restart: always
        environment:
            URL: "https://discourse.example.com"
            DISCOURSE_FORUM_NAME: "مجتمع Discourse"
            DISCOURSE_TOKEN: "مفتاح API مع صلاحيات الكتابة لجميع المستخدمين"
            DISCOURSE_USERNAME: "اسم المستخدم الذي سيتم استخدامه للرسائل المباشرة من الجسر"
            TELEGRAM_TOKEN: ""
            MATRIX_USERNAME: ""
            #MATRIX_PASSWORD: "" لا يجب استخدام كلمة مرور Matrix في متغيرات البيئة، بل يجب تعيين رمز الوصول مباشرة.
            MATRIX_HOMESERVER_URL: "https://matrix.example.com"
            MATRIX_ACCESS_TOKEN: ""
            MATRIX_AUTOJOIN: TRUE
            DATAPATH: /data
            MATRIX_ENCRYPTION: TRUE
            language: "en"
        volumes:
            ./data:/data:rw:z
```

ثم يمكنك بدء الحاوية باستخدام:

```bash
docker compose up -d
```

## التثبيت المباشر

```bash
git clone https://github.com/aosus/discourse-chat-bridge
```

 وأضف المدخلات المطلوبة `config.json` قم بتحرير:

```json
{
	"url": "https://$DISCOURSE_DOMAIN",
	"discourse_forum_name": "اسم منتدى Discourse",
	"discourse_token": "مفتاح API مع صلاحيات الكتابة لجميع المستخدمين",
	"discourse_username": "اسم المستخدم الذي سيتم استخدامه للرسائل المباشرة من الجسر",
	"telegram_token": "",
	"matrix_username": "اسم المستخدم لحسابك على Matrix #aosus",
	"matrix_password": "كلمة مرور حساب Matrix لتوليد رمز الوصول، يمكنك تخطي هذا بإدخال الرمز مباشرة",
	"matrix_homeserver_url": "https://matrix.org",
	"matrix_access_token": "أدخل رمز الوصول الخاص بـ Matrix هنا #npm run generate_matrix_token",
	"matrix_autojoin": true,
	"dataPath": "./storage",
	"matrix_encryption": true,
	"language": "en"
}
```

ثم قم بتشغيله!

```bash
npm i
npm run generate_matrix_token
npm start
or
node index.js
```