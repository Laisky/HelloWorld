import { Address, toNano, beginCell, contractAddress, Cell } from '@ton/core';
import { Attest, loadWalletManifestChangedEvent } from '../wrappers/Attest';
import { compile, NetworkProvider } from '@ton/blueprint';
import { buildOnchainMetadata } from './utils/jetton-helpers';
import { run as deploy } from "./deploy";
import { myAddress } from './env';
import axios from 'axios';


export const fetchAndParseTrace = async function (txId: string) {
    const url = `https://testnet.tonapi.io/v2/traces/${txId}`;
    const response = await axios.get(url);
    const data = response.data;

    // Access the desired field in the JSON response
    const lastChild = data.children[data.children.length - 1];
    const lastGrandChild = lastChild.children[lastChild.children.length - 1];
    const lastTransaction = lastGrandChild.transaction;
    const lastOutMsg = lastTransaction.out_msgs[lastTransaction.out_msgs.length - 1];
    const rawBody = lastOutMsg.raw_body;

    const cells = Cell.fromBoc(Buffer.from(rawBody, 'hex'));
    return cells[0].asSlice();
}

export async function run(provider: NetworkProvider) {
    const msg = loadWalletManifestChangedEvent(await fetchAndParseTrace('db96ca304b4126371b15db4ba4f64f8e7bcbffec8581c019abafc16b2eae9733'));

    console.log(`oldManifestUrl: ${msg.oldManifestUrl}`);
    console.log(`newManifestUrl: ${msg.newManifestUrl}`);
}
