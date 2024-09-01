import { toNano, beginCell, Address } from '@ton/core';
import { NftCollection, loadGetNftData } from '../build/Nft/tact_NftCollection';
import { NftItem } from '../build/Nft/tact_NftItem';
import { NetworkProvider } from '@ton/blueprint';

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
// individualContent: https://s3.laisky.com/public/nft/ton-demo/0.json
// getGetNftContent: https://s3.laisky.com/public/nft/ton-demo/0.json


export async function run(provider: NetworkProvider) {
    // show demo nft info
    console.log("// -------------------------------------");
    console.log("// demo nft contract");
    console.log("// -------------------------------------");
    await showNftInfo(provider,
        "kQBbnIwFR35CjnAJro6ZBHolwpgiWtgne_8khS4sqe4qHYyf",
        "kQB0hPpfiU9lchOrt1ML3wrKPxKEdS2Wnq3pCQ5G0Tk98kyT"
    );

    // show my nft contract
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

    await showNftInfo(provider,
        masterContract.address.toString(),
        itemContract.address.toString()
    );


    // get nft item's data
    // console.log(">>> get nft item data");
    // const nftItemData = await itemContract.getGetNftData();
    // console.log(`init: ${nftItemData.init}`);
    // console.log(`owner: ${nftItemData.ownerAddress.toString()}`);
    // console.log(`collectionAddress: ${nftItemData.collectionAddress.toString()}`);
    // console.log(`index: ${nftItemData.index}`);
    // console.log(`individualContent: ${nftItemData.individualContent.asSlice().loadStringTail()}`);

    // // get nft collection data
    // console.log(">>> get nft collection data");
    // const nftCollectionData = await masterContract.getGetCollectionData();
    // console.log(`collectionContent: ${nftCollectionData.collectionContent.asSlice().loadStringTail()}`);

    // // get nft metadata
    // const result = await masterContract.getGetNftContent(
    //     BigInt("0"),
    //     beginCell().storeStringTail("0.json").endCell()
    // )
    // console.log(`getGetNftContent: ${result.asSlice().loadStringTail()}`);
}

/**
 * show demo nft info
 */
async function showNftInfo(provider: NetworkProvider, collectionAddr: string, itemAddr: string) {
    const demoNftCollectionContract = provider.provider(Address.parse(collectionAddr));
    const demoNftItemContract = provider.provider(Address.parse(itemAddr));

    // get nft item info
    console.log(">>> item.get_nft_data");
    const demoNftItemData = await demoNftItemContract.get("get_nft_data", []);
    console.log(`init: ${demoNftItemData.stack.readBoolean()}`);
    console.log(`index: ${demoNftItemData.stack.readBigNumber()}`);
    console.log(`collectionAddress: ${demoNftItemData.stack.readAddress().toString()}`);
    console.log(`owner: ${demoNftItemData.stack.readAddress().toString()}`);
    console.log(`individualContent: ${demoNftItemData.stack.readCell().asSlice().loadStringTail()}`);

    // collection.get_collection_data
    console.log(">>> collection.get_collection_data");
    const demoNftCollectionData = await demoNftCollectionContract.get("get_collection_data", []);
    console.log(`nextItemIndex: ${demoNftCollectionData.stack.readBigNumber()}`);
    console.log(`collectionContent: ${demoNftCollectionData.stack.readCell().asSlice().loadStringTail()}`);
    console.log(`ownerAddress: ${demoNftCollectionData.stack.readAddress().toString()}`);

    // collection.get_nft_address_by_index
    console.log(">>> collection.get_nft_address_by_index");
    const nftAddr = await demoNftCollectionContract.get("get_nft_address_by_index", [
        {
            "type": "int",
            "value": BigInt("0")
        }
    ]);
    console.log(`nft item address: ${nftAddr.stack.readAddress().toString()}`);

    // collection.get_nft_content
    console.log(">>> collection.get_nft_content");
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
