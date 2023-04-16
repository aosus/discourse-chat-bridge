import { MatrixAuth } from "matrix-bot-sdk";
import fs from 'fs-extra';
import * as dotenv from 'dotenv'
dotenv.config({ override: true })

let config = fs.readJsonSync('./config.json');
let matrix_homeserver_url = process.env.matrix_homeserver_url || config?.matrix_homeserver_url;
let username = process.env.matrix_username || config?.matrix_username;
let password = process.env.matrix_password || config?.matrix_password;
let auth = new MatrixAuth(matrix_homeserver_url);
let login = await auth.passwordLogin(username, password);

config.matrix_access_token = login.matrix_access_token;
fs.writeJSONSync("./config.json", config, { spaces: '\t' });
console.log('matrix_access_token: ', login.matrix_access_token);