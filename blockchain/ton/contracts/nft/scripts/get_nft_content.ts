import { toNano, beginCell, Address } from '@ton/core';
import { NftCollection, loadGetNftData } from '../build/Nft/tact_NftCollection';
import { NftItem } from '../build/Nft/tact_NftItem';
import { NetworkProvider } from '@ton/blueprint';

// Using file: get_nft_content
// Connected to wallet at address: EQARnduCSjymI91urfHE_jXlnTHrmr0e4yaPubtPQkgy53uU
// // -------------------------------------
// // demo nft contract
// // -------------------------------------
// >>> get nft item data
// init: true
// index: 0
// collectionAddress: EQBbnIwFR35CjnAJro6ZBHolwpgiWtgne_8khS4sqe4qHTcV
// owner: EQBhL7yMz-RKyy_39mlH9gYeIg7p3JAwdYtHWXNCE51pKchR
// individualContent: https://raw.githubusercontent.com/Superpevel/univer_project/master/item.json
// >>> get nft collection data
// nextItemIndex: 3
// collectionContent: https://raw.githubusercontent.com/Superpevel/univer_project/master/main.json
// ownerAddress: EQBhL7yMz-RKyy_39mlH9gYeIg7p3JAwdYtHWXNCE51pKchR
// get_nft_content: 0.json
// // -------------------------------------
// // my nft contract
// // -------------------------------------
// >>> get nft collection data
// collectionContent: https://s3.laisky.com/public/nft/ton-demo/collection.json
// >>> get nft item data
// individualContent: 0.json
// getGetNftContent: https://s3.laisky.com/public/nft/ton-demo/0.json


export async function run(provider: NetworkProvider) {
    await showDemoNftInfo(provider);

    // my nft contract
    console.log("// -------------------------------------");
    console.log("// my nft contract");
    console.log("// -------------------------------------");

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
    console.log(">>> get nft collection data");
    const nftCollectionData = await masterContract.getGetCollectionData();
    console.log(`collectionContent: ${nftCollectionData.collectionContent.asSlice().loadStringTail()}`);
    // https://s3.laisky.com/public/nft/ton-demo/collection.json

    // get nft item's data
    console.log(">>> get nft item data");
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

/**
 * show demo nft info
 */
async function showDemoNftInfo(provider: NetworkProvider) {
    console.log("// -------------------------------------");
    console.log("// demo nft contract");
    console.log("// -------------------------------------");

    const demoNftCollectionContract = provider.provider(Address.parse("kQBbnIwFR35CjnAJro6ZBHolwpgiWtgne_8khS4sqe4qHYyf"))
    const demoNftItemContract = provider.provider(Address.parse("kQB0hPpfiU9lchOrt1ML3wrKPxKEdS2Wnq3pCQ5G0Tk98kyT"))

    // get nft item info
    console.log(">>> get nft item data");
    const demoNftItemData = await demoNftItemContract.get("get_nft_data", []);
    console.log(`init: ${demoNftItemData.stack.readBoolean()}`);
    console.log(`index: ${demoNftItemData.stack.readBigNumber()}`);
    console.log(`collectionAddress: ${demoNftItemData.stack.readAddress().toString()}`);
    console.log(`owner: ${demoNftItemData.stack.readAddress().toString()}`);
    console.log(`individualContent: ${demoNftItemData.stack.readCell().asSlice().loadStringTail()}`);

    // get nft collection data
    console.log(">>> get nft collection data");
    const demoNftCollectionData = await demoNftCollectionContract.get("get_collection_data", []);
    console.log(`nextItemIndex: ${demoNftCollectionData.stack.readBigNumber()}`);
    console.log(`collectionContent: ${demoNftCollectionData.stack.readCell().asSlice().loadStringTail()}`);
    console.log(`ownerAddress: ${demoNftCollectionData.stack.readAddress().toString()}`);

    // get nft metadata
    const nftMedata = await demoNftCollectionContract.get("get_nft_content", [
        {
            "type": "int",
            "value": BigInt("0")
        },
        {
            "type": "cell",
            "cell": beginCell().storeStringTail("0.json").endCell()
        }
    ]);
    console.log(`get_nft_content: ${nftMedata.stack.readCell().asSlice().loadStringTail()}`);
}
