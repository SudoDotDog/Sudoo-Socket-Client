/**
 * @author WMXPY
 * @namespace SocketClient_Util
 * @description URL
 * @override Unit Test
 */

import { expect } from "chai";
import * as Chance from "chance";
import { fixWebSocketUrl } from "../../../src";

describe('Given [URL] Helper methods', (): void => {

    const chance: Chance.Chance = new Chance('util-url');

    it('should be able to parse simple ws url', (): void => {

        const url: string = chance.string();

        const original: string = `ws://${url}`;
        const fixed: string = fixWebSocketUrl(original);

        expect(original).to.be.equal(fixed);
    });
});
