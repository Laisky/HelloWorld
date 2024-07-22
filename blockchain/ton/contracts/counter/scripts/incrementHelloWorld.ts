import { Address, toNano } from '@ton/core';
import { HelloWorld } from '../wrappers/HelloWorld';
import { NetworkProvider, sleep } from '@ton/blueprint';

/**
 * This script increases the counter value of the HelloWorld contract by 1.
 *
 * default contract addres: EQCjKH1DLzaQk-7EsL0eumFwTfrhj6PCK1uYYGW4PijaVbXz
 *
 * @param provider
 * @param args
 * @returns
 */
export async function run(provider: NetworkProvider, args: string[]) {
    // Create a UI instance
    const ui = provider.ui();

    // Parse the address from the command line arguments or prompt the user for input
    // const address = Address.parse(args.length > 0 ? args[0] : await ui.input('HelloWorld address'));
    const address = Address.parse('EQCjKH1DLzaQk-7EsL0eumFwTfrhj6PCK1uYYGW4PijaVbXz');

    // Check if the contract is deployed at the given address
    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    // Open the HelloWorld contract using the provided address
    const helloWorld = provider.open(HelloWorld.createFromAddress(address));

    // Get the counter value before increasing
    const counterBefore = await helloWorld.getCounter();

    // Increase the counter by 1 with a specified value
    await helloWorld.sendIncrease(provider.sender(), {
        increaseBy: 1,
        value: toNano('0.001'), // almost meet the minimum gas fee
    });

    // Display a message while waiting for the counter to increase
    ui.write('Waiting for counter to increase...');

    let counterAfter = await helloWorld.getCounter();
    let attempt = 1;
    while (counterAfter === counterBefore) {
        ui.setActionPrompt(`Attempt ${attempt}`);
        await sleep(2000);
        counterAfter = await helloWorld.getCounter();
        attempt++;
    }

    // Clear the action prompt and display a success message
    ui.clearActionPrompt();
    ui.write('Counter increased successfully!');
}
