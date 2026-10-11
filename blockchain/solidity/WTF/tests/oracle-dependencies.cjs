"use strict";
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const solc = require(process.env.SOLC_MODULE || "solc");
const root = path.resolve(__dirname, "..");
const input = {
  language: "Solidity",
  sources: {
    "oracle-vrf.sol": {
      content: fs.readFileSync(path.join(root, "oracle-vrf.sol"), "utf8"),
    },
  },
  settings: {
    outputSelection: { "*": { "*": ["abi", "evm.bytecode.object"] } },
  },
};
const output = JSON.parse(
  solc.compile(JSON.stringify(input), {
    import: (name) => {
      const filename = path.resolve(root, "node_modules", name);
      if (!filename.startsWith(path.join(root, "node_modules") + path.sep))
        return { error: "Outside dependency tree" };
      try {
        return { contents: fs.readFileSync(filename, "utf8") };
      } catch (error) {
        return { error: error.message };
      }
    },
  }),
);
const errors = (output.errors || []).filter(
  (error) => error.severity === "error",
);
assert.deepStrictEqual(
  errors.map((error) => error.formattedMessage),
  [],
);
const contract = output.contracts["oracle-vrf.sol"].VRFv2DirectFundingConsumer;
assert(contract.evm.bytecode.object.length > 0);
for (const name of [
  "owner",
  "requestRandomWords",
  "getRequestStatus",
  "rawFulfillRandomWords",
]) {
  assert(
    contract.abi.some((item) => item.type === "function" && item.name === name),
    name,
  );
}
console.log(
  "Oracle compiles with the updated Chainlink dependency and preserves its public ABI",
);
