import { NetworkProvider } from '@ton/blueprint';
import { run as withdraw_all } from './withdraw_all';
import { run as bot_register } from './bot_register';
import { run as bot_create_attest_task } from './bot_create_attest_task';
import { run as oracle_register } from './oracle_register';
import { run as oracle_create_attest_result } from './oracle_create_attest_result';


export async function run(provider: NetworkProvider) {
    await bot_register(provider);
    await bot_create_attest_task(provider);
    await oracle_register(provider);
    await oracle_create_attest_result(provider);
    await withdraw_all(provider);
}
