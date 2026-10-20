import { Address, toNano } from '@ton/core';
import { NetworkProvider, sleep } from '@ton/blueprint';
import { run } from '../scripts/withdraw';
jest.mock('@ton/blueprint', () => ({ sleep: jest.fn().mockResolvedValue(undefined) }));

function fixture(deployed: boolean) {
    const address = new Address(0, Buffer.alloc(32, 1));
    const recipient = new Address(0, Buffer.alloc(32, 2));
    const ui = { input: jest.fn().mockResolvedValueOnce(recipient.toString()).mockResolvedValueOnce('0.01'), write: jest.fn() };
    const sendWithdraw = jest.fn().mockResolvedValue(undefined);
    const getState = jest.fn().mockResolvedValue({ balance: 123n });
    const sender = {};
    const provider = { ui: () => ui, isContractDeployed: jest.fn().mockResolvedValue(deployed),
        open: jest.fn().mockReturnValue({ sendWithdraw }), sender: () => sender,
        provider: jest.fn().mockReturnValue({ getState }) };
    return { address, recipient, ui, sendWithdraw, getState, sender, provider };
}

describe('withdraw script compatibility with a mocked provider only', () => {
    beforeEach(() => jest.clearAllMocks());
    it('preserves send arguments and reads the resulting balance through ContractProvider', async () => {
        const f = fixture(true);
        await run(f.provider as unknown as NetworkProvider, [f.address.toString()]);
        expect(f.sendWithdraw).toHaveBeenCalledTimes(1);
        const [sender, sent] = f.sendWithdraw.mock.calls[0];
        expect(sender).toBe(f.sender);
        expect({ ...sent, recipient: sent.recipient.toRawString() }).toEqual({
            amount: toNano('0.01'), recipient: f.recipient.toRawString(), value: toNano('0.05'), queryID: expect.any(Number),
        });
        expect(sleep).toHaveBeenCalledWith(5000);
        expect(f.provider.provider).toHaveBeenCalledTimes(1);
        expect(f.provider.provider.mock.calls[0][0].toRawString()).toBe(f.address.toRawString());
        expect(f.getState).toHaveBeenCalledTimes(1);
        expect(f.ui.write).toHaveBeenLastCalledWith('Contract balance after withdrawal: 123 nanoTON');
    });
    it('retains the undeployed-contract guard without sending or requesting balance', async () => {
        const f = fixture(false);
        await run(f.provider as unknown as NetworkProvider, [f.address.toString()]);
        expect(f.sendWithdraw).not.toHaveBeenCalled();
        expect(f.provider.provider).not.toHaveBeenCalled();
        expect(f.ui.input).not.toHaveBeenCalled();
        expect(f.ui.write).toHaveBeenCalledWith(expect.stringContaining('not deployed'));
    });
});
