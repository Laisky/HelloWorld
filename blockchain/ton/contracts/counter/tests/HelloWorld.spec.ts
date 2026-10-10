import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { HelloWorld } from '../wrappers/HelloWorld';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('HelloWorld', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('HelloWorld');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let helloWorld: SandboxContract<HelloWorld>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        helloWorld = blockchain.openContract(
            HelloWorld.createFromConfig(
                {
                    id: 0,
                    counter: 0,
                },
                code
            )
        );

        deployer = await blockchain.treasury('deployer');

        const deployResult = await helloWorld.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: helloWorld.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and helloWorld are ready to use
    });

    it('should increase counter', async () => {
        const increaseTimes = 3;
        for (let i = 0; i < increaseTimes; i++) {
            console.log(`increase ${i + 1}/${increaseTimes}`);

            const increaser = await blockchain.treasury('increaser' + i);

            const counterBefore = await helloWorld.getCounter();

            console.log('counter before increasing', counterBefore);

            const increaseBy = [1, 7, 42][i];

            console.log('increasing by', increaseBy);

            const increaseResult = await helloWorld.sendIncrease(increaser.getSender(), {
                increaseBy,
                value: toNano('0.05'),
            });

            expect(increaseResult.transactions).toHaveTransaction({
                from: increaser.address,
                to: helloWorld.address,
                success: true,
            });

            const counterAfter = await helloWorld.getCounter();

            console.log('counter after increasing', counterAfter);

            expect(counterAfter).toBe(counterBefore + increaseBy);
        }
    });
    it('should deliver a withdraw message without changing the counter', async () => {
        const recipient = await blockchain.treasury('recipient');
        const amount = toNano('0.01');
        const result = await helloWorld.sendWithdraw(deployer.getSender(), {
            amount, recipient: recipient.address, value: toNano('0.05'),
        });
        expect(result.transactions).toHaveTransaction({
            from: helloWorld.address, to: recipient.address, value: amount, success: true,
        });
        expect(await helloWorld.getCounter()).toBe(0);
    });

    it('should reject withdrawals exceeding the available balance', async () => {
        const result = await helloWorld.sendWithdraw(deployer.getSender(), {
            amount: toNano('2'), recipient: deployer.address, value: toNano('0.05'),
        });
        expect(result.transactions).toHaveTransaction({
            from: deployer.address, to: helloWorld.address, success: false, exitCode: 1001,
        });
        expect(await helloWorld.getCounter()).toBe(0);
    });

});
