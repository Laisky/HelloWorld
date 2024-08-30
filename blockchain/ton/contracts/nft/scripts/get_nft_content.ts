import { toNano, beginCell, Address } from '@ton/core';
import { NftCollection } from '../build/Nft/tact_NftCollection';
import { NetworkProvider } from '@ton/blueprint';


export async function run(provider: NetworkProvider) {
    const collectionContract = provider.sender().address!!

    const masterContract = provider.open(await NftCollection.fromInit(
        collectionContract,
        "https://s3.laisky.com/public/nft/ton-demo/"
    ));

    const result = await masterContract.getGetNftContent(
        BigInt("0"),
        beginCell().storeStringTail("0").endCell()
    )

    console.log(result.toBoc().toString());
    // ��rA2`https://s3.laisky.com/public/nft/ton-demo/0.jsonh��
}
