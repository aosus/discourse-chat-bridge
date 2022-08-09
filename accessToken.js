import { MatrixAuth } from "matrix-bot-sdk";
import path from "path";
import fs from 'fs-extra';

let config = fs.readJSONSync(path.join(path.resolve(), "config.json"));
let homeserverUrl = config?.homeserverUrl;
let username = config?.username_matrix;
let password = config?.password_matrix;
let auth = new MatrixAuth(homeserverUrl);
let login = await auth.passwordLogin(username, password);

config.homeserverUrl = login.accessToken
fs.writeJSONSync(path.join(path.resolve(), "config.json"), config)
console.log('accessToken: ', login.accessToken);