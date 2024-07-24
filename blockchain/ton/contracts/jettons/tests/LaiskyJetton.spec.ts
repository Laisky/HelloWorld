import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { LaiskyJetton } from '../wrappers/LaiskyJetton';
import '@ton/test-utils';

describe('LaiskyJetton', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let laiskyJetton: SandboxContract<LaiskyJetton>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        laiskyJetton = blockchain.openContract(await LaiskyJetton.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await laiskyJetton.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: laiskyJetton.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and laiskyJetton are ready to use
    });
});
