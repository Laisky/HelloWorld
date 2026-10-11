"use strict";
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const solc = require(process.env.SOLC_MODULE || "solc");
const moduleRoot = process.env.EVM_MODULE_ROOT;
const ethers = require(moduleRoot ? path.join(moduleRoot, "ethers") : "ethers");
const hardhat = require(
  moduleRoot ? path.join(moduleRoot, "hardhat") : "hardhat",
);
const root = path.resolve(__dirname, "..");

function compile() {
  const sources = {};
  for (const filename of ["erc721.sol", "erc20_upgradable.sol"]) {
    sources[filename] = {
      content: fs.readFileSync(path.join(root, filename), "utf8"),
    };
  }
  const input = {
    language: "Solidity",
    sources,
    settings: {
      evmVersion: "cancun",
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
  assert.deepStrictEqual(
    (output.errors || [])
      .filter((error) => error.severity === "error")
      .map((error) => error.formattedMessage),
    [],
  );
  return output.contracts["erc721.sol"].MyNFT;
}

async function main() {
  const contract = compile();
  console.log("PASS both OpenZeppelin consumers compile");
  const chain = hardhat.network.provider;
  const provider = new ethers.BrowserProvider(chain);
  provider.pollingInterval = 10;
  try {
    const owner = await provider.getSigner(0);
    const holder = await provider.getSigner(1);
    const outsider = await provider.getSigner(2);
    const holderAddress = await holder.getAddress();
    const outsiderAddress = await outsider.getAddress();
    const nft = await new ethers.ContractFactory(
      contract.abi,
      contract.evm.bytecode.object,
      owner,
    ).deploy();
    await nft.waitForDeployment();
    assert.strictEqual(await nft.name(), "Laisky's First NFT");
    assert.strictEqual(await nft.symbol(), "LaiskyNFT");
    console.log("PASS NFT deployment preserves name and symbol");

    await assert.rejects(
      nft.connect(outsider).mintNFT.staticCall(holderAddress, "ipfs://bad"),
    );
    await (await nft.mintNFT(holderAddress, "ipfs://one")).wait();
    assert.strictEqual(await nft.ownerOf(1n), holderAddress);
    assert.strictEqual(await nft.tokenURI(1n), "ipfs://one");
    assert.strictEqual(await nft.balanceOf(holderAddress), 1n);
    console.log("PASS owner-only mint starts at token one and retains URI");

    await (await nft.mintNFT(holderAddress, "ipfs://two")).wait();
    assert.strictEqual(await nft.ownerOf(2n), holderAddress);
    assert.strictEqual(await nft.balanceOf(holderAddress), 2n);
    await assert.rejects(
      nft
        .connect(outsider)
        .transferFrom.staticCall(holderAddress, outsiderAddress, 2n),
    );
    await (
      await nft.connect(holder).transferFrom(holderAddress, outsiderAddress, 2n)
    ).wait();
    assert.strictEqual(await nft.ownerOf(2n), outsiderAddress);
    assert.strictEqual(await nft.tokenURI(2n), "ipfs://two");
    console.log("PASS distinct token IDs and authorized ERC721 transfer");

    await assert.rejects(nft.connect(holder).burnNFT.staticCall(1n));
    await (await nft.burnNFT(1n)).wait();
    await assert.rejects(nft.ownerOf(1n));
    assert.strictEqual(await nft.tokenURI(1n), "");
    assert.strictEqual(await nft.balanceOf(holderAddress), 0n);
    console.log("PASS owner-only burn clears ownership and URI");

    await (await nft.mintNFT(holderAddress, "ipfs://three")).wait();
    assert.strictEqual(await nft.ownerOf(3n), holderAddress);
    assert.strictEqual(await nft.tokenURI(3n), "ipfs://three");
    await assert.rejects(nft.burnNFT.staticCall(1n));
    console.log("PASS burned IDs are never reused and cannot be burned twice");
  } finally {
    provider.destroy();
    await chain.request({ method: "hardhat_reset", params: [] });
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
