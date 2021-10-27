/**
 * @author WMXPY
 * @namespace Example
 * @description Example
 */

import { SocketClientNode } from "../src";

(async (): Promise<void> => {

    const socket: SocketClientNode = SocketClientNode.create('localhost:3000');

    socket.defaultMessageHandler.addJSONMessageListener(console.log);
    try {
        await socket.connect();
    } catch (err) {
        console.log(`ERROR CAUGHT: ${err.toString()}`);
    }
})();
