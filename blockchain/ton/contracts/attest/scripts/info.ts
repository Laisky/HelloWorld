import { Address, toNano, beginCell, contractAddress, TupleItemInt } from '@ton/core';
import { Attest } from '../wrappers/Attest';
import { compile, NetworkProvider } from '@ton/blueprint';
import { buildOnchainMetadata } from './utils/jetton-helpers';
import { run as deploy } from "./deploy";
import { myAddress, walletAddress } from './env';

export async function run(provider: NetworkProvider) {
    const walletContract = provider.provider(walletAddress);

    const results = await Promise.all([
        walletContract.get("owner", []),
        walletContract.get("master", []),
        walletContract.get("manifestUrl", []),
        walletContract.get("taskIncentives", [{
            type: 'int',
            value: BigInt("0")
        }])
    ]);

    console.log("owner: " + results[0].stack.readAddress().toString());
    console.log("master: " + results[1].stack.readString());
    console.log("manifestUrl: " + results[2].stack.readString());
    console.log("taskIncentives: " + results[3].stack.readBigNumber().toString());
    // Connected to wallet at address: EQARnduCSjymI91urfHE_jXlnTHrmr0e4yaPubtPQkgy53uU
    // owner: EQARnduCSjymI91urfHE_jXlnTHrmr0e4yaPubtPQkgy53uU
    // master: EQAy0ypquid9Q7xl893t4bLGGw7BULOEiYOJmWVzkgnjZ62e
    // manifestUrl: https://ario.laisky.com/alias/attest-manifest.json
    // taskIncentives: 0
}
