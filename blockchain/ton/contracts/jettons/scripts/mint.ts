import { toNano } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { JettonMaster } from "../build/LaiskyJetton/tact_JettonMaster.ts";
import { getMasterContract } from './deploy.ts';


export async function run(provider: NetworkProvider) {
    const laiskyJetton = await getMasterContract(provider);

    await laiskyJetton.send(
        provider.sender(),
        {
            value: toNano(1),
            bounce: false,
        },
        {
            $$type: "Mint",
            amount: toNano("1"),
            receiver: provider.sender().address!!,
            forwardTonAmount: toNano("0.5"),
        }
    )
}
