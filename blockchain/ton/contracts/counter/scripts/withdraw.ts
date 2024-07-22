import { Address, toNano } from '@ton/core';
import { HelloWorld } from '../wrappers/HelloWorld';
import { NetworkProvider, sleep } from '@ton/blueprint';

// ... (Your existing imports) ...

/**
 * This script withdraws a specified amount of TON from the HelloWorld contract.
 *
 * @param provider
 * @param args
 * @returns
 */
export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('HelloWorld address'));
    // const address = Address.parse('EQCjKH1DLzaQk-7EsL0eumFwTfrhj6PCK1uYYGW4PijaVbXz');

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const helloWorld = provider.open(HelloWorld.createFromAddress(address));

    // --- Withdraw Logic ---
    const recipientAddress = Address.parse(await ui.input('Enter recipient address:'));
    const amountToWithdraw = toNano(await ui.input('Enter amount to withdraw (in TON):'));

    await helloWorld.sendWithdraw(provider.sender(), {
        amount: amountToWithdraw,
        recipient: recipientAddress,
        value: toNano('0.05'), // Adjust gas as needed
        queryID: Date.now(), // (Optional) Add a query ID
    });

    ui.write(`Withdrawal initiated. Transaction details can be found in the console.`);

    // (Optional) Wait for transaction confirmation (advanced)
    // ... You could add logic here to track the transaction and update the UI
    // ... For simplicity, we'll just wait for a few seconds.
    await sleep(5000);


    // (Optional) Get the contract's balance after withdrawal
    const balanceAfter = await provider.getBalance(address);
    ui.write(`Contract balance after withdrawal: ${balanceAfter.toString()} nanoTON`);
}
