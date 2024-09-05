import { toNano } from '@ton/core';
import { NftCollection } from '../build/Nft/tact_NftCollection';
import { NetworkProvider } from '@ton/blueprint';


export async function run(provider: NetworkProvider) {
    const masterContract = provider.open(await NftCollection.fromInit(
        provider.sender().address!!,
        "https://s3.laisky.com/public/nft/ton-demo/",
        null
    ));

    // register
    await masterContract.send(
        provider.sender(),
        {
            value: toNano('1'),
        },
        {
            $$type: 'Mint',
            newOwner: provider.sender().address!!,
        },
    );
}
