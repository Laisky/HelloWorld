# Historical dependency regression checks

These checks qualify dependency updates against the existing examples. Install
dependencies from their lockfiles before running the checks. Installation during
qualification uses disabled lifecycle scripts; native Sass setup is a separate,
bounded step for Webpack.

## Historical runtimes

- Node 8: node tools/dependency-regressions.cjs kibana (7 checks), then
  node tools/pr95-dependency-regressions.cjs kibana (2 checks).
- Node 16: node tools/dependency-regressions.cjs webpack (4 groups, including
  15 HTTP preview assertions), then node tools/pr95-dependency-regressions.cjs
  webpack (4 checks).
- Node 22: node tools/dependency-regressions.cjs slides (6 checks), then
  node tools/pr95-dependency-regressions.cjs slides (2 checks), and
  node --test tools/google-slides/tests/dependencies.test.cjs (2 checks).

The Webpack example keeps Webpack 1, Babel 6, React 15 and Bootstrap 3 styling
and glyphicons. Modern webpack-dev-server 5 and middleware 7 require compiler
hooks absent from Webpack 1. The dependency chain has been removed. npm start
now watches compilation and serves built files through preview.cjs on loopback.
Refresh the browser after changes. The preview does not implement hot reload,
proxying, or editor endpoints; it rejects cross-site requests, untrusted hosts,
source-file access, traversal and escaping symlinks. The full build additionally
needs the node-sass 7 Node 16 native binding: run npm run build in the example.

The Kibana check parses the actual route with its Babel parser and exercises
registration and the ISO timestamp reply. Full Kibana 5.5.3 server/browser
integration is outside these offline checks. Google Slides API and OAuth are
not invoked.

## PR 95: ten-directory qualification

Run node tools/pr95-dependency-regressions.cjs modern under Node 22 for 25
offline dependency checks across the seven modern examples. HTTP fixtures bind
only ephemeral loopback ports; no blockchain, cloud API or deployment is used.

| Directory | Additional acceptance | Scope |
| --- | --- | --- |
| FE/webpack/webpack_v1 | Full Webpack 1 build under Node 16 | Existing JSX, Sass, Bootstrap and asset preview |
| blockchain/solidity/WTF | tests/oracle-dependencies.cjs | Existing Chainlink VRF consumer compilation and public ABI |
| blockchain/ton/connect/demo | webpack browser build | Existing wallet-connect bundle; bundle size warnings retained |
| blockchain/ton/contracts/contract-wallet | npm test -- --runInBand: 3 tests | Actual Wallet identity, signed allowances, invalid signatures and replay rejection |
| blockchain/ton/contracts/counter | npm test -- --runInBand: 4 tests | Compile, deploy, deterministic increment, withdrawal and insufficient balance |
| blockchain/ton/contracts/simple-counter | npm test -- --runInBand: 2 tests | Generates Tact wrapper before deployment/increment sandbox tests |
| blockchain/ton/contracts/minter-contract | node node_modules/mocha/bin/mocha.js test/dependencies.spec.cjs: 5 tests | Mocha hooks, throttled HTTP, TON JSON-RPC and cell serialization |
| blockchain/ton/contracts/simple-distributor | npm test -- --runInBand: 5 tests | Existing distribution, data/code update and top-up tests with Jest 30 |
| kibana/plugins/demo | Historical Node 8 checks above | Actual route and changed parsing dependencies |
| tools/google-slides | Slides checks above | Markdown, query parsing and historical document helpers |

For the Solidity test install solc 0.8.30 in a temporary tool directory and set
SOLC_MODULE to its node_modules/solc directory, or make that version available
to Node's module resolver. The test compiles oracle-vrf.sol and its installed
Chainlink imports; it does not claim unrelated OpenZeppelin examples compile.

Blueprint 0.47.1 rejects the existing sandbox 0.20 peer. Both counters retain
Blueprint 0.22 and apply compatible-major Axios, YAML, brace and browser patches.
The counter's previously undefined send_grams helper is implemented using the
standard message primitive and covered by success/failure sandbox regressions.
No access-control redesign is included in this tutorial dependency change.

The wallet's previous test imported an absent SampleTactContract counter
template. The replacement exercises the tracked Wallet contract instead. The
legacy wallet deployment template is not qualified or executed.

The minter's original npm test suite still cannot load the absent
build/jetton-minter.deploy module. Its build and postinstall scripts also refer
to absent build/_build.ts and build/_setup.ts. These files are absent on the base
branch as well. Its focused dependency suite passes; full contract compilation,
original contract tests, deployment and lifecycle scripts are not claimed to
pass. Reconstructing that separate historical build setup is outside PR 95.

All checks are run locally with bounded serial execution. This change does not
add heavier automatic CI or production publishing.
