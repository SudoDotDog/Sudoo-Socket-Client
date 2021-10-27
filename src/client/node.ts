/**
 * @author WMXPY
 * @namespace SocketClient_Client
 * @description Node
 */

import { client as WebSocketClient } from "websocket";

export class SocketClientNode {

    public static create(url: string): SocketClientNode {

        const client: SocketClientNode = new SocketClientNode(url);
        return client;
    }

    private readonly _client: WebSocketClient;

    private constructor(url: string) {

        this._client = new WebSocketClient();

        this._client.connect(url);
    }
}
