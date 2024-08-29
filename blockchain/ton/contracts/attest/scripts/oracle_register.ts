import { toNano } from '@ton/core';
import { Attest } from '../build/Attest/tact_Attest';
import { NetworkProvider } from '@ton/blueprint';
import { myAddress  } from './env';


export async function run(provider: NetworkProvider) {
    const masterContract = provider.open(await Attest.fromInit());

    // register
    await masterContract.send(
        provider.sender(),
        {
            value: toNano('0.1'),
            bounce: false
        },
        {
            $$type: "RegisterOracle",
            stakeValue: toNano("0.05"),
            oracleOwner: myAddress
        }
    );
}
