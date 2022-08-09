import fs from 'fs-extra';
import path from "path";

export default async function sendFile(filePath, roomId, type, client) {

    let __dirname = path.resolve();
    let worksImage = fs.readFileSync(path.join(__dirname, filePath))
    let encrypted = await client.crypto.encryptMedia(Buffer.from(worksImage));
    let mxc = await client.uploadContent(encrypted.buffer);
    await client.sendMessage(roomId, {
        msgtype: type,
        body: "aosusBot",
        file: {
            url: mxc,
            ...encrypted.file,
        },
    });

}