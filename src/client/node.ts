/**
 * @author WMXPY
 * @namespace SocketClient_Client
 * @description Node
 */

import { client as WebSocketClient, connection as WebSocketConnection } from "websocket";
import { ClientOnCloseHandler } from "./declare";

export class SocketClientNode {

    public static create(url: string): SocketClientNode {

        const client: SocketClientNode = new SocketClientNode(url);
        return client;
    }

    private readonly _url: string;
    private readonly _client: WebSocketClient;

    private _connection: WebSocketConnection | null = null;

    private constructor(url: string) {

        this._url = url;
        this._client = new WebSocketClient();
    }

    public connect(): Promise<void> {

        return new Promise((resolve: () => void, reject: (error: Error) => void) => {

            this._client.on('connect', (connection: WebSocketConnection) => {
                this._connection = connection;
                resolve();
            });

            this._client.on('connectFailed', (error: Error) => {
                reject(error);
            });

            this._client.connect(this._url);
        });
    }

    public addOnCloseListener(listener: ClientOnCloseHandler): void {

        this._connection.on('close', (code: number, description: string) => {
            listener(code, description);
        });
    }
}
