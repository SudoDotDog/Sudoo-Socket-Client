/**
 * @author WMXPY
 * @namespace SocketClient_Client
 * @description Declare
 */

export type ClientCloseHandler = (code: number, reason: string) => void;
export type ClientUTF8MessageHandler = (message: string) => void;
export type ClientBufferMessageHandler = (message: Buffer) => void;

export type WebSocketClientOptions = {

    readonly protocol?: string | string[];
};
