import { toNano } from '@ton/core';
import { Attest } from '../build/Attest/tact_Attest';
import { Bot } from '../build/Attest/tact_Bot';
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
        'withdraw'
    );
}
