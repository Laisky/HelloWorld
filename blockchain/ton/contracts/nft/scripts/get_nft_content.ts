import { toNano, beginCell, Address } from '@ton/core';
import { NftCollection } from '../build/Nft/tact_NftCollection';
import { NftItem } from '../build/Nft/tact_NftItem';
import { NetworkProvider } from '@ton/blueprint';


export async function run(provider: NetworkProvider) {
    const myAddr = provider.sender().address!!

    const masterContract = provider.open(await NftCollection.fromInit(
        myAddr,
        "https://s3.laisky.com/public/nft/ton-demo/"
    ));
    const itemContract = provider.open(await NftItem.fromInit(
        masterContract.address,
        BigInt("0")
    ));

    // get nft collection data
    const nftCollectionData = await masterContract.getGetCollectionData();
    console.log(`collectionContent: ${nftCollectionData.collectionContent.asSlice().loadStringTail()}`);
    // https://s3.laisky.com/public/nft/ton-demo/collection.json

    // get nft item's data
    const nftItemData = await itemContract.getGetNftData();
    console.log(`individualContent: ${nftItemData.individualContent.asSlice().loadStringTail()}`);
    // 0.json

    // get nft metadata
    const result = await masterContract.getGetNftContent(
        BigInt("0"),
        beginCell().storeStringTail("0.json").endCell()
    )
    console.log(`getGetNftContent: ${result.asSlice().loadStringTail()}`);
    // https://s3.laisky.com/public/nft/ton-demo/0.json
}
