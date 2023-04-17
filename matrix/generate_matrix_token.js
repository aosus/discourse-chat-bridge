import { MatrixAuth } from "matrix-bot-sdk";
import fs from 'fs-extra';
import * as dotenv from 'dotenv'
import path from 'path';
dotenv.config({ override: true })

let __dirname = path.resolve();
let config = fs.readJsonSync(path.join(__dirname, '/config.json'));
let matrix_homeserver_url = process.env.MATRIX_HOMESERVER_URL || config?.matrix_homeserver_url;
let username = process.env.MATRIX_USERNAME || config?.matrix_username;
let password = process.env.MATRIX_PASSWORD || config?.matrix_password;
let auth = new MatrixAuth(matrix_homeserver_url);
let login = await auth.passwordLogin(username, password);

config.matrix_access_token = login.matrix_access_token;
fs.writeJSONSync("./config.json", config, { spaces: '\t' });
console.log('matrix_access_token: ', login.matrix_access_token);