import { toNano } from '@ton/core';
import { Attest } from '../build/Attest/tact_Attest';
import { NetworkProvider } from '@ton/blueprint';


export async function run(provider: NetworkProvider) {
    const masterContract = provider.open(await Attest.fromInit());

    // register
    await masterContract.send(
        provider.sender(),
        {
            value: toNano('0.1'),
        },
        {
            $$type: "RegisterOracle",
            queryId: BigInt("123"),
            stakeValue: toNano("0.05"), // should bigger than MinimalOracleStakeValue
            oracleOwner: provider.sender().address!!,
            responseDestination: provider.sender().address!!,
            manifestUrl: "https://ario.laisky.com/alias/attest-manifest.json",
        }
    );
}
