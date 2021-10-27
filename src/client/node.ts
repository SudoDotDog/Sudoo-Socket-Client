/**
 * @author WMXPY
 * @namespace SocketClient_Client
 * @description Node
 */

import { client as WebSocketClient, connection as WebSocketConnection, Message as WebSocketMessage } from "websocket";
import { ClientBufferMessageHandler, ClientUTF8MessageHandler, WebSocketClientOptions } from "..";
import { ClientCloseHandler } from "./declare";

export class SocketClientNode {

    public static create(url: string, options: WebSocketClientOptions = {}): SocketClientNode {

        const client: SocketClientNode = new SocketClientNode(url, options);
        return client;
    }

    private readonly _url: string;
    private readonly _options: WebSocketClientOptions;

    private readonly _client: WebSocketClient;

    private readonly _closeListeners: Set<ClientCloseHandler>;
    private readonly _utf8MessageListeners: Set<ClientUTF8MessageHandler>;
    private readonly _bufferMessageListeners: Set<ClientBufferMessageHandler>;

    private _connection: WebSocketConnection | null = null;

    private constructor(url: string, options: WebSocketClientOptions) {

        this._url = url;
        this._options = options;

        this._client = new WebSocketClient();

        this._closeListeners = new Set();
        this._utf8MessageListeners = new Set();
        this._bufferMessageListeners = new Set();
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

                        this._utf8MessageListeners.forEach((listener: ClientUTF8MessageHandler) => {
                            listener(message.utf8Data);
                        });
                    } else if (message.type === 'binary') {

                        this._bufferMessageListeners.forEach((listener: ClientBufferMessageHandler) => {
                            listener(message.binaryData);
                        });
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

    public addUTF8MessageListener(listener: ClientUTF8MessageHandler): this {

        this._utf8MessageListeners.add(listener);
        return this;
    }

    public removeUTF8MessageListener(listener: ClientUTF8MessageHandler): this {

        this._utf8MessageListeners.delete(listener);
        return this;
    }

    public addBufferMessageListener(listener: ClientBufferMessageHandler): this {

        this._bufferMessageListeners.add(listener);
        return this;
    }

    public removeBufferMessageListener(listener: ClientBufferMessageHandler): this {

        this._bufferMessageListeners.delete(listener);
        return this;
    }
}
