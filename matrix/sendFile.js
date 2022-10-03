import fs from 'fs-extra';
import getBuffer from '../module/getBuffer.js';

export default async function sendFile(roomId, filePath, type, client) {

    let worksBuffer 
    let checkfilePath = filePath.includes('https') || filePath.includes('http');

    if (checkfilePath) {

        let buffer = await getBuffer(filePath).catch(error => console.log(error));
        fs.writeFileSync('./preview.png', Buffer.from(buffer));
        worksBuffer = fs.readFileSync('./preview.png');
    }

    else {
        worksBuffer = fs.readFileSync(filePath);
    }

    let encrypted = await client.crypto.encryptMedia(Buffer.from(worksBuffer));
    let mxc = await client.uploadContent(encrypted.buffer);

    await client.sendMessage(roomId, {
        msgtype: type,
        body: "preview",
        file: {
            url: mxc,
            ...encrypted.file,
        },
    })
}