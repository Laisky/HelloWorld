"use strict";
const assert = require("assert"),
  fs = require("fs"),
  os = require("os"),
  path = require("path"),
  http = require("http");
const { createPreview } = require("../preview.cjs");
(async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "webpack1-preview-"));
  fs.mkdirSync(path.join(root, "build"));
  fs.writeFileSync(path.join(root, "index.html"), "<h1>Hello World</h1>");
  fs.writeFileSync(path.join(root, "build/sites.js"), "window.example = true;");
  fs.writeFileSync(path.join(root, "package.json"), '{"private":"fixture"}');
  fs.symlinkSync(
    path.join(root, "package.json"),
    path.join(root, "build/escape.js"),
  );
  const server = createPreview(root);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  const request = (url, options = {}) =>
    new Promise((resolve, reject) => {
      const req = http.request(
        {
          hostname: "127.0.0.1",
          port,
          path: url,
          method: options.method || "GET",
          headers: options.headers || {},
        },
        (res) => {
          let body = "";
          res.on("data", (data) => {
            body += data;
          });
          res.on("end", () =>
            resolve({ status: res.statusCode, headers: res.headers, body }),
          );
        },
      );
      req.on("error", reject);
      req.end();
    });
  try {
    const index = await request("/");
    assert.strictEqual(index.status, 200);
    assert(index.body.includes("Hello World"));
    const bundle = await request("/build/sites.js");
    assert.strictEqual(bundle.status, 200);
    assert(bundle.body.includes("window.example"));
    assert.strictEqual(
      bundle.headers["cross-origin-resource-policy"],
      "same-origin",
    );
    const head = await request("/build/sites.js", { method: "HEAD" });
    assert.strictEqual(head.status, 200);
    assert.strictEqual(head.body, "");
    assert.strictEqual((await request("/package.json")).status, 404);
    assert.strictEqual(
      (await request("/build/%2e%2e/package.json")).status,
      403,
    );
    assert.strictEqual((await request("/build/escape.js")).status, 403);
    assert.strictEqual((await request("/%XX")).status, 400);
    assert.strictEqual(
      (await request("/", { headers: { host: "attacker.example" } })).status,
      403,
    );
    assert.strictEqual(
      (await request("/", { headers: { origin: "https://attacker.example" } }))
        .status,
      403,
    );
    assert.strictEqual(
      (await request("/", { headers: { "sec-fetch-site": "cross-site" } }))
        .status,
      403,
    );
    assert.strictEqual((await request("/", { method: "POST" })).status, 405);
    assert.strictEqual(
      (await request("/webpack-dev-server/open-editor")).status,
      404,
    );
    assert.strictEqual((await request("/build/%5cprivate.js")).status, 403);
    assert.strictEqual((await request("/build/%00private.js")).status, 403);
    console.log("15 local preview behavior checks passed");
  } finally {
    await new Promise((resolve) => server.close(resolve));
    for (const file of [
      "build/escape.js",
      "build/sites.js",
      "index.html",
      "package.json",
    ])
      fs.unlinkSync(path.join(root, file));
    fs.rmdirSync(path.join(root, "build"));
    fs.rmdirSync(root);
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
