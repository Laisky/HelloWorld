The offline dependency tests compile the actual example sources with Solidity
0.8.30. The NFT regression uses an in-memory Hardhat Cancun EVM and checks the
original mint, transfer, URI and owner-only burn behavior. It sends no external
transactions. The custom upgradeable token is compiled but its proxy behavior
is not covered by this test.

Install solc@0.8.30, ethers@6.15.0 and hardhat@2.26.3 in a temporary
directory with npm install --prefix "$TEST_TOOLS" --ignore-scripts.
Create $TEST_TOOLS/hardhat.config.cjs containing:

```javascript
module.exports = { networks: { hardhat: { hardfork: "cancun" } } };
```

Then run from this repository's root after npm ci --ignore-scripts in the WTF
directory:

```sh
SOLC_MODULE="$TEST_TOOLS/node_modules/solc" \
EVM_MODULE_ROOT="$TEST_TOOLS/node_modules" \
HARDHAT_CONFIG="$TEST_TOOLS/hardhat.config.cjs" \
node blockchain/solidity/WTF/tests/nft-dependencies.cjs
SOLC_MODULE="$TEST_TOOLS/node_modules/solc" \
node blockchain/solidity/WTF/tests/oracle-dependencies.cjs
```

Older compilers and EVM hardforks are outside this acceptance configuration.
