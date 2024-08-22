import { Address, toNano, beginCell, contractAddress } from '@ton/core';
import { Attest, storeAttestTaskResult } from '../wrappers/Attest';
import { compile, NetworkProvider } from '@ton/blueprint';
import { buildOnchainMetadata } from './utils/jetton-helpers';
import { run as deploy } from "./deploy";
import { myAddress, walletAddress } from './env';

export async function run(provider: NetworkProvider) {
    const walletContract = provider.provider(walletAddress);

    const cell = beginCell().store(
        storeAttestTaskResult({
            $$type: 'AttestTaskResult',
            taskId: BigInt("0"),
            status: 'verified',
            verifiedUrl: 'https://ario.laisky.com/alias/attest-verified.json',
            verifier: null,

        })).asCell();

    const resp = await walletContract.internal(
        provider.sender(),
        {
            value: toNano('0.05'),
            body: cell
        },
    );

    console.log(resp);
}
