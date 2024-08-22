import { Address, toNano, beginCell, contractAddress } from '@ton/core';
import { Attest } from '../wrappers/Attest';
import { compile, NetworkProvider } from '@ton/blueprint';
import { buildOnchainMetadata } from './utils/jetton-helpers';
import { run as deploy } from "./deploy";
import { myAddress } from './env';

export async function run(provider: NetworkProvider) {
    // const ui = provider.ui();
    // const receiver = Address.parse(await ui.input('receiver\'s address'));

    const contract = await deploy(provider);

    // register
    await contract.send(
        provider.sender(),
        {
            value: toNano('0.1'),
        },
        {
            $$type: 'SubmitAttestTask',
            proofUrl: "https://ario.laisky.com/alias/attest-proof.json",
            attestValue: toNano("0.05"),
            taskId: null,
            status: null,
            walletAddress: null
        },
    )
}
