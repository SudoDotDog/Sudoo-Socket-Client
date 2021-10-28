/**
 * @author WMXPY
 * @namespace SocketClient_Client
 * @description Node
 */

import { client as WebSocketClient, connection as WebSocketConnection, Message as WebSocketMessage } from "websocket";
import { parseBasicAuthorizationToken } from "../util/authorization";
import { fixWebSocketUrl } from "../util/url";
import { SocketClientConnection } from "./connection";
import { ClientCloseHandler, ClientConnectHandler, ClientErrorHandler, GetConnectionFunction, SocketClientOptions } from "./declare";
import { SocketClientMessageHandler } from "./message-handler";

export class SocketClientNode {

    public static create(url: string, options: SocketClientOptions = {}): SocketClientNode {

        const client: SocketClientNode = new SocketClientNode(fixWebSocketUrl(url), options);
        return client;
    }

    private readonly _url: string;
    private readonly _options: SocketClientOptions;

    private readonly _client: WebSocketClient;

    private readonly _connectListeners: Set<ClientConnectHandler>;
    private readonly _errorListeners: Set<ClientErrorHandler>;
    private readonly _closeListeners: Set<ClientCloseHandler>;

    private readonly _defaultMessageHandler: SocketClientMessageHandler;
    private readonly _messageHandlers: Set<SocketClientMessageHandler>;

    private _connection: SocketClientConnection | null;

    private constructor(url: string, options: SocketClientOptions) {

        this._url = url;
        this._options = options;

        this._client = new WebSocketClient();

        this._connectListeners = new Set<ClientConnectHandler>();
        this._errorListeners = new Set<ClientErrorHandler>();
        this._closeListeners = new Set<ClientCloseHandler>();

        this._defaultMessageHandler = SocketClientMessageHandler.create(this._createGetConnectionFunction());
        this._messageHandlers = new Set<SocketClientMessageHandler>();

        this._connection = null;
    }

    public get isConnected(): boolean {
        return this._connection !== null;
    }
    public get defaultMessageHandler(): SocketClientMessageHandler {
        return this._defaultMessageHandler;
    }

    public getConnection(): SocketClientConnection | null {

        return this._connection;
    }

    public ensureConnection(): SocketClientConnection {

        if (this._connection === null) {
            throw new Error('[Sudoo-Socket-Client] Not Connected');
        }
        return this._connection;
    }

    public connect(): Promise<void> {

        return new Promise((resolve: () => void, reject: (error: Error) => void) => {

            this._client.on('connect', (connection: WebSocketConnection) => {

                const clientConnection: SocketClientConnection = SocketClientConnection.create(connection);

                connection.on('close', (code: number, reason: string) => {

                    this._connection = null;
                    this._closeListeners.forEach((listener: ClientCloseHandler) => {
                        listener(code, reason);
                    });
                });

                connection.on('message', (message: WebSocketMessage) => {

                    if (message.type === 'utf8') {

                        this._emitUTF8Message(message.utf8Data);
                    } else if (message.type === 'binary') {

                        this._emitBufferMessage(message.binaryData);
                    }
                });

                connection.on('error', (error: Error) => {

                    this._errorListeners.forEach((listener: ClientErrorHandler) => {
                        listener(error);
                    });

                    if (this._connection !== null) {
                        this._connection.close();
                        this._connection = null;
                    }
                });

                this._connection = clientConnection;

                this._connectListeners.forEach((listener: ClientConnectHandler) => {
                    listener(clientConnection);
                });

                resolve();
            });

            this._client.on('connectFailed', (error: Error) => {

                reject(error);
            });

            this._client.connect(
                this._url,
                this._options.protocol,
                (null as any),
                this._buildHeaders(),
            );
        });
    }

    public createAndGetMessageHandler(): SocketClientMessageHandler {

        const handler: SocketClientMessageHandler = SocketClientMessageHandler.create(this._createGetConnectionFunction());
        this._messageHandlers.add(handler);
        return handler;
    }

    public removeMessageHandler(handler: SocketClientMessageHandler): this {

        this._messageHandlers.delete(handler);
        return this;
    }

    public close(code?: number, description?: string): this {

        if (this._connection) {
            this._connection.close(code, description);
        }
        return this;
    }

    public addConnectListener(listener: ClientConnectHandler): this {

        this._connectListeners.add(listener);
        return this;
    }

    public removeConnectListener(listener: ClientConnectHandler): this {

        this._connectListeners.delete(listener);
        return this;
    }

    public addErrorListener(listener: ClientErrorHandler): this {

        this._errorListeners.add(listener);
        return this;
    }

    public removeErrorListener(listener: ClientErrorHandler): this {

        this._errorListeners.delete(listener);
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

    private _emitUTF8Message(message: string): this {

        const messageHandlers: SocketClientMessageHandler[] = this._getMessageHandlers();
        for (const messageHandler of messageHandlers) {
            messageHandler.emitUTF8Message(message);
        }
        return this;
    }

    private _emitBufferMessage(message: Buffer): this {

        const messageHandlers: SocketClientMessageHandler[] = this._getMessageHandlers();
        for (const messageHandler of messageHandlers) {
            messageHandler.emitBufferMessage(message);
        }
        return this;
    }

    private _getMessageHandlers(): SocketClientMessageHandler[] {

        return [
            this._defaultMessageHandler,
            ...this._messageHandlers,
        ];
    }

    private _createGetConnectionFunction(): GetConnectionFunction {

        return (): SocketClientConnection => {

            if (this._connection === null) {

                throw new Error('[Sudoo-Socket-Client] Not Connected');
            }
            return this._connection;
        };
    }

    private _buildHeaders(): Record<string, string> {

        const headers: Record<string, string> = {};

        if (typeof this._options.authorization !== 'undefined') {

            switch (this._options.authorization.type) {

                case 'basic': {

                    headers.Authorization = `Basic ${parseBasicAuthorizationToken(
                        this._options.authorization.username,
                        this._options.authorization.password,
                    )}`;
                    break;
                }
                case 'bearer': {

                    headers.Authorization = `Bearer ${this._options.authorization.token}`;
                    break;
                }
                case 'plain': {

                    headers.Authorization = `Plain ${this._options.authorization.token}`;
                    break;
                }
            }
        }
        return headers;
    }
}
