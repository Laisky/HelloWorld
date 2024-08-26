import { Address, toNano, beginCell, contractAddress, SenderArguments } from '@ton/core';
import { Bot, storeSubmitAttestTask } from '../build/Attest/tact_Bot';
import { Attest } from '../build/Attest/tact_Attest';
import { compile, NetworkProvider } from '@ton/blueprint';
import { buildOnchainMetadata } from './utils/jetton-helpers';
import { run as deploy } from "./deploy";
import { myAddress } from './env';

export async function run(provider: NetworkProvider) {
    const masterContract = await deploy(provider);

    const bot = await Bot.fromInit(
        masterContract.address,
        myAddress
    )
    const botContract = provider.provider(bot.address);

    const cell = beginCell().store(
        storeSubmitAttestTask({
            $$type: 'SubmitAttestTask',
            proofUrl: "https://ario.laisky.com/alias/attest-proof.json",
            attestValue: toNano("0.05"),
        })).asCell();

    await botContract.internal(
        provider.sender(),
        {
            value: toNano('0.05'),
            body: cell
        },
    );
}
