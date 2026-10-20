"use strict";
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const lock = JSON.parse(fs.readFileSync("package-lock.json", "utf8"));
const entries = Object.keys(lock.packages).filter((name) => /(^|\/)node_modules\/tmp$/.test(name));
for (const entry of entries) {
  const parts = lock.packages[entry].version.split(".").map(Number);
  assert(parts.length === 3 && parts.every(Number.isInteger));
  assert(parts[0] > 0 || parts[1] > 2 || (parts[1] === 2 && parts[2] >= 7), "Unpatched temporary-file dependency");
  const tmp = require(path.resolve(entry));
  const file = tmp.fileSync({ prefix: "helloworld-dependency-", postfix: ".txt", mode: 0o600 });
  try {
    fs.writeSync(file.fd, "synthetic compatibility payload");
    assert.strictEqual(fs.readFileSync(file.name, "utf8"), "synthetic compatibility payload");
    assert.strictEqual(fs.statSync(file.name).mode & 0o777, 0o600);
  } finally {
    file.removeCallback();
  }
  assert.strictEqual(fs.existsSync(file.name), false);
  assert.throws(() => fs.fstatSync(file.fd), { code: "EBADF" });
}
console.log(entries.length ? "Patched temporary-file creation and cleanup compatibility passed" : "Locked graph no longer contains a tmp dependency");
