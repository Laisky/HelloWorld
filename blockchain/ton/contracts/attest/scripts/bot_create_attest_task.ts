import { toNano } from '@ton/core';
import { Bot } from '../build/Attest/tact_Bot';
import { Attest } from '../build/Attest/tact_Attest';
import { NetworkProvider } from '@ton/blueprint';


export async function run(provider: NetworkProvider) {
    const masterContract = provider.open(await Attest.fromInit());
    const botContract = provider.open(await Bot.fromInit(
        masterContract.address,
        provider.sender().address!!
    ));

    await botContract.send(
        provider.sender(),
        {
            value: toNano('1'),
        },
        {
            $$type: 'SubmitAttestTask',
            queryId: BigInt("123"),
            proofUrl: "https://ario.laisky.com/alias/attest-proof.json",
            attestValue: toNano("0.1"),
            finishedNotifyUser: provider.sender().address!!,
            finishedNotifyAmount: toNano("0.1"),
            finishedNotifyMessage: "task finished",
        }
    );
}
