import { toNano } from '@ton/core';
import { myAddress, config as envConfig } from './env';
import { Attest } from '../wrappers/Attest';
import { NetworkProvider, Config } from '@ton/blueprint';
import { buildOnchainMetadata } from './utils/jetton-helpers';


export const config = envConfig;

/**
 * Deploy the master contract
 *
 * @param provider - The network provider
 * @returns The deployed master contract
 */
export async function run(provider: NetworkProvider) {
    // deploy
    const masterContract = provider.open(await Attest.fromInit());
    console.log(`Deploying Attest at ${masterContract.address}`);

    // await provider.waitForDeploy(masterContract.address);

    return masterContract;
}
