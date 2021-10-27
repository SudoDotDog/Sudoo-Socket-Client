/**
 * @author WMXPY
 * @namespace SocketClient_Client
 * @description Declare
 */

export type ClientConnectHandler = () => void;
export type ClientCloseHandler = (code: number, reason: string) => void;

export type ClientUTF8MessageHandler = (message: string) => void;
export type ClientJSONMessageHandler<T = any> = (message: T) => void;
export type ClientBufferMessageHandler = (message: Buffer) => void;

export type SocketClientOptions = {

    readonly protocol?: string;
};
