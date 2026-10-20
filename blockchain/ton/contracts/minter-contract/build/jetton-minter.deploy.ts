// Pure build/test helpers adapted from ton-blockchain/minter-contract (MIT),
// commit 074b7d5f45f43552146fdf54f972020b2757bc18, build/jetton-minter.deploy.ts.
// The upstream example owner, deployment entrypoints and network callback are
// intentionally outside this offline module.
import { Cell, beginCell, Address, beginDict, Slice } from "ton";
import walletHex from "./jetton-wallet.compiled.json";
import minterHex from "./jetton-minter.compiled.json";
import { Sha256 } from "@aws-crypto/sha256-js";
import BN from "bn.js";
export const JETTON_WALLET_CODE = Cell.fromBoc(walletHex.hex)[0];
export const JETTON_MINTER_CODE = Cell.fromBoc(minterHex.hex)[0];
const ONCHAIN_CONTENT_PREFIX = 0x00;
const SNAKE_PREFIX = 0x00;

export type JettonMetaDataKeys = "name" | "description" | "image" | "symbol";

const jettonOnChainMetadataSpec: {
  [key in JettonMetaDataKeys]: "utf8" | "ascii" | undefined;
} = {
  name: "utf8",
  description: "utf8",
  image: "ascii",
  symbol: "utf8",
};

const sha256 = (str: string) => {
  const sha = new Sha256();
  sha.update(str);
  return Buffer.from(sha.digestSync());
};

export function buildTokenMetadataCell(data: { [s: string]: string | undefined }): Cell {
  const KEYLEN = 256;
  const dict = beginDict(KEYLEN);

  Object.entries(data).forEach(([k, v]: [string, string | undefined]) => {
    if (!jettonOnChainMetadataSpec[k as JettonMetaDataKeys])
      throw new Error(`Unsupported onchain key: ${k}`);
    if (v === undefined || v === "") return;

    let bufferToStore = Buffer.from(v, jettonOnChainMetadataSpec[k as JettonMetaDataKeys]);

    const CELL_MAX_SIZE_BYTES = Math.floor((1023 - 8) / 8);

    const rootCell = new Cell();
    rootCell.bits.writeUint8(SNAKE_PREFIX);
    let currentCell = rootCell;

    while (bufferToStore.length > 0) {
      currentCell.bits.writeBuffer(bufferToStore.slice(0, CELL_MAX_SIZE_BYTES));
      bufferToStore = bufferToStore.slice(CELL_MAX_SIZE_BYTES);
      if (bufferToStore.length > 0) {
        const newCell = new Cell();
        currentCell.refs.push(newCell);
        currentCell = newCell;
      }
    }

    dict.storeRef(sha256(k), rootCell);
  });

  return beginCell().storeInt(ONCHAIN_CONTENT_PREFIX, 8).storeDict(dict.endDict()).endCell();
}

export function parseTokenMetadataCell(contentCell: Cell): {
  [s in JettonMetaDataKeys]?: string;
} {
  // Note that this relies on what is (perhaps) an internal implementation detail:
  // "ton" library dict parser converts: key (provided as buffer) => BN(base10)
  // and upon parsing, it reads it back to a BN(base10)
  // tl;dr if we want to read the map back to a JSON with string keys, we have to convert BN(10) back to hex
  const toKey = (str: string) => new BN(str, "hex").toString(10);

  const KEYLEN = 256;
  const contentSlice = contentCell.beginParse();
  if (contentSlice.readUint(8).toNumber() !== ONCHAIN_CONTENT_PREFIX)
    throw new Error("Expected onchain content marker");

  const dict = contentSlice.readDict(KEYLEN, (s) => {
    const buffer = Buffer.from("");

    const sliceToVal = (s: Slice, v: Buffer, isFirst: boolean) => {
      s.toCell().beginParse();
      if (isFirst && s.readUint(8).toNumber() !== SNAKE_PREFIX)
        throw new Error("Only snake format is supported");

      v = Buffer.concat([v, s.readRemainingBytes()]);
      if (s.remainingRefs === 1) {
        v = sliceToVal(s.readRef(), v, false);
      }

      return v;
    };

    return sliceToVal(s.readRef(), buffer, true);
  });

  const res: { [s in JettonMetaDataKeys]?: string } = {};

  Object.keys(jettonOnChainMetadataSpec).forEach((k) => {
    const val = dict
      .get(toKey(sha256(k).toString("hex")))
      ?.toString(jettonOnChainMetadataSpec[k as JettonMetaDataKeys]);
    if (val) res[k as JettonMetaDataKeys] = val;
  });

  return res;
}

export function jettonMinterInitData(
  owner: Address,
  metadata: { [s in JettonMetaDataKeys]?: string }
): Cell {
  return beginCell()
    .storeCoins(0)
    .storeAddress(owner)
    .storeRef(buildTokenMetadataCell(metadata))
    .storeRef(JETTON_WALLET_CODE)
    .endCell();
}
