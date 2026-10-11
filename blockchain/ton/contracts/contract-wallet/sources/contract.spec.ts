import { Address, beginCell, toNano } from "ton-core";
import { keyPairFromSeed, sign } from "ton-crypto";
import { ContractSystem } from "@tact-lang/emulator";
import { Wallet } from "./output/sample_Wallet";

// Fixed public fixture, used only inside the emulator.
const keys = keyPairFromSeed(Buffer.alloc(32, 7));
const publicKey = BigInt("0x" + keys.publicKey.toString("hex"));
const walletId = 42n;

async function setup() {
    const system = await ContractSystem.create({ now: 1700000000 });
    const owner = system.treasure("owner");
    const contract = system.open(await Wallet.fromInit(publicKey, walletId));
    await contract.send(owner, { value: toNano("1") }, beginCell().endCell().beginParse());
    await system.run();
    return { system, owner, contract };
}

function signedOperation(seqno: number, recipient: Address, valid = true) {
    const operation = beginCell()
        .storeInt(1700000060, 32)
        .storeInt(seqno, 32)
        .storeInt(walletId, 64)
        .storeUint(2, 8)
        .storeAddress(recipient)
        .endCell();
    const signature = valid ? sign(operation.hash(), keys.secretKey) : Buffer.alloc(64);
    return { $$type: "WalletOperation" as const, signature, operation };
}

describe("actual Wallet contract", () => {
    it("deploys with the supplied identity and empty allowances", async () => {
        const { contract } = await setup();
        expect(await contract.getPublicKey()).toBe(publicKey);
        expect(await contract.getWalletId()).toBe(walletId);
        expect(await contract.getSeqno()).toBe(0n);
        expect((await contract.getAllowances()).size).toBe(0);
    });

    it("accepts a signed allowance operation and rejects its replay", async () => {
        const { system, owner, contract } = await setup();
        await contract.send(owner, { value: toNano("0.1") }, signedOperation(0, owner.address));
        await system.run();
        expect(await contract.getSeqno()).toBe(1n);
        expect((await contract.getAllowances()).get(owner.address)).toBe(true);
        await contract.send(owner, { value: toNano("0.1") }, signedOperation(0, owner.address));
        await system.run();
        expect(await contract.getSeqno()).toBe(1n);
    });

    it("rejects invalid signatures without advancing sequence or granting permission", async () => {
        const { system, owner, contract } = await setup();
        await contract.send(owner, { value: toNano("0.1") }, signedOperation(0, owner.address, false));
        await system.run();
        expect(await contract.getSeqno()).toBe(0n);
        expect((await contract.getAllowances()).get(owner.address)).toBeUndefined();
    });
});
