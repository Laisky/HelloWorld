import { toNano } from '@ton/core';
import { Attest } from '../build/Attest/tact_Attest';
import { Oracle } from '../build/Attest/tact_Oracle';
import { NetworkProvider } from '@ton/blueprint';


export async function run(provider: NetworkProvider) {
    const masterContract = provider.open(await Attest.fromInit());
    const oracleContract = provider.open(await Oracle.fromInit(
        masterContract.address,
        provider.sender().address!!
    ));

    await oracleContract.send(
        provider.sender(),
        {
            value: toNano('0.1'),
            bounce: true
        },
        {
            $$type: 'AttestTaskResult',
            taskId: BigInt("0"),
            status: "verified",
            verifiedUrl: "https://ario.laisky.com/alias/attest-verified.json",
            botOwner: provider.sender().address!!,
            oracleOwner: provider.sender().address!!
        }
    );
}
