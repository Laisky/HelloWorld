import { NetworkProvider } from '@ton/blueprint';
import { run as masterWithdraw } from './master_withdraw';
import { run as botWithdraw } from './bot_withdraw';
import { run as oracleWithdraw } from './oracle_withdraw';


export async function run(provider: NetworkProvider) {
    console.log(">> masterWithdraw");
    await masterWithdraw(provider);
    console.log(">> botWithdraw");
    await botWithdraw(provider);
    console.log(">> oracleWithdraw");
    await oracleWithdraw(provider);
}
