import { toNano } from '@ton/core';
import { NftCollection } from '../build/Nft/tact_NftCollection';
import { NftItem } from '../build/Nft/tact_NftItem';
import { NetworkProvider } from '@ton/blueprint';


export async function run(provider: NetworkProvider) {
    const masterContract = provider.open(await NftCollection.fromInit(
        provider.sender().address!!,
        "https://s3.laisky.com/uploads/2024/09/collection.json",
        "https://s3.laisky.com/public/nft/ton-demo/",
        null
    ));
    const itemContract = provider.open(await NftItem.fromInit(
        masterContract.address,
        BigInt("0")
    ));

    // register
    await itemContract.send(
        provider.sender(),
        {
            value: toNano('1'),
        },
        {
            $$type: 'Transfer',
            queryId: BigInt("0"),
            newOwner: provider.sender().address!!,
            responseDestination: provider.sender().address!!,
            customPayload: null,
            forwardAmount: toNano('0.5'),
            forwardPayload: null,
        },
    );
}
