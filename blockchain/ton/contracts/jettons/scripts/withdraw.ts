import { toNano } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { JettonMaster } from "../build/LaiskyJetton/tact_JettonMaster.ts";
import { JettonWallet } from "../build/LaiskyJetton/tact_JettonWallet.ts";



export async function run(provider: NetworkProvider) {
    const jettonMaster = provider.open(await JettonMaster.fromInit(
        provider.sender().address!!,
        "https://s3.laisky.com/public/nft/ton-jetton/demo.json",
    ));
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
            amount: BigInt("100000000"),
        }
    )
}
