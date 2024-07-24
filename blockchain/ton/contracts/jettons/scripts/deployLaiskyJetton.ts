import { toNano } from '@ton/core';
import { LaiskyJetton } from '../wrappers/LaiskyJetton';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const laiskyJetton = provider.open(await LaiskyJetton.fromInit());

    await laiskyJetton.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(laiskyJetton.address);

    // run methods on `laiskyJetton`
}
