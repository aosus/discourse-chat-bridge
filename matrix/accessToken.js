import { MatrixAuth } from "matrix-bot-sdk";
import fs from 'fs-extra';
import * as dotenv from 'dotenv'
dotenv.config({ override: true })

let homeserverUrl = process.env.homeserverUrl;
let username = process.env.username_matrix;
let password = process.env.password_matrix;
let auth = new MatrixAuth(homeserverUrl);
let login = await auth.passwordLogin(username, password);
let existsEnv = fs.existsSync('./.env');

if (existsEnv) {

    let readEnv = fs.readFileSync('./.env', 'utf8');
    let opj = {}

    readEnv?.split('\n')?.forEach((line, index) => {
        let words = line?.split('=')
        let key = words[0]
        if (key === '') return
        let value = words[1]?.replace(/"/g, '')
        if (key === 'accessToken') {
            opj[key] = login?.accessToken
        }
        else opj[key] = value
    });

    let env = `url="${opj.url}"
title_discourse="${opj.title_discourse}"
token_discourse="${opj.token_discourse}"
useername_discourse="${opj.useername_discourse}"
token_telegram="${opj.token_telegram}"
username_matrix="${opj.username_matrix}"
password_matrix="${opj.password_matrix}"
homeserverUrl="${opj.homeserverUrl}"
accessToken="${opj.accessToken}"
autoJoin=${opj.autoJoin}
dataPath="${opj.dataPath}"
encryption=${opj.encryption}`
    fs.writeFileSync('./.env', env);

}

else if (process.platform === 'linux') {

    let message = 'Please set the accessToken environment variable\n\n'
    message += `export accessToken=${login.accessToken}\n\n\n`
    message += 'Ignore the message if you are using an .env file'
    console.log(message);
}

else if (process.platform === "win32" || process.platform === "win64") {
    let message = 'Please set the accessToken environment variable\n\n'
    message += `setx accessToken=${login.accessToken}\n\n\n`
    message += 'Ignore the message if you are using an .env file'
    console.log(message);
}