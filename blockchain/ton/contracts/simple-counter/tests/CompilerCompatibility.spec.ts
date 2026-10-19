import { SimpleCounter } from '../wrappers/SimpleCounter';
const original = require('./fixtures/original-init.json');

describe('original Tact artifact compatibility', () => {
    it('preserves the compiled code, initial data and address for the original zero-state fixture', async () => {
        const contract = await SimpleCounter.fromInit(0n);
        expect({
            address: contract.address.toRawString(),
            code: contract.init!.code.toBoc().toString('base64'),
            data: contract.init!.data.toBoc().toString('base64'),
        }).toEqual(original);
    });
});
