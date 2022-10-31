import { MatrixAuth } from "matrix-bot-sdk";
import fs from 'fs-extra';
import * as dotenv from 'dotenv'
dotenv.config({ override: true })

let config = fs.readJsonSync('./config.json');
let homeserverUrl = process.env.homeserverUrl || config?.homeserverUrl;
let username = process.env.username_matrix || config?.username_matrix;
let password = process.env.password_matrix || config?.password_matrix;
let auth = new MatrixAuth(homeserverUrl);
let login = await auth.passwordLogin(username, password);

config.accessToken = login.accessToken;
fs.writeJSONSync("./config.json", config, { spaces: '\t' });
console.log('accessToken: ', login.accessToken);