"use strict";
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const http = require("http");
const root = path.resolve(__dirname, "..");
const choice = process.argv[2] || "modern";
let passed = 0;
function load(dir, name) {
  return require(path.join(root, dir, "node_modules", name));
}
async function check(name, fn) {
  await fn();
  passed++;
  console.log("PASS " + name);
}
async function common(dir) {
  const modules = path.join(root, dir, "node_modules");
  if (fs.existsSync(path.join(modules, "js-yaml"))) {
    await check(
      dir + ": safe YAML preserves data and refuses JavaScript tags",
      () => {
        const yaml = load(dir, "js-yaml");
        const parse =
          yaml.safeLoad &&
          /^3\./.test(load(dir, "js-yaml/package.json").version)
            ? yaml.safeLoad
            : yaml.load;
        assert.deepStrictEqual(parse("example:\n  - one\n  - two\n"), {
          example: ["one", "two"],
        });
        assert.throws(() => parse('!!js/function "function () { return 1; }"'));
        const data = parse("__proto__:\n  polluted: unsafe\nsafe: ok");
        assert.strictEqual({}.polluted, undefined);
        assert.strictEqual(data.safe, "ok");
      },
    );
  }
  if (fs.existsSync(path.join(modules, "brace-expansion"))) {
    await check(dir + ": nested brace patterns retain expected paths", () => {
      const module = load(dir, "brace-expansion");
      const expand = typeof module === "function" ? module : module.expand;
      assert.deepStrictEqual(expand("demo/{a,b}/{1,2}.js"), [
        "demo/a/1.js",
        "demo/a/2.js",
        "demo/b/1.js",
        "demo/b/2.js",
      ]);
    });
  }
  if (fs.existsSync(path.join(modules, "browserslist"))) {
    await check(
      dir + ": browser target queries produce Chrome versions",
      () => {
        const targets = load(dir, "browserslist")("last 2 chrome versions");
        assert.strictEqual(targets.length, 2);
        assert(targets.every((target) => /^chrome \d+$/.test(target)));
      },
    );
  }
  if (fs.existsSync(path.join(modules, "qs"))) {
    await check(
      dir + ": query arrays round trip without prototype writes",
      () => {
        const qs = load(dir, "qs");
        const data = { tag: ["one", "two"], page: "demo" };
        assert.deepStrictEqual(qs.parse(qs.stringify(data)), data);
        qs.parse(
          "__proto__[polluted]=unsafe&constructor[prototype][polluted]=unsafe",
        );
        assert.strictEqual({}.polluted, undefined);
      },
    );
  }
}
async function axios(dir) {
  await check(
    dir + ": HTTP JSON, form input and rejection behavior",
    async () => {
      const client = load(dir, "axios");
      const server = http.createServer((req, res) => {
        let body = "";
        req.on("data", (data) => {
          body += data;
        });
        req.on("end", () => {
          res.setHeader("Content-Type", "application/json");
          res.statusCode = req.url === "/failure" ? 418 : 200;
          res.end(JSON.stringify({ method: req.method, body }));
        });
      });
      await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
      const baseURL = "http://127.0.0.1:" + server.address().port;
      try {
        const response = await client.post(
          baseURL + "/json",
          { example: "hello" },
          { proxy: false, timeout: 3000 },
        );
        assert.strictEqual(response.status, 200);
        assert.deepStrictEqual(JSON.parse(response.data.body), {
          example: "hello",
        });
        const form = await client.post(baseURL + "/form", "tag=one&tag=two", {
          proxy: false,
          timeout: 3000,
        });
        assert.strictEqual(form.data.body, "tag=one&tag=two");
        let rejected = false;
        try {
          await client.get(baseURL + "/failure", {
            proxy: false,
            timeout: 3000,
          });
        } catch (error) {
          rejected = true;
          assert.strictEqual(error.response.status, 418);
        }
        assert(rejected);
      } finally {
        await new Promise((resolve) => server.close(resolve));
      }
    },
  );
}
(async () => {
  const dirs =
    choice === "kibana"
      ? ["kibana/plugins/demo"]
      : choice === "slides"
        ? ["tools/google-slides"]
        : choice === "webpack"
          ? ["FE/webpack/webpack_v1"]
          : [
              "blockchain/solidity/WTF",
              "blockchain/ton/connect/demo",
              "blockchain/ton/contracts/contract-wallet",
              "blockchain/ton/contracts/counter",
              "blockchain/ton/contracts/simple-counter",
              "blockchain/ton/contracts/minter-contract",
              "blockchain/ton/contracts/simple-distributor",
            ];
  for (const dir of dirs) {
    await common(dir);
    if (
      choice === "modern" &&
      fs.existsSync(path.join(root, dir, "node_modules/axios"))
    )
      await axios(dir);
  }
  if (choice === "slides")
    await check("Slides Markdown headings and images remain renderable", () => {
      const markdown = new (load("tools/google-slides", "markdown-it"))();
      const html = markdown.render("# Example\n\n![icon](icon.png)\n");
      assert(html.includes("<h1>Example</h1>"));
      assert(html.includes('src="icon.png"'));
    });
  console.log(passed + " dependency behavior checks passed");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
