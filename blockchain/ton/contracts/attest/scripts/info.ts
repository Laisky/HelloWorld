import { Address, toNano, beginCell, contractAddress } from '@ton/core';
import { Attest } from '../wrappers/Attest';
import { compile, NetworkProvider } from '@ton/blueprint';
import { buildOnchainMetadata } from './utils/jetton-helpers';
import { run as deploy } from "./deploy";
import { myAddress } from './env';

export async function run(provider: NetworkProvider) {
    const walletContract = provider.provider(Address.parse("kQBKSD7eVlItjEE3Z40EOZCznB6L6ydk-RHdWmmBirqTlk1-"));

    const results = await Promise.all([
        walletContract.get("owner", []),
        walletContract.get("master", []),
        walletContract.get("manifest_url", [])
    ]);

    console.log("owner: " + results[0].stack.readAddress().toString());
    console.log("master: " + results[1].stack.readString());
    console.log("manifest_url: " + results[2].stack.readString());
    // Connected to wallet at address: EQARnduCSjymI91urfHE_jXlnTHrmr0e4yaPubtPQkgy53uU
    // owner: EQARnduCSjymI91urfHE_jXlnTHrmr0e4yaPubtPQkgy53uU
    // master: EQBDGlPIad57tnN1H3P-KFKVuVzlXlmqV88ne72FHiFhu0Ot
    // manifest_url: https://ario.laisky.com/alias/attest-manifest.json
}
