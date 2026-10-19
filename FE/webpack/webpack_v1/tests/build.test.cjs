"use strict";
const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { pathToFileURL } = require("url");
const { execFileSync } = require("child_process");
const root = path.resolve(__dirname, "..");
const webpack = require("webpack");
const expected = require("bootstrap/package.json").version;

function browser(missingBootstrap) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "helloworld-webpack-browser-"));
  try {
    let html = fs.readFileSync(path.join(root, "index.html"), "utf8");
    html = html.replace("<head>", '<head><base href="' + pathToFileURL(root + path.sep).href + '"><script>window.__compatErrors=[];window.onerror=function(m){window.__compatErrors.push(String(m));};</script>');
    if (missingBootstrap) html = html.replace("./build/bootstrap.js", "./build/missing-bootstrap.js");
    html = html.replace("</body>", '<script>setTimeout(function(){var wrapper=document.querySelector("#wrapper"),table=document.querySelector("table");var ok=wrapper&&wrapper.textContent==="Hello World"&&document.querySelectorAll("tbody tr").length===3&&getComputedStyle(wrapper).backgroundColor==="rgb(211, 211, 211)"&&getComputedStyle(table).borderCollapse==="collapse"&&window.bootstrap&&bootstrap.Tooltip.VERSION===' + JSON.stringify(expected) + '&&window.__compatErrors.length===0;document.body.setAttribute("data-compat-ok",String(!!ok));},100);</script></body>');
    const fixture = path.join(directory, "index.html");
    fs.writeFileSync(fixture, html);
    const result = execFileSync(process.env.CHROME_BIN || "google-chrome", [
      "--headless", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage",
      "--disable-background-networking", "--disable-extensions", "--no-first-run",
      "--user-data-dir=" + path.join(directory, "profile"), "--virtual-time-budget=2000",
      "--dump-dom", pathToFileURL(fixture).href,
    ], { timeout: 30000, maxBuffer: 5 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] }).toString();
    return result.includes('data-compat-ok="true"');
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

webpack(require(path.join(root, "webpack.config.js")), function (error, stats) {
  try {
    assert.ifError(error);
    // Webpack 1's CLI can exit zero after compilation errors. Check the API.
    assert(!stats.hasErrors(), stats.toString({ colors: false }));
    const assets = {
      "bootstrap.css": "bootstrap/dist/css/bootstrap.min.css",
      "bootstrap.js": "bootstrap/dist/js/bootstrap.bundle.min.js",
    };
    Object.keys(assets).forEach(function (name) {
      assert(fs.readFileSync(path.join(root, "build", name)).equals(fs.readFileSync(require.resolve(assets[name]))));
    });
    assert(browser(false), "Built React page, Bootstrap runtime or table styles failed in Chrome");
    assert(!browser(true), "Missing Bootstrap bundle must fail the browser control");
    console.log("Webpack compilation, exact vendor assets, browser rendering and missing-bundle control passed");
  } catch (failure) {
    console.error(failure.stack);
    process.exitCode = 1;
  }
});
