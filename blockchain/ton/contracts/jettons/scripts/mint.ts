import { toNano } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { JettonMaster } from "../build/LaiskyJetton/tact_JettonMaster.ts";



export async function run(provider: NetworkProvider) {
    const laiskyJetton = provider.open(await JettonMaster.fromInit(
        provider.sender().address!!,
        "https://s3.laisky.com/public/nft/ton-jetton/demo.json",
    ));

    await laiskyJetton.send(
        provider.sender(),
        {
            value: toNano(0.1),
            bounce: false,
        },
        {
            $$type: "Mint",
            amount: BigInt("10"),
            receiver: provider.sender().address!!,
        }
    )
}
