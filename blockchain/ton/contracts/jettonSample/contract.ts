import { beginCell, contractAddress, toNano, TonClient4, WalletContractV4, internal, fromNano, Address } from "@ton/ton";
import { Cell } from '@ton/core';

import { FactoryJetton, storeMint, storeLaunchTon, storeLaunchJetton, storeWithdraw, } from "../build/FactoryJetton_FactoryJetton";
import { FactoryJettonWallet, storeTokenBurn, storeTokenTransfer } from "../build/FactoryJetton_FactoryJettonWallet";
import { ChildJetton } from "../build/FactoryJetton_ChildJetton";
import { ChildJettonWallet } from "../build/FactoryJetton_ChildJettonWallet";


import { mnemonicToPrivateKey } from "@ton/crypto";
import { buildOnchainMetadata } from "./utils/onchainContent";

import { printSeparator } from "./utils/print";

import * as dotenv from "dotenv";

dotenv.config();

const mnemonics = (process.env.mnemonics || "").toString();
const workChain = 0;
const client4 = new TonClient4({
    endpoint: "https://sandbox-v4.tonhubapi.com",
    // endpoint: "https://mainnet-v4.tonhubapi.com",
});
const jettonParams = {
    name: "t101",
    description: "t101",
    symbol: "t101",
    decimals: "9",
    image: "https://bscscan.com/assets/bsc/images/svg/logos/token-light.svg?v=24.4.3.0",
    telegram: "https://bscscan.com/assets/bsc/images/svg/logos/token-light.svg?v=24.4.3.0",
    website: "https://telegram.com",
    twitter: "https://bscscan.com/assets/bsc/images/svg/logos/token-light.svg?v=24.4.3.0",

};
const content = buildOnchainMetadata(jettonParams);
const owner = Address.parse("EQBk33XKdYTLTHWyQbD-pVRgcg5AyPv81Z7SMSK28qwzvxGQ ")

type StateInit = {
    code: Cell;
    data: Cell;
}

type P = {
    deployer_address: Address,
    master_address: Address,
    master_init: StateInit,
    jetton_wallet_address: Address,
    jetton_wallet_init: StateInit
    child_address: Address,
    child_wallet_address: Address
    child_init: StateInit
}

type SwapParams = {
    deadline?: bigint;
    recipientAddress?: Address;
    referralAddress?: Address;
    fulfillPayload?: Cell;
    rejectPayload?: Cell;
}

function sleep(ms: number): Promise<void> {
    console.log('waiting for', ms / 1000, 's...');
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getDeployer(needToRequest: Boolean) {
    let keyPair = await mnemonicToPrivateKey(mnemonics.split(" "));
    let secretKey = keyPair.secretKey;
    let deployer = WalletContractV4.create({ workchain: workChain, publicKey: keyPair.publicKey });
    if (needToRequest) {
        let deployer_contract = client4.open(deployer);
        let balance: bigint = await deployer_contract.getBalance();
        let seqno: number = await deployer_contract.getSeqno();
        console.log("Balance = ", fromNano(balance).toString(), "💎TON");
        console.log("Seqno = ", seqno);
        return { deployer_address: deployer.address, secretKey: secretKey, deployer_contract: deployer_contract, balance: balance, seqno: seqno }
    } else {
        return { deployer_address: deployer.address, secretKey: secretKey }
    }
}

async function getP() {
    let deployer_address = (await getDeployer(false)).deployer_address
    let master_init = await FactoryJetton.init(content)
    let master_address = contractAddress(workChain, master_init)
    let jetton_wallet_init = await FactoryJettonWallet.init(deployer_address, master_address)
    let jetton_wallet_address = contractAddress(workChain, jetton_wallet_init)
    let child_init = await ChildJetton.init(owner, master_address, content)
    let child_address = contractAddress(workChain, child_init)
    let child_wallet_init = await ChildJettonWallet.init(deployer_address, child_address)
    let child_wallet_address = contractAddress(workChain, child_wallet_init)
    console.log("deployer_address", deployer_address)
    console.log("master_address:", master_address)
    console.log('jetton_wallet_address: ', jetton_wallet_address)
    console.log("master_init_code_hash:", master_init.code.hash().toString('hex'))
    console.log('jetton_wallet_init_code_hash: ', jetton_wallet_init.code.hash().toString('hex'));
    console.log('child_address: ', child_address);
    console.log('child_wallet_address: ', child_wallet_address);
    return { child_init: child_init, child_address: child_address, child_wallet_address: child_wallet_address, deployer_address: deployer_address, master_address: master_address, master_init: master_init, jetton_wallet_address: jetton_wallet_address, jetton_wallet_init: jetton_wallet_init }
}

async function create(src: P, ton_amount: bigint) {

    let packed_msg_mint = beginCell()
        .store(
            storeMint({
                $$type: "Mint",
                ton_amount: ton_amount
            })
        )
        .endCell();

    let deployer = await getDeployer(true)
    await deployer.deployer_contract!!.sendTransfer({
        seqno: deployer.seqno!!,
        secretKey: deployer.secretKey,
        // sendMode: 0,
        messages: [
            internal({
                to: src.master_address,
                value: ton_amount + toNano("0.3"),
                init: {
                    code: src.master_init.code,
                    data: src.master_init.data,
                },
                body: packed_msg_mint,
            }),
        ],
    });
    console.log("Mint with", fromNano(ton_amount).toString(), "💎TON");
}

async function mint(src: P, ton_amount: bigint) {

    let packed_msg_mint = beginCell()
        .store(
            storeMint({
                $$type: "Mint",
                ton_amount: ton_amount
            })
        )
        .endCell();

    let deployer = await getDeployer(true)
    await deployer.deployer_contract!!.sendTransfer({
        seqno: deployer.seqno!!,
        secretKey: deployer.secretKey,
        // sendMode: 0,
        messages: [
            internal({
                to: src.master_address,
                value: ton_amount + toNano("0.1"),
                // init: {
                //     code: src.master_init.code,
                //     data: src.master_init.data,
                // },
                body: packed_msg_mint,
            }),
        ],
    });
    console.log("Mint with", fromNano(ton_amount).toString(), "💎TON");
}

async function transferJetton(src: P, to: Address, amount: bigint) {
    let deployer = await getDeployer(true)
    let msg_TokenTransfer = beginCell()
        .store(
            storeTokenTransfer({
                $$type: 'TokenTransfer',
                query_id: 0n,
                amount: amount,
                destination: to,
                response_destination: src.deployer_address,
                custom_payload: null,
                forward_amount: toNano("0"),
                forward_payload: beginCell().storeBit(false).endCell()
            })
        )
        .endCell();

    await deployer.deployer_contract!!.sendTransfer({
        seqno: deployer.seqno!!,
        secretKey: deployer.secretKey,
        // sendMode: 0,
        messages: [
            internal({
                to: src.child_wallet_address,
                value: toNano("0.2"),
                body: msg_TokenTransfer
            }),
        ],
    });
}

async function readStatus(owner: Address, factory_master_address: Address) {
    // let jetton_wallet_init = await FactoryJettonWallet.init(owner, master)
    // let jetton_wallet_address = contractAddress(workChain, jetton_wallet_init)
    // let jetton_wallet = FactoryJettonWallet.fromAddress(jetton_wallet_address);
    // let jetton_wallet_contract = client4.open(jetton_wallet);
    // let g_jetton_wallet = (await jetton_wallet_contract.getGetG());

    let factory_master = FactoryJetton.fromAddress(factory_master_address);
    let jetton_master_contract = client4.open(factory_master);
    let g_jetton_master = (await jetton_master_contract.getGetG());
    let content_jetton_master = (await jetton_master_contract.getGetJettonData());
    let content = content_jetton_master.content;
    let child_init = await ChildJetton.init(owner, factory_master_address, content)
    let child_master_address = contractAddress(workChain, child_init)

    const block = await client4.getLastBlock()
    const account = await client4.getAccount(block.last.seqno, child_master_address)
    const state = account.account.state
    if (state.type == "active") {
        console.log("can claim")
    }


    // let res = readOnchainMetadata(content_jetton_master.content, ["name","image","description"])

    // console.log("jetton wallet: balance: ",g_jetton_wallet.balance)
    // console.log("jetton wallet: transferable: ", g_jetton_wallet.transferable)
    // console.log("jetton master: mintable: ", g_jetton_master.mintable)
    console.log("jetton master: finish_jetton: ", g_jetton_master.finish_jetton)
    console.log("jetton master: finish_ton: ", g_jetton_master.finish_ton)
    // console.log("jetton master: content: ", res)
    printSeparator()
}


(async () => {

    let p: P = await getP()
    // let p: P = await getPFromRemote(Address.parse("kQDkDetIkzU2VOwdhs2IHjTEUz0jxTII-yf4-8HbknxjaFig"))
    await create(p, 0n)
    await sleep(25000)

    await mint(p, toNano('0.1'))
    // await readStatus(p.deployer_address, Address.parse("kQCkD0y5x8yOpdEd0c2xJtbsK3Do85CNFJV_cKDEROjf4_p8"))
})();
