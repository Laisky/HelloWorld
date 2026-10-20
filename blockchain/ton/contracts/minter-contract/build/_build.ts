import fs from "fs";
import path from "path";
import { compileFunc } from "@ton-community/func-js";
import { Cell } from "ton";

// Compile only the checked-in contract sources, using the pinned WASM toolchain.
// No native executable, wallet, endpoint or deployment configuration is used.
async function main() {
  const contracts = path.resolve("contracts");
  const results: { name: string; hex: string }[] = [];
  for (const name of fs.readdirSync(contracts).filter((name) => /\.(fc|func)$/.test(name)).sort()) {
    const result = await compileFunc({
      targets: [path.join("contracts", name)],
      sources: (name) => {
        const file = path.resolve(name);
        if (!file.startsWith(contracts + path.sep)) throw new Error("Compiler input is outside contracts");
        return fs.readFileSync(file, "utf8");
      },
    });
    if (result.status !== "ok") throw new Error(result.message);
    results.push({ name: path.parse(name).name,
      hex: Cell.fromBoc(Buffer.from(result.codeBoc, "base64"))[0].toBoc().toString("hex") });
  }
  if (!results.length) throw new Error("No contract sources found");
  fs.mkdirSync("build", { recursive: true });
  for (const result of results) {
    fs.writeFileSync(path.join("build", result.name + ".compiled.json"), JSON.stringify({ hex: result.hex }) + "\n");
    console.log("Compiled " + result.name);
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
