import { Address, toNano, beginCell, contractAddress } from '@ton/core';
import { LaiskyJetton, Mint, storeMint  } from '../wrappers/LaiskyJetton';
import { compile, NetworkProvider } from '@ton/blueprint';
import { buildOnchainMetadata } from './utils/jetton-helpers';
import { run as deploy } from "./deploy";
import { myAddress } from './env';

export async function run(provider: NetworkProvider) {
    const laiskyJetton = await deploy(provider);

    const ui = provider.ui();
    const value = toNano(await ui.input('value'));

    // deposit
    await laiskyJetton.send(
        provider.sender(),
        {
            value: value
        },
        {
            $$type: 'Noop',
        },
    )
}
