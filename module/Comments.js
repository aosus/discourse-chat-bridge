import puppeteer from 'puppeteer';

export default async function Comments(topic_id, comment, username, password) {

    let browser = await puppeteer.launch({ headless: true, devtools: false });
    let page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    page.setDefaultTimeout(0);

    let status = await page.goto(`https://discourse.aosus.org/t/topic/${topic_id}`, {
        waitUntil: 'load',
        timeout: 0
    });

    if (status?.status() === 200) {

        await page.$$eval('.d-button-label', (e) => {

            e.map(e => {

                if (e.textContent === 'تسجيل دخول') {

                    e.click()

                }
            })
        });
        let username_input = await page.waitForSelector('#login-account-name')
        await username_input.type(username, { delay: 100 })
        let password_input = await page.waitForSelector('#login-account-password')
        await password_input.type(password, { delay: 100 })
        await page.click('#login-button');
        await new Promise(r => setTimeout(r, 5000));
        let modal_alert = await page.waitForSelector('#modal-alert')
        let Log_in_error = await modal_alert.evaluate(e => e.innerHTML);

        if (Log_in_error === 'اسم المستخدم أو البريد الإلكتروني أو كلمة المرور غير صحيحة') {

            console.log('Username, email or password incorrect');

        }

        else if (Log_in_error === '') {

            let comm = await page.waitForSelector('.post-menu-area .actions .d-button-label');
            await comm.click();
            let msg = await page.waitForSelector('.d-editor-input')
            await msg.type(comment, { delay: 100 });
            let send = await page.waitForSelector('.save-or-cancel .d-button-label');
            await send.click();

        }

    }

    else {

        console.log(` HTTP response status code ${status}`);
    }

    await browser.close();

}