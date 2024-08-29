import { toNano } from '@ton/core';
import { Attest } from '../build/Attest/tact_Attest';
import { NetworkProvider } from '@ton/blueprint';


export async function run(provider: NetworkProvider) {
    const masterContract = provider.open(await Attest.fromInit())

    await masterContract.send(
        provider.sender(),
        {
            value: toNano('0.1'),
        },
        'withdraw'
    );
}
