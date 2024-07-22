import { toNano } from '@ton/core';
import { SimpleCounter } from '../wrappers/SimpleCounter';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const simpleCounter = provider.open(await SimpleCounter.fromInit(BigInt(Math.floor(Math.random() * 10000))));

    await simpleCounter.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(simpleCounter.address);

    console.log('ID', await simpleCounter.getId());
}
