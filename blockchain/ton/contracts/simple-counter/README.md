# simple-counter

## Project structure

-   `contracts` - source code of all the smart contracts of the project and their dependencies.
-   `wrappers` - wrapper classes (implementing `Contract` from ton-core) for the contracts, including any [de]serialization primitives and compilation functions.
-   `tests` - tests for the contracts.
-   `scripts` - scripts used by the project, mainly the deployment scripts.

## How to use

### Build

`npm run build`

### Test

`npm test`

### Deploy or run another script

`npx blueprint run` or `yarn blueprint run`

### Add a new contract

`npx blueprint create ContractName` or `yarn blueprint create ContractName`

Blueprint 0.47 no longer compiles Tact. This example calls the standalone
Tact 1.4.0 compiler so its existing generated wrapper, code, initial data and
address remain reproducible. Build before running an operator-selected script.
The contract source and debug option are unchanged; protobufjs and tmp are
resolved to patched versions through the checked-in lockfile.
