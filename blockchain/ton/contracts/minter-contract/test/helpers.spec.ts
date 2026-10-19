import { expect } from "chai";
import BN from "bn.js";
import { SmartContract } from "ton-contract-executor";
import { setBalance } from "./helpers";
describe("emulator balance precision", () => {
  it("preserves balances beyond Number.MAX_SAFE_INTEGER without converting through a number", () => {
    let observed: BN | undefined;
    const contract = { setC7Config: (value: { balance: BN }) => { observed = value.balance; } };
    const expected = new BN("900719925474099312345");
    setBalance(contract as unknown as SmartContract, expected);
    expect(observed!.toString(10)).to.equal("900719925474099312345");
  });
});
