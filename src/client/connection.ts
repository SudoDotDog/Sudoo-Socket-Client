/**
 * @author WMXPY
 * @namespace SocketClient_Client
 * @description Connection
 */

import { connection as WebSocketConnection } from "websocket";

export class SocketClientConnection {

    public static create(connection: WebSocketConnection): SocketClientConnection {

        const client: SocketClientConnection = new SocketClientConnection(connection);
        return client;
    }

    private _connection: WebSocketConnection | null = null;

    private constructor(connection: WebSocketConnection) {

        this._connection = connection;
    }

    public sendJSON<T = any>(data: T): Promise<void> {

        return new Promise((resolve: () => void, reject: (error: Error) => void) => {

            if (this._connection === null) {
                reject(new Error('[Sudoo-Socket-Client] Not Connected'));
                return;
            }

            this._connection.sendUTF(JSON.stringify(data), (error?: Error) => {

                if (typeof error !== 'undefined') {
                    reject(error);
                    return;
                }

                resolve();
                return;
            });
        });
    }

    public sendBuffer(buffer: Buffer): Promise<void> {

        return new Promise((resolve: () => void, reject: (error: Error) => void) => {

            if (this._connection === null) {
                reject(new Error('[Sudoo-Socket-Client] Not Connected'));
                return;
            }

            this._connection.sendBytes(buffer, (error?: Error) => {

                if (typeof error !== 'undefined') {
                    reject(error);
                    return;
                }

                resolve();
                return;
            });
        });
    }

    public sendUTF8(data: string): Promise<void> {

        return new Promise((resolve: () => void, reject: (error: Error) => void) => {

            if (this._connection === null) {
                reject(new Error('[Sudoo-Socket-Client] Not Connected'));
                return;
            }

            this._connection.sendUTF(data, (error?: Error) => {

                if (typeof error !== 'undefined') {
                    reject(error);
                    return;
                }

                resolve();
                return;
            });
        });
    }

    public close(code?: number, description?: string): this {

        if (this._connection === null) {
            throw new Error('[Sudoo-Socket-Client] Not Connected');
        }

        this._connection.close(code, description);
        this._connection = null;
        return this;
    }
}
