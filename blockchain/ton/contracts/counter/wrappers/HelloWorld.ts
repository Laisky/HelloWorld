import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type HelloWorldConfig = {
    id: number;
    counter: number;
};

export function helloWorldConfigToCell(config: HelloWorldConfig): Cell {
    return beginCell().storeUint(config.id, 32).storeUint(config.counter, 32).endCell();
}

export const Opcodes = {
    increase: 0x7e8764ef,
    withdraw: 0xcb03bfaf,
};

export class HelloWorld implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell },
    ) {}

    static createFromAddress(address: Address) {
        return new HelloWorld(address);
    }

    static createFromConfig(config: HelloWorldConfig, code: Cell, workchain = 0) {
        const data = helloWorldConfigToCell(config);
        const init = { code, data };
        return new HelloWorld(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    /**
     * Sends an increase transaction to the HelloWorld contract.
     * @param provider The contract provider.
     * @param via The sender of the transaction.
     * @param opts The options for the increase transaction.
     *              - increaseBy: The amount to increase the counter by.
     *              - value: The value to send along with the transaction.
     *              - queryID: (optional) The query ID for the transaction.
     */
    async sendIncrease(
        provider: ContractProvider,
        via: Sender,
        opts: {
            increaseBy: number;
            value: bigint;
            queryID?: number;
        },
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.increase, 32)
                .storeUint(opts.queryID ?? 0, 64)
                .storeUint(opts.increaseBy, 32)
                .endCell(),
        });
    }

    /**
     * Sends a withdraw transaction to the HelloWorld contract.
     * @param provider The contract provider.
     * @param via The sender of the transaction.
     * @param opts The options for the withdraw transaction.
     *              - amount: The amount of TON to withdraw (in nanoTON).
     *              - recipient: The address to receive the withdrawn TON.
     *              - value: The value to send along with the transaction (for gas).
     *              - queryID: (optional) The query ID for the transaction.
     */
    async sendWithdraw(
        provider: ContractProvider,
        via: Sender,
        opts: {
            amount: bigint;
            recipient: Address;
            value: bigint;
            queryID?: number;
        },
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.withdraw, 32)
                .storeUint(opts.queryID ?? 0, 64)
                .storeAddress(opts.recipient) // Store recipient address
                .storeCoins(opts.amount) // Store amount in nanoTON
                .endCell(),
        });
    }

    async getCounter(provider: ContractProvider) {
        const result = await provider.get('get_counter', []);
        return result.stack.readNumber();
    }

    async getID(provider: ContractProvider) {
        const result = await provider.get('get_id', []);
        return result.stack.readNumber();
    }
}
