# Historical dependency regression checks

These checks preserve the behavior of the existing examples while qualifying
their dependency changes. They do not upgrade the examples to a new framework.

After a frozen Yarn 1 install in each directory:

- Node 8: `node tools/dependency-regressions.cjs kibana` (7 checks).
- Node 16: `node tools/dependency-regressions.cjs webpack` (4 checks).
- Node 22: `node tools/dependency-regressions.cjs slides` (6 checks), then
  `node --test tools/google-slides/tests/dependencies.test.cjs` (2 checks).

The Webpack check opens an ephemeral loopback HTTP listener, verifies the
SockJS handshake, and closes it. The Kibana check parses the actual route
with its Babel parser and exercises registration and the reply. No deployed
Kibana server, Google Slides API, OAuth, or paid service is contacted.

The Webpack 1 full example build additionally needs Node 16 and the node-sass 7
native binding. Run `node node_modules/webpack/bin/webpack.js` in its directory.
Kibana 5.5.3 full server/browser integration is outside these offline checks.

The Webpack example intentionally keeps the compatible v1 development server.
The proposed v3 server crashes with the existing v1 compiler. The repaired
lockfile uses real manifest selectors, so Bootstrap 3.4.1 is actually installed.
These historical runtime versions and retained transitive dependencies should
not be treated as a general security upgrade or a production server baseline.
