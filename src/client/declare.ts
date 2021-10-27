/**
 * @author WMXPY
 * @namespace SocketClient_Client
 * @description Declare
 */

import { SocketClientConnection } from "./connection";

export type GetConnectionFunction = () => SocketClientConnection;

export type ClientConnectHandler = () => void;
export type ClientCloseHandler = (code: number, reason: string) => void;

export type ClientUTF8MessageHandler = (message: string, connection: SocketClientConnection) => void;
export type ClientJSONMessageHandler<T = any> = (message: T, connection: SocketClientConnection) => void;
export type ClientBufferMessageHandler = (message: Buffer, connection: SocketClientConnection) => void;

export type SocketClientOptions = {

    readonly protocol?: string;
};
