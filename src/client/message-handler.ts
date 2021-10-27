/**
 * @author WMXPY
 * @namespace SocketClient_Client
 * @description Message Handler
 */

import { SocketClientConnection } from "./connection";
import { ClientBufferMessageHandler, ClientJSONMessageHandler, ClientUTF8MessageHandler, GetConnectionFunction } from "./declare";

export class SocketClientMessageHandler {

    public static create(getConnectionFunction: GetConnectionFunction): SocketClientMessageHandler {

        return new SocketClientMessageHandler(getConnectionFunction);
    }

    private readonly _getConnectionFunction: GetConnectionFunction;

    private readonly _utf8MessageListeners: Set<ClientUTF8MessageHandler>;
    private readonly _jsonMessageListeners: Set<ClientJSONMessageHandler>;
    private readonly _bufferMessageListeners: Set<ClientBufferMessageHandler>;

    private constructor(getConnectionFunction: GetConnectionFunction) {

        this._getConnectionFunction = getConnectionFunction;

        this._utf8MessageListeners = new Set();
        this._jsonMessageListeners = new Set();
        this._bufferMessageListeners = new Set();
    }

    public emitUTF8Message(message: string): void {

        // eslint-disable-next-line no-useless-catch
        try {

            const connection: SocketClientConnection = this._getConnectionFunction();
            this._emitUTF8OrJsonMessage(message, connection);
            return;
        } catch (error) {

            throw error;
        }
    }

    public emitBufferMessage(message: Buffer): void {

        // eslint-disable-next-line no-useless-catch
        try {

            const connection: SocketClientConnection = this._getConnectionFunction();
            this._bufferMessageListeners.forEach((listener: ClientBufferMessageHandler) => {

                listener(message, connection);
            });
            return;
        } catch (error) {

            throw error;
        }
    }

    public addUTF8MessageListener(listener: ClientUTF8MessageHandler): this {

        this._utf8MessageListeners.add(listener);
        return this;
    }

    public removeUTF8MessageListener(listener: ClientUTF8MessageHandler): this {

        this._utf8MessageListeners.delete(listener);
        return this;
    }

    public addJSONMessageListener(listener: ClientJSONMessageHandler): this {

        this._jsonMessageListeners.add(listener);
        return this;
    }

    public removeJSONMessageListener(listener: ClientJSONMessageHandler): this {

        this._jsonMessageListeners.delete(listener);
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

    private _emitUTF8OrJsonMessage(message: string, connection: SocketClientConnection): this {

        try {

            const parsed: string = JSON.parse(message);
            this._jsonMessageListeners.forEach((listener: ClientJSONMessageHandler) => {

                listener(parsed, connection);
            });
        } catch (error) {

            this._utf8MessageListeners.forEach((listener: ClientUTF8MessageHandler) => {

                listener(message, connection);
            });
        }
        return this;
    }
}
