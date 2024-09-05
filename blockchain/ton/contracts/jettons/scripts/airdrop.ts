import { toNano } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { getMasterContract } from './deploy.ts';


export async function run(provider: NetworkProvider) {
    const masterJetton = await getMasterContract(provider);

    await masterJetton.send(
        provider.sender(),
        {
            value: toNano(1),
            bounce: false,
        },
        "airdrop"
    )
}
