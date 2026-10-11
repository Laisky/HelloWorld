"use strict";
const fs = require("fs");
const http = require("http");
const path = require("path");
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject",
};
function createPreview(root) {
  root = fs.realpathSync(root);
  return http.createServer((req, res) => {
    const end = (status, message) => {
      res.statusCode = status;
      res.end(message);
    };
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
    const port = req.socket.localPort;
    const hosts = ["localhost:" + port, "127.0.0.1:" + port, "[::1]:" + port];
    if (
      !hosts.includes(req.headers.host) ||
      req.headers["sec-fetch-site"] === "cross-site"
    )
      return end(403, "Forbidden");
    if (
      req.headers.origin &&
      req.headers.origin !== "http://" + req.headers.host
    )
      return end(403, "Forbidden");
    if (req.method !== "GET" && req.method !== "HEAD")
      return end(405, "Method not allowed");
    let pathname;
    try {
      pathname = decodeURIComponent(req.url.split("?")[0]);
    } catch (_) {
      return end(400, "Bad path");
    }
    if (
      pathname.includes("\\") ||
      pathname.includes("\0") ||
      pathname.split("/").includes("..")
    )
      return end(403, "Forbidden");
    if (pathname === "/") pathname = "/index.html";
    const build = pathname.startsWith("/build/");
    const font = /^\/[a-f0-9]{32}\.(woff2?|ttf|eot|svg)$/.test(pathname);
    if (!build && !font && pathname !== "/index.html")
      return end(404, "Not found");
    const base = build ? path.join(root, "build") : root;
    const file = path.resolve(root, "." + pathname);
    fs.realpath(file, (error, resolved) => {
      if (error) return end(404, "Not found");
      if (!resolved.startsWith(base + path.sep)) return end(403, "Forbidden");
      fs.stat(resolved, (error, stat) => {
        if (error || !stat.isFile()) return end(404, "Not found");
        const type = types[path.extname(resolved)];
        if (!type) return end(404, "Not found");
        res.setHeader("Content-Type", type);
        res.setHeader("Content-Length", stat.size);
        if (req.method === "HEAD") return res.end();
        fs.createReadStream(resolved)
          .on("error", () => res.destroy())
          .pipe(res);
      });
    });
  });
}
if (require.main === module) {
  const webpack = require("webpack");
  const compiler = webpack(require("./webpack.config.js"));
  const server = createPreview(__dirname);
  const watcher = compiler.watch({ aggregateTimeout: 1000 }, (error, stats) => {
    if (error || stats.hasErrors())
      console.error(error || stats.toString({ colors: false }));
    else console.log("Build ready");
  });
  server.listen(8080, "127.0.0.1", () =>
    console.log("Preview: http://127.0.0.1:8080"),
  );
  const close = () => {
    server.close();
    watcher.close(() => process.exit(0));
  };
  process.on("SIGINT", close);
  process.on("SIGTERM", close);
}
module.exports = { createPreview };
