/**
 * @author WMXPY
 * @namespace SocketClient_Client
 * @description Node
 * @override Unit Test
 */

import { expect } from "chai";
import * as Chance from "chance";
import { SocketClientNode } from "../../../src";

describe('Given {SocketClientNode} Class', (): void => {

    const chance: Chance.Chance = new Chance('client-node');

    it('should be able to construct', (): void => {

        const client: SocketClientNode = SocketClientNode.create(chance.url());

        expect(client).to.be.instanceOf(SocketClientNode);
    });
});
