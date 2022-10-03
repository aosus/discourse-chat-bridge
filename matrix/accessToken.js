import { MatrixAuth } from "matrix-bot-sdk";
import fs from 'fs-extra';

let config = fs.readJSONSync("./config.json");
let homeserverUrl = config?.homeserverUrl;
let username = config?.username_matrix;
let password = config?.password_matrix;
let auth = new MatrixAuth(homeserverUrl);
let login = await auth.passwordLogin(username, password);

config.accessToken = login.accessToken;
fs.writeJSONSync("./config.json", config, { spaces: '\t' });
console.log('accessToken: ', login.accessToken);