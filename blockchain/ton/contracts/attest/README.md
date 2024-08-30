# Attest

```mermaid
sequenceDiagram
    participant User
    participant User-Contract
    participant Bot
    participant Bot-Contract
    participant Contract
    participant Oracle-Contract
    participant Oracle

    Bot ->>+ Contract: Register with MANIFEST
    Contract -->>- Bot-Contract: Deploy with MANIFEST

    Oracle ->>+ Contract: Register with STAKE
    Contract -->>- Oracle-Contract: Deploy with STAKE

    User ->>+ Bot: REQ
    Note over Bot: generate RESP & REPORT
    Note over Bot: Upload REPORT
    Bot ->> Bot-Contract: ATTEST_TASK & INCENTIVE
    Bot-Contract -->> Contract: ATTEST_TASK
    Note over Contract: Generate TASK_ID
    Note over Contract: Publish ATTEST_TASK
    Bot -->>- User: RESP

    par
        Oracle ->>+ Contract: Listen PROOF Event
        Contract -->>- Oracle: PROOF

        Note over Oracle: download REPORT

        Oracle ->>+ Bot-Contract: Get MANIFEST
        Bot-Contract -->>- Oracle: MANIFEST

        Note over Oracle: Verify REPORT
        Note over Oracle: Upload Verified RESULT

        Oracle ->> Oracle-Contract: RESULT
        Oracle-Contract -->>+ Bot-Contract: RESULT
        Note over Bot-Contract: Emit Result Event
        Bot-Contract -->>- Oracle-Contract: INCENTIVE
        Note over Oracle-Contract: Wait INCENTIVE Release
    end

    par
        Bot ->>+ Bot-Contract: Listen Verified Event
        Bot-Contract -->>- Bot: RESULT
        Bot ->>+ Bot-Contract: Send Notify
        Bot-Contract -->>- User-Contract: Notify
    end
```

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
