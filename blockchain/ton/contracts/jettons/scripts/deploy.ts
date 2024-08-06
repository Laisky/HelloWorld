import { toNano } from '@ton/core';
import { myAddress, config as envConfig } from './env';
// import { myAddress } from './env';
import { LaiskyJetton } from '../wrappers/LaiskyJetton';
import { NetworkProvider, Config } from '@ton/blueprint';
import { buildOnchainMetadata } from './utils/jetton-helpers';


export const config = envConfig;

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
    console.log(`Deploying LaiskyJetton at ${laiskyJetton.address}`);

    // there is not need to wait for deploy finish,
    // because the contract will keep uninitialized until the first call.
    // if (!await provider.isContractDeployed(laiskyJetton.address)) {
    //     console.log(`Deploying LaiskyJetton at ${laiskyJetton.address}`);
    //     await provider.waitForDeploy(laiskyJetton.address, 20);
    // }

    return laiskyJetton;
}
