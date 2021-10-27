/**
 * @author WMXPY
 * @namespace Example
 * @description Example
 */

import { SocketClientNode } from "../src";

(async () => {

    const socket: SocketClientNode = SocketClientNode.create('localhost:3000', {
        // protocol: 'echo2',
    })

    socket.messageHandler.addJSONMessageListener(console.log);
    try {
        await socket.connect();
    } catch (err) {
        console.log(`ERROR CAUGHT: ${err}`);
    }
})();
