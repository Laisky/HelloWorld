import { Address, toNano, beginCell, contractAddress } from '@ton/core';
import { myAddress } from './env';
import { LaiskyJetton, Mint, storeMint } from '../wrappers/LaiskyJetton';
import { compile, NetworkProvider } from '@ton/blueprint';
import { buildOnchainMetadata } from './utils/jetton-helpers';

/**
 * Deploy the jetton contract
 *
 * @param provider - The network provider
 * @returns The deployed jetton contract
 */
export async function run(provider: NetworkProvider) {
    const jettonParams = {
        name: "Laisky's Jetton",
        description: 'This is the first jetton created by Laisky',
        symbol: 'Laisky',
        image: 'https://ario.laisky.com/alias/head',
    };

    // Create content Cell
    const content = buildOnchainMetadata(jettonParams);
    const max_supply = toNano(1000); // 🔴 Set the specific total supply in nano

    // deploy
    const laiskyJetton = provider.open(await LaiskyJetton.fromInit(myAddress, content, max_supply));

    if (!await provider.isContractDeployed(laiskyJetton.address)) {
        await provider.waitForDeploy(laiskyJetton.address);
    }

    return laiskyJetton;
}
