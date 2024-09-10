import { toNano } from '@ton/core';
import { Attest } from '../build/Attest/tact_Attest';
import { Oracle } from '../build/Attest/tact_Oracle';
import { NetworkProvider } from '@ton/blueprint';


export async function run(provider: NetworkProvider) {
    const masterContract = provider.open(await Attest.fromInit())
    const oracleContract = provider.open(await Oracle.fromInit(
        masterContract.address,
        provider.sender().address!!
    ));

    await oracleContract.send(
        provider.sender(),
        {
            value: toNano('1'),
        },
        'gather_incentive'
    );

    await oracleContract.send(
        provider.sender(),
        {
            value: toNano('1'),
        },
        'withdraw'
    );
}
