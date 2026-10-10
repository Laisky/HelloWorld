"use strict";
const assert = require("assert");
const http = require("http");
const axios = require("axios");
const throttle = require("axios-request-throttle");
const { beginCell, Address } = require("ton");
describe("offline dependency compatibility", () => {
  let server, client, baseURL, rpcRequest;
  before(async () => {
    server = http.createServer((req, res) => {
      if (req.url === "/rpc" || req.url === "/bad-rpc") {
        let body = "";
        req.on("data", (data) => {
          body += data;
        });
        req.on("end", () => {
          rpcRequest = JSON.parse(body);
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              ok: true,
              result: {
                gas_used: 0,
                exit_code: 0,
                stack: req.url === "/rpc" ? [] : "invalid",
              },
            }),
          );
        });
        return;
      }
      res.setHeader("Content-Type", "application/json");
      res.statusCode = req.url === "/reject" ? 412 : 200;
      res.end(JSON.stringify({ path: req.url }));
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    baseURL = "http://127.0.0.1:" + server.address().port;
    client = axios.create({
      baseURL: "http://127.0.0.1:" + server.address().port,
      proxy: false,
      timeout: 3000,
    });
    throttle.use(client, { requestsPerSecond: 100 });
  });
  after(async () => {
    await new Promise((resolve) => server.close(resolve));
  });
  it("runs asynchronous throttled HTTP requests without changing their responses", async () => {
    const values = await Promise.all([client.get("/one"), client.get("/two")]);
    assert.deepStrictEqual(
      values.map((value) => value.data.path),
      ["/one", "/two"],
    );
  });
  it("preserves rejected HTTP status responses through interceptors", async () => {
    await assert.rejects(client.get("/reject"), (error) => error.response.status === 412);
  });
  it("round trips jetton-style coin and address fields", () => {
    const address = new Address(0, Buffer.alloc(32, 3));
    const data = beginCell().storeCoins(123n).storeAddress(address).endCell().beginParse();
    assert.strictEqual(data.readCoins().toString(), "123");
    assert(data.readAddress().equals(address));
  });
  it("preserves TON JSON-RPC serialization through its patched transport", async () => {
    const { HttpApi } = require("ton/dist/client/api/HttpApi");
    const api = new HttpApi(baseURL + "/rpc", { timeout: 3000 });
    const address = new Address(0, Buffer.alloc(32, 3));
    assert.deepStrictEqual(await api.callGetMethod(address, "seqno", []), {
      gas_used: 0,
      exit_code: 0,
      stack: [],
    });
    assert.strictEqual(rpcRequest.method, "runGetMethod");
    assert.strictEqual(rpcRequest.params.address, address.toString());
    assert.strictEqual(rpcRequest.params.method, "seqno");
  });
  it("still rejects malformed TON JSON-RPC results", async () => {
    const { HttpApi } = require("ton/dist/client/api/HttpApi");
    const api = new HttpApi(baseURL + "/bad-rpc", { timeout: 3000 });
    await assert.rejects(
      api.callGetMethod(new Address(0, Buffer.alloc(32, 3)), "seqno", []),
      /Malformed response/,
    );
  });
});
