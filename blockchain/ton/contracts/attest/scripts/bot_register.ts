import { toNano } from '@ton/core';
import { Attest } from '../build/Attest/tact_Attest';
import { NetworkProvider } from '@ton/blueprint';


export async function run(provider: NetworkProvider) {
    const masterContract = provider.open(await Attest.fromInit());

    // register
    await masterContract.send(
        provider.sender(),
        {
            value: toNano('1'),
        },
        {
            $$type: 'RegisterBot',
            queryId: BigInt("123"),
            manifestUrl: "https://ario.laisky.com/alias/attest-manifest.json",
            botOwner: provider.sender().address!!,
            responseDestination: provider.sender().address!!,
        },
    );
}
