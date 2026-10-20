Webpack v1.x
============


## Reference

  - [webpack-demos by ruanyifeng](https://github.com/ruanyf/webpack-demos)

## Local preview

Use Node 16 for this historical Webpack 1 and node-sass 7 example. Run
npm run build or npm start. The preview binds only to 127.0.0.1:8080,
watches the existing Webpack configuration, and serves the HTML, compiled
JS/CSS, and generated fonts. Reload the browser after a rebuild.

Webpack dev-server 5 and middleware 7 require compiler APIs absent in
Webpack 1. The preview uses Node HTTP instead, so their modern dependency
chain is unnecessary. It exposes no editor/invalidation endpoint, source
tree listing, proxy, or remote deployment action.

Run node tests/preview.test.cjs for HTTP asset, HEAD, traversal, symlink,
Host/Origin, cross-site, and method regressions.

Bootstrap 5's distributed CSS and bundle (including Popper) are emitted verbatim
into build/ and loaded by index.html. They bypass Webpack 1's old JavaScript
parser; application JSX and Sass still use the original compiler chain.
Run yarn test:build for actual compilation and Chrome rendering, including a
missing-vendor negative control. This checks stats.hasErrors because the old
Webpack CLI can report errors while exiting zero. Chrome must be installed;
CHROME_BIN may select its executable. No preview server or deployment is started.
