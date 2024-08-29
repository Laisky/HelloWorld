import { Address, toNano, beginCell, contractAddress, SenderArguments } from '@ton/core';
import { Bot } from '../build/Attest/tact_Bot';
import { Attest } from '../build/Attest/tact_Attest';
import { Oracle } from '../build/Attest/tact_Oracle';
import { NetworkProvider } from '@ton/blueprint';
import { run as deploy } from "./deploy";
import { myAddress } from './env';

export async function run(provider: NetworkProvider) {
    const masterContract = await deploy(provider);

    const oracleContract = provider.open(await Oracle.fromInit(
        masterContract.address,
        myAddress
    ));

    await oracleContract.send(
        provider.sender(),
        {
            value: toNano('0.1'),
            bounce: true
        },
        {
            $$type: 'AttestTaskResult',
            taskId: BigInt("99"),
            status: "verified",
            verifiedUrl: "https://ario.laisky.com/alias/attest-verified.json",
            botOwner: myAddress,
            oracleOwner: myAddress
        }
    );
}
