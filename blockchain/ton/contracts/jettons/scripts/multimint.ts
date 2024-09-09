import { toNano, Dictionary } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { MultiMintReceiver } from "../build/LaiskyJetton/tact_JettonMaster.ts";
import { getMasterContract } from './deploy.ts';


export async function run(provider: NetworkProvider) {
    const masterContract = await getMasterContract(provider);

    let receivers = Dictionary.empty<number, MultiMintReceiver>();
    receivers.set(0, {
        $$type: "MultiMintReceiver",
        address: provider.sender().address!!,
        amount: toNano("1"),
        tonAmount: toNano("0.1"),
    });
    receivers.set(1, {
        $$type: "MultiMintReceiver",
        address: provider.sender().address!!,
        amount: toNano("3"),
        tonAmount: toNano("0.1"),
    });
    receivers.set(2, {
        $$type: "MultiMintReceiver",
        address: provider.sender().address!!,
        amount: toNano("5"),
        tonAmount: toNano("0.1"),
    });

    await masterContract.send(
        provider.sender(),
        {
            value: toNano(1),
            bounce: false,
        },
        {
            $$type: "MultiMint",
            receiverCount: BigInt("3"),
            receivers: receivers,
        }
    )
}
