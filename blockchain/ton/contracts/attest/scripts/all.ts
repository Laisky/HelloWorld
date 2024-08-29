import { NetworkProvider } from '@ton/blueprint';
import { run as withdraw_all } from './withdraw_all';
import { run as bot_register } from './bot_register';
import { run as bot_create_attest_task } from './bot_create_attest_task';
import { run as oracle_register } from './oracle_register';
import { run as oracle_create_attest_result } from './oracle_create_attest_result';


export async function run(provider: NetworkProvider) {
    try {
        console.log(">> bot_register");
        await bot_register(provider);

        console.log(">> bot_create_attest_task");
        await bot_create_attest_task(provider);

        console.log(">> oracle_register");
        await oracle_register(provider);

        console.log(">> oracle_create_attest_result");
        await oracle_create_attest_result(provider);

    } finally {
        console.log(">> withdraw_all");
        await withdraw_all(provider);
    }
}
