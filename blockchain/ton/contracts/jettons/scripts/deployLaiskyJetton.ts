import { Address, toNano, beginCell } from '@ton/core';
import { LaiskyJetton, Mint } from '../wrappers/LaiskyJetton';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    let myAddress = Address.parse('0QARnduCSjymI91urfHE_jXlnTHrmr0e4yaPubtPQkgy553b')

    const laiskyJetton = provider.open(await LaiskyJetton.fromInit(
        myAddress,
        beginCell().storeUint(666, 10).endCell(),
        toNano(1000)
    ));

    await laiskyJetton.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Mint',
            amount: toNano('50'),
            receiver: myAddress,
        }
    );

    await provider.waitForDeploy(laiskyJetton.address);

    // run methods on `laiskyJetton`
}
