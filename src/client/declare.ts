/**
 * @author WMXPY
 * @namespace SocketClient_Client
 * @description Declare
 */

import { SocketClientConnection } from "./connection";

export type GetConnectionFunction = () => SocketClientConnection;

export type ClientConnectHandler = (connection: SocketClientConnection) => void;
export type ClientErrorHandler = (error: Error) => void;
export type ClientCloseHandler = (code: number, reason: string) => void;

export type ClientUTF8MessageHandler = (message: string, connection: SocketClientConnection) => void;
export type ClientJSONMessageHandler<T = any> = (message: T, connection: SocketClientConnection) => void;
export type ClientBufferMessageHandler = (message: Buffer, connection: SocketClientConnection) => void;

export type SocketClientAuthorizationOption = {

    readonly type: 'bearer';
    readonly token: string;
} | {

    readonly type: 'basic';
    readonly username: string;
    readonly password: string;
} | {

    readonly type: 'plain';
    readonly token: string;
};

export type SocketClientOptions = {

    readonly authorization?: SocketClientAuthorizationOption;
    readonly origin?: string;
    readonly protocol?: string;
};
