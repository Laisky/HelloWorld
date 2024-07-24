import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/laisky_jetton.tact',
    options: {
        debug: true,
    },
};
