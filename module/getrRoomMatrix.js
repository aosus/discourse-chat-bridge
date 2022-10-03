import fs from 'fs-extra';

/** 
@param {string} type - room or direct
*/

export default async function getrRoomMatrix(type) {

    let room = fs.readdirSync('./database/matrix/room');
    let direct = fs.readdirSync('./database/matrix/direct');
    let arrayRoomId = []
    let arrayDirectId = []
    let arrayAllId = []
    let arrayRoomJson = []
    let arrayDirectJson = []
    let arrayAllJson = []

    for (let item of room) {

        let id = item.split('.json')[0]
        let roomJson = fs.readJsonSync(`./database/matrix/room/${item}`);
        if (roomJson?.evenPost) {

            arrayRoomId.push(id);
            arrayRoomJson.push(roomJson);
            arrayAllId.push(id);
            arrayAllJson.push(roomJson);
        }
    }

    for (let item of direct) {

        let id = item.split('.json')[0]
        let directJson = fs.readJsonSync(`./database/matrix/direct/${item}`);
        if (directJson?.evenPost) {

            arrayDirectId.push(id);
            arrayDirectJson.push(directJson);
            arrayAllId.push(id);
            arrayAllJson.push(directJson);
        }
    }

    if (type === 'room') {
        return {
            id: arrayRoomId,
            array: arrayRoomJson
        }
    }

    else if (type === 'direct') {
        return {
            id: arrayDirectId,
            array: arrayDirectJson
        }
    }

    else if (type === 'all') {
        return {
            id: arrayAllId,
            array: arrayAllJson
        }
    }
}