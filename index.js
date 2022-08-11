import {
    AutojoinRoomsMixin,
    LogLevel,
    LogService,
    MatrixClient,
    RustSdkCryptoStorageProvider,
    SimpleFsStorageProvider
} from "matrix-bot-sdk";
import path from "path";
import fs from 'fs-extra';
import MessageHandler from './module/message_handler.js';
import getPosts from './module/getPosts.js';
import moment from 'moment';

async function Matrix() {

    try {

        LogService.setLevel(LogLevel.name);

        let config = fs.readJSONSync(path.join(path.resolve(), "config.json"));
        let storage = new SimpleFsStorageProvider(path.join(config.dataPath, "bot.json"));
        // Prepare a crypto store if we need that
        let cryptoStore;
        if (config.encryption) {
            cryptoStore = new RustSdkCryptoStorageProvider(path.join(config.dataPath, "encrypted"));
        }
        // Now create the client
        let client = new MatrixClient(config.homeserverUrl, config.accessToken, storage, cryptoStore);
        // Setup the autojoin mixin (if enabled)
        if (config.autoJoin) {
            AutojoinRoomsMixin.setupOnClient(client);
        }
        // the message handler
        await MessageHandler(client);
        // Check for new topics on the website
        await getPosts(config.roomId, client);
        // This blocks until the bot is killed
        await client.start().then(() => console.log('start matrix-discourse-bridge : ', moment().format("LT")));

    } catch (error) {

        console.log(error);

    }

}

Matrix()