import { Address, toNano, beginCell, contractAddress, Cell } from '@ton/core';
import { Attest, loadWalletManifestChangedEvent } from '../wrappers/Attest';
import { compile, NetworkProvider } from '@ton/blueprint';
import { buildOnchainMetadata } from './utils/jetton-helpers';
import { run as deploy } from "./deploy";
import { myAddress } from './env';

export async function run(provider: NetworkProvider) {
    // get emitted log from trace:
    //   curl -s https://testnet.tonapi.io/v2/traces/db96ca304b4126371b15db4ba4f64f8e7bcbffec8581c019abafc16b2eae9733 | jq '.children[-1].children[-1].transaction.out_msgs[-1].raw_body'
    const hexmsg = 'b5ee9c7201010301003e000208ae59284b01020000006468747470733a2f2f6172696f2e6c6169736b792e636f6d2f616c6961732f6174746573742d6d616e69666573742e6a736f6e';

    const cells = Cell.fromBoc(Buffer.from(hexmsg, 'hex'));
    const msg = loadWalletManifestChangedEvent(cells[0].asSlice());

    console.log(`oldManifestUrl: ${msg.oldManifestUrl}`);
    console.log(`newManifestUrl: ${msg.newManifestUrl}`);
}
