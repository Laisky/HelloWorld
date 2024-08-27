import { Address, toNano, beginCell, contractAddress } from '@ton/core';
import { compile, NetworkProvider } from '@ton/blueprint';
import { run as deploy } from "./deploy";
import { myAddress } from './env';

export async function run(provider: NetworkProvider) {
    const masterContract = await deploy(provider);


    // register
    await masterContract.send(
        provider.sender(),
        {
            value: toNano('0.1'),
            bounce: false
        },
        {
            $$type: "RegisterOracle",
            pledgeValue: toNano("0.05"),
            oracleOwner: myAddress
        }
    )
}
