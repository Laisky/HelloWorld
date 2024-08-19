import { Address, toNano, beginCell, contractAddress } from '@ton/core';
import { LaiskyJetton, Mint, storeMint } from '../wrappers/LaiskyJetton';
import { compile, NetworkProvider } from '@ton/blueprint';
import { buildOnchainMetadata } from './utils/jetton-helpers';
import { run as deploy } from "./deploy";
import { myAddress } from './env';

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();
    const receiver = Address.parse(await ui.input('receiver\'s address'));

    const laiskyJetton = await deploy(provider);

    // mint
    await laiskyJetton.send(
        provider.sender(),
        {
            value: toNano('0'),
        },
        {
            $$type: 'Mint',
            amount: toNano('50'),
            receiver: receiver,
        },
    )
}
