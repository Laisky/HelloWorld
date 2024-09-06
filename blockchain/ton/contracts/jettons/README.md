# Jetton

Tact Lack of correct and usable examples. Additional, some code in tact-by-example has issues that does not strictly follow TEP.

So I tried to provide a correct and usable code example, but it's still not completely finished.

## Project structure

-   `contracts`: source code of all the smart contracts of the project and their dependencies.
-   `scripts`: scripts used by the project, mainly the deployment scripts.

## How to use

### Install

Install nodejs: <https://github.com/nodesource/distributions>

```sh
npm i
```

### Build

`npx blueprint build`

### Run

```sh
npx blueprint run --testnet --tonconnect all
```
