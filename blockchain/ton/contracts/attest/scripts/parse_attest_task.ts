import { Cell } from '@ton/core';
import { Bot } from '../build/Attest/tact_Bot';
import { Attest, loadPublishAttestTask } from '../build/Attest/tact_Attest';
import { NetworkProvider } from '@ton/blueprint';
import { myAddress } from './env';

export async function run(provider: NetworkProvider) {
    const rawBody = "b5ee9c7201010301008c00029b30d0c7a00000000000000000800233bb70494794c47badd5be389fc6bcb3a63d7357a3dc64d1f73769e849065ce0000000000000000000000000000000000000000000000000000000002faf08080102000e70656e64696e67005e68747470733a2f2f6172696f2e6c6169736b792e636f6d2f616c6961732f6174746573742d70726f6f662e6a736f6e";

    const cells = Cell.fromBoc(Buffer.from(rawBody, 'hex'));
    const msg = loadPublishAttestTask(cells[0].asSlice());

    console.log(`taskId: ${msg.taskId}`);
    console.log(`status: ${msg.status}`);
    console.log(`botOwner: ${msg.botOwner}`);
    console.log(`proofUrl: ${msg.proofUrl}`);
    console.log(`attestValue: ${msg.attestValue}`);

    // taskId: 0
    // status: pending
    // botOwner: EQARnduCSjymI91urfHE_jXlnTHrmr0e4yaPubtPQkgy53uU
    // proofUrl: https://ario.laisky.com/alias/attest-proof.json
    // attestValue: 50000000
}
