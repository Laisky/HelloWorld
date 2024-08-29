import { toNano } from '@ton/core';
import { Bot } from '../build/Attest/tact_Bot';
import { Attest } from '../build/Attest/tact_Attest';
import { NetworkProvider } from '@ton/blueprint';
import { myAddress } from './env';


export async function run(provider: NetworkProvider) {
    const masterContract = provider.open(await Attest.fromInit());
    const botContract = provider.open(await Bot.fromInit(
        masterContract.address,
        myAddress
    ));

    await botContract.send(
        provider.sender(),
        {
            value: toNano('0.1'),
        },
        {
            $$type: 'SubmitAttestTask',
            proofUrl: "https://ario.laisky.com/alias/attest-proof.json",
            attestValue: toNano("0.05"),
        }
    );
}
