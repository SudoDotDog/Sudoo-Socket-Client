/**
 * @author WMXPY
 * @namespace SocketClient_Client
 * @description Node
 */

import { client as WebSocketClient, connection as WebSocketConnection, Message as WebSocketMessage } from "websocket";
import { fixWebSocketUrl } from "../util/url";
import { ClientCloseHandler, SocketClientOptions } from "./declare";
import { SocketClientMessageHandler } from "./message-handler";

export class SocketClientNode {

    public static create(url: string, options: SocketClientOptions = {}): SocketClientNode {

        const client: SocketClientNode = new SocketClientNode(fixWebSocketUrl(url), options);
        return client;
    }

    private readonly _url: string;
    private readonly _options: SocketClientOptions;

    private readonly _client: WebSocketClient;

    private readonly _closeListeners: Set<ClientCloseHandler>;
    private readonly _messageHandler: SocketClientMessageHandler;

    private _connection: WebSocketConnection | null = null;

    private constructor(url: string, options: SocketClientOptions) {

        this._url = url;
        this._options = options;

        this._client = new WebSocketClient();

        this._closeListeners = new Set();
        this._messageHandler = SocketClientMessageHandler.create();
    }

    public get isConnected(): boolean {
        return this._connection !== null;
    }
    public get messageHandler(): SocketClientMessageHandler {
        return this._messageHandler;
    }

    public connect(): Promise<void> {

        return new Promise((resolve: () => void, reject: (error: Error) => void) => {

            this._client.on('connect', (connection: WebSocketConnection) => {

                connection.on('close', (code: number, reason: string) => {

                    this._connection = null;
                    this._closeListeners.forEach((listener: ClientCloseHandler) => {
                        listener(code, reason);
                    });
                });

                connection.on('message', (message: WebSocketMessage) => {

                    if (message.type === 'utf8') {

                        this._messageHandler.sendUTF8Message(message.utf8Data);
                    } else if (message.type === 'binary') {

                        this._messageHandler.sendBufferMessage(message.binaryData);
                    }
                });

                this._connection = connection;
                resolve();
            });

            this._client.on('connectFailed', (error: Error) => {

                reject(error);
            });

            this._client.connect(this._url, this._options.protocol);
        });
    }

    public close(): this {

        if (this._connection) {
            this._connection.close();
        }
        return this;
    }

    public addCloseListener(listener: ClientCloseHandler): this {

        this._closeListeners.add(listener);
        return this;
    }

    public removeCloseListener(listener: ClientCloseHandler): this {

        this._closeListeners.delete(listener);
        return this;
    }
}
