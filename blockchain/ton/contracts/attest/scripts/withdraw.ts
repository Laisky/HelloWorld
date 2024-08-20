import { Address, toNano, beginCell, contractAddress } from '@ton/core';
import { Attest, WalletWithdraw, storeWalletWithdraw } from '../wrappers/Attest';
import { compile, NetworkProvider } from '@ton/blueprint';
import { buildOnchainMetadata } from './utils/jetton-helpers';
import { run as deploy } from "./deploy";
import { myAddress, walletAddress } from './env';

export async function run(provider: NetworkProvider) {
    // const ui = provider.ui();
    // const receiver = Address.parse(await ui.input('receiver\'s address'));

    // const masterContract = await deploy(provider);

    const walletContract = provider.provider(walletAddress);

    const cell = beginCell().store(
        storeWalletWithdraw({
            $$type: 'WalletWithdraw',
        })).asCell();

    await walletContract.internal(
        provider.sender(),
        {
            value: toNano('0.05'),
            body: cell
        },
    );
}
