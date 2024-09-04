import { toNano } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { JettonMaster } from "../build/LaiskyJetton/tact_JettonMaster.ts";


export async function getMasterContract(provider: NetworkProvider) {
    return provider.open(await JettonMaster.fromInit(
        provider.sender().address!!,
        "https://s3.laisky.com/public/nft/ton-jetton/laisky-v2.json",
    ));
}
