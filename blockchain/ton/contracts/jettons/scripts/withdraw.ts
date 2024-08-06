import { Address, toNano, beginCell, contractAddress } from '@ton/core';
import { LaiskyJetton, Mint, storeMint } from '../wrappers/LaiskyJetton';
import { compile, NetworkProvider } from '@ton/blueprint';
import { buildOnchainMetadata } from './utils/jetton-helpers';
import { run as deploy } from "./deploy";
import { run as deposit } from "./deposit";
import { myAddress, config as envConfig } from './env';

export const config = envConfig;

export async function run(provider: NetworkProvider) {
    const laiskyJetton = await deploy(provider);


    const ui = provider.ui();
    const amount = toNano(await ui.input('amount'));
    const toAddress = Address.parse(await ui.input('to address'));

    // for test
    await deposit(provider);

    // withdraw
    await laiskyJetton.send(
        provider.sender(),
        {
            value: toNano("0.05")
        },
        {
            $$type: 'Withdraw',
            to: toAddress,
            amount: amount,
        },
    )
}
