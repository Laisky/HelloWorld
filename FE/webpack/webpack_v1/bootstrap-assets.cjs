"use strict";
const fs = require("fs");

// Webpack 1's parser cannot parse Bootstrap 5's already-built browser bundle.
// Emit the vendor distribution verbatim and load it as an ordinary script.
function BootstrapAssets() {}
BootstrapAssets.prototype.apply = function (compiler) {
  compiler.plugin("emit", function (compilation, done) {
    try {
      const files = {
        "build/bootstrap.css": "bootstrap/dist/css/bootstrap.min.css",
        "build/bootstrap.js": "bootstrap/dist/js/bootstrap.bundle.min.js",
      };
      Object.keys(files).forEach(function (name) {
        const data = fs.readFileSync(require.resolve(files[name]));
        compilation.assets[name] = {
          source: function () { return data; },
          size: function () { return data.length; },
        };
      });
      done();
    } catch (error) {
      done(error);
    }
  });
};
module.exports = BootstrapAssets;
