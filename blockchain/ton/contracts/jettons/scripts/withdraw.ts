import { toNano } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { JettonMaster } from "../build/LaiskyJetton/tact_JettonMaster.ts";
import { JettonWallet } from "../build/LaiskyJetton/tact_JettonWallet.ts";
import { getMasterContract } from './deploy.ts';


export async function run(provider: NetworkProvider) {
    const jettonMaster = await getMasterContract(provider);
    const jettonWallet = provider.open(await JettonWallet.fromInit(
        jettonMaster.address,
        provider.sender().address!!
    ));

    await jettonWallet.send(
        provider.sender(),
        {
            value: toNano(1),
            bounce: false,
        },
        {
            $$type: "Withdraw",
            remain: toNano(0.01),
        }
    )
}
