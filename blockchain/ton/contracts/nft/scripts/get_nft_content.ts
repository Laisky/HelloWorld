import { toNano, beginCell, Address } from '@ton/core';
import { NftCollection } from '../build/Nft/tact_NftCollection';
import { NetworkProvider } from '@ton/blueprint';


export async function run(provider: NetworkProvider) {
    // const collectionContract = provider.sender().address!!
    const collectionContract = Address.parse("kQBbnIwFR35CjnAJro6ZBHolwpgiWtgne_8khS4sqe4qHYyf");

    const masterContract = provider.open(await NftCollection.fromInit(
        collectionContract,
        "https://s3.laisky.com/public/nft/ton-demo/"
    ));

    const result = await masterContract.getGetNftContent(
        BigInt("0"),
        beginCell().storeStringTail("0").endCell()
    )

    console.log(result.asSlice().toString());
}
