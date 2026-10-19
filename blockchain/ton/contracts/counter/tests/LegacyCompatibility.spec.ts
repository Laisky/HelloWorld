import { Blockchain } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { HelloWorld } from '../wrappers/HelloWorld';
import '@ton/test-utils';
const original = require('./fixtures/original-func.json');

describe('original FunC state and wire compatibility', () => {
    it('reads and increments the original populated state using the original compiled code', async () => {
        const code = Cell.fromBoc(Buffer.from(original.code, 'hex'))[0];
        const contract = HelloWorld.createFromConfig({ id: 42, counter: 7 }, code);
        expect(contract.address.toRawString()).toBe(original.address);
        expect(contract.init!.data.toBoc().toString('hex')).toBe(original.data);
        const blockchain = await Blockchain.create();
        const sender = await blockchain.treasury('legacy-compatibility');
        const opened = blockchain.openContract(contract);
        await opened.sendDeploy(sender.getSender(), toNano('0.05'));
        expect(await opened.getID()).toBe(42);
        expect(await opened.getCounter()).toBe(7);
        const result = await opened.sendIncrease(sender.getSender(), { increaseBy: 5, value: toNano('0.05') });
        expect(result.transactions).toHaveTransaction({ from: sender.address, to: opened.address, success: true });
        expect(await opened.getCounter()).toBe(12);
    });
});
