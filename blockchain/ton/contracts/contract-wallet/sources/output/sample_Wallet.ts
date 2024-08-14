import { 
    Cell,
    Slice, 
    Address, 
    Builder, 
    beginCell, 
    ComputeError, 
    TupleItem, 
    TupleReader, 
    Dictionary, 
    contractAddress, 
    ContractProvider, 
    Sender, 
    Contract, 
    ContractABI, 
    TupleBuilder,
    DictionaryValue
} from 'ton-core';

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    let sc_0 = slice;
    let _code = sc_0.loadRef();
    let _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadTupleStateInit(source: TupleReader) {
    let _code = source.readCell();
    let _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function storeTupleStateInit(source: StateInit) {
    let builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounced: boolean;
    sender: Address;
    value: bigint;
    raw: Cell;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounced);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw);
    };
}

export function loadContext(slice: Slice) {
    let sc_0 = slice;
    let _bounced = sc_0.loadBit();
    let _sender = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _raw = sc_0.loadRef();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function loadTupleContext(source: TupleReader) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function storeTupleContext(source: Context) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounced);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw);
    return builder.build();
}

function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    bounce: boolean;
    to: Address;
    value: bigint;
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounce);
        b_0.storeAddress(src.to);
        b_0.storeInt(src.value, 257);
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
    };
}

export function loadSendParameters(slice: Slice) {
    let sc_0 = slice;
    let _bounce = sc_0.loadBit();
    let _to = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _mode = sc_0.loadIntBig(257);
    let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function loadTupleSendParameters(source: TupleReader) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function storeTupleSendParameters(source: SendParameters) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounce);
    builder.writeAddress(source.to);
    builder.writeNumber(source.value);
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type WalletOperation = {
    $$type: 'WalletOperation';
    signature: Buffer;
    operation: Cell;
}

export function storeWalletOperation(src: WalletOperation) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2798955402, 32);
        b_0.storeBuffer(src.signature);
        b_0.storeBuilder(src.operation.asBuilder());
    };
}

export function loadWalletOperation(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2798955402) { throw Error('Invalid prefix'); }
    let _signature = sc_0.loadBuffer(64);
    let _operation = sc_0.asCell();
    return { $$type: 'WalletOperation' as const, signature: _signature, operation: _operation };
}

function loadTupleWalletOperation(source: TupleReader) {
    let _signature = source.readBuffer();
    let _operation = source.readCell();
    return { $$type: 'WalletOperation' as const, signature: _signature, operation: _operation };
}

function storeTupleWalletOperation(source: WalletOperation) {
    let builder = new TupleBuilder();
    builder.writeBuffer(source.signature);
    builder.writeSlice(source.operation);
    return builder.build();
}

function dictValueParserWalletOperation(): DictionaryValue<WalletOperation> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeWalletOperation(src)).endCell());
        },
        parse: (src) => {
            return loadWalletOperation(src.loadRef().beginParse());
        }
    }
}

export type ExternalOperation = {
    $$type: 'ExternalOperation';
    operation: Cell;
}

export function storeExternalOperation(src: ExternalOperation) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3830936038, 32);
        b_0.storeBuilder(src.operation.asBuilder());
    };
}

export function loadExternalOperation(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3830936038) { throw Error('Invalid prefix'); }
    let _operation = sc_0.asCell();
    return { $$type: 'ExternalOperation' as const, operation: _operation };
}

function loadTupleExternalOperation(source: TupleReader) {
    let _operation = source.readCell();
    return { $$type: 'ExternalOperation' as const, operation: _operation };
}

function storeTupleExternalOperation(source: ExternalOperation) {
    let builder = new TupleBuilder();
    builder.writeSlice(source.operation);
    return builder.build();
}

function dictValueParserExternalOperation(): DictionaryValue<ExternalOperation> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeExternalOperation(src)).endCell());
        },
        parse: (src) => {
            return loadExternalOperation(src.loadRef().beginParse());
        }
    }
}

 type Wallet_init_args = {
    $$type: 'Wallet_init_args';
    publicKey: bigint;
    walletId: bigint;
}

function initWallet_init_args(src: Wallet_init_args) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.publicKey, 257);
        b_0.storeInt(src.walletId, 257);
    };
}

async function Wallet_init(publicKey: bigint, walletId: bigint) {
    const __code = Cell.fromBase64('te6ccgECIAEAA20AART/APSkE/S88sgLAQIBIAIDAgFIBAUCQPLbPFUD2zwwyPhDAcx/AcoAVTBQNMv/yz/LP/QAye1UGRoCAssGBwIBIAkKAqfQB0NMDAXGwowH6QAEg10mBAQu68uCIINcLCiCDCboBgQT/urHy4IhUUFMDbwT4YQL4Yts8VRPbPPLggsj4QwHMfwHKAFUwUDTL/8s/yz/0AMntVIZCAEB0h0C9HAh10nCH5UwINcLH94Cklt/4CGCEORXcea6jrgx0x8BghDkV3HmuvLggSAxgTBfgQEL+EIkWXFBM/QKb6GUAdcAMJJbbeJ/IW6SW3CRuuLy9Ns8f+ABghCm1KuKuo6Y0x8BghCm1KuKuvLggYMI1xhmbBJw2zx/4DB/HRwCAVgLDAIBIBITAgEgDQ4CEbYqe2ebZ42IMBkRAhGzJfbPNs8bEGAZDwIRsH42zzbPGxBgGRAAAiIAAiMAAiAAlbu9GCcFzsPV0srnsehOw51kqFG2aCcJ3WNS0rZHyzItOvLf3xYjmCcCBVwBuAZ2OUzlg6rkclssOCcNl5xm6MObwnrLahMTW43eWAIBSBQVAgFiFhcAdbJu40NWlwZnM6Ly9RbVY4Q1o2NG41dFV1V3hrVkRMQ3JqVFh4d1VZVW1qMWozcGp3OW8yTXpWRjVWggAg+klbZ5tnjYgxkYAA+lfdqJoaQAAwACIQFQ7UTQ1AH4Y9IAAZzT/9M/0z/0BFUwbBTggQEB1wCBAQHXAFkC0QHbPBsBYnAh10nCH5UwINcLH96CEKbUq4q6jpjTHwGCEKbUq4q68uCBgwjXGGZsEn/bPH/gMHAcAAZtcFkBeiH5AYIAvRFRSPkQE/L00h/SH9I/gUT2UTi6E/L0gSFKURa68vSCANTz+CNQA7kS8vQBkvgA3gOk+A8D2zwdAlLTByHAAI4VMZUg10rCAJvUAdAVFEMw8BBVA+gwjwohwAGOgzHbPOMO4h4fAB6VINdKwgCW0gfUAvsA6DAA/CHAAo43gQELMvpAASDXSYEBC7ry4Igg1wsKIIMJugGBBP+6sfLgiDF/cSFulVtZ9FkwmMgBzwBBM/RB4o4/AcADjjeBAQsB+kABINdJgQELuvLgiCDXCwoggwm6AYEE/7qx8uCIMW1xIW6VW1n0WTCYyAHPAEEz9EHikTDi4g==');
    const __system = Cell.fromBase64('te6cckECIgEAA3cAAQHAAQEFoHL9AgEU/wD0pBP0vPLICwMCASAGBAJA8ts8VQPbPDDI+EMBzH8BygBVMFA0y//LP8s/9ADJ7VQgBQFicCHXScIflTAg1wsf3oIQptSrirqOmNMfAYIQptSrirry4IGDCNcYZmwSf9s8f+AwcBwCAUgYBwIBIBAIAgEgDwkCAUgLCgB1sm7jQ1aXBmczovL1FtVjhDWjY0bjV0VXVXeGtWRExDcmpUWHh3VVlVbWoxajNwanc5bzJNelZGNVaCACAWINDAAPpX3aiaGkAAMCD6SVtnm2eNiDIA4AAiEAlbu9GCcFzsPV0srnsehOw51kqFG2aCcJ3WNS0rZHyzItOvLf3xYjmCcCBVwBuAZ2OUzlg6rkclssOCcNl5xm6MObwnrLahMTW43eWAIBWBMRAhG2Kntnm2eNiDAgEgACIAIBIBYUAhGwfjbPNs8bEGAgFQACIwIRsyX2zzbPGxBgIBcAAiICAssaGQEB0h0Cp9AHQ0wMBcbCjAfpAASDXSYEBC7ry4Igg1wsKIIMJugGBBP+6sfLgiFRQUwNvBPhhAvhi2zxVE9s88uCCyPhDAcx/AcoAVTBQNMv/yz/LP/QAye1UiAbAvRwIddJwh+VMCDXCx/eApJbf+AhghDkV3Hmuo64MdMfAYIQ5Fdx5rry4IEgMYEwX4EBC/hCJFlxQTP0Cm+hlAHXADCSW23ifyFukltwkbri8vTbPH/gAYIQptSrirqOmNMfAYIQptSrirry4IGDCNcYZmwScNs8f+Awfx0cAXoh+QGCAL0RUUj5EBPy9NIf0h/SP4FE9lE4uhPy9IEhSlEWuvL0ggDU8/gjUAO5EvL0AZL4AN4DpPgPA9s8HQJS0wchwACOFTGVINdKwgCb1AHQFRRDMPAQVQPoMI8KIcABjoMx2zzjDuIfHgD8IcACjjeBAQsy+kABINdJgQELuvLgiCDXCwoggwm6AYEE/7qx8uCIMX9xIW6VW1n0WTCYyAHPAEEz9EHijj8BwAOON4EBCwH6QAEg10mBAQu68uCIINcLCiCDCboBgQT/urHy4IgxbXEhbpVbWfRZMJjIAc8AQTP0QeKRMOLiAB6VINdKwgCW0gfUAvsA6DABUO1E0NQB+GPSAAGc0//TP9M/9ARVMGwU4IEBAdcAgQEB1wBZAtEB2zwhAAZtcFmINGbo');
    let builder = beginCell();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initWallet_init_args({ $$type: 'Wallet_init_args', publicKey, walletId })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

const Wallet_errors: { [key: number]: { message: string } } = {
    2: { message: `Stack undeflow` },
    3: { message: `Stack overflow` },
    4: { message: `Integer overflow` },
    5: { message: `Integer out of expected range` },
    6: { message: `Invalid opcode` },
    7: { message: `Type check error` },
    8: { message: `Cell overflow` },
    9: { message: `Cell underflow` },
    10: { message: `Dictionary error` },
    13: { message: `Out of gas error` },
    32: { message: `Method ID not found` },
    34: { message: `Action is invalid or not supported` },
    37: { message: `Not enough TON` },
    38: { message: `Not enough extra-currencies` },
    128: { message: `Null reference exception` },
    129: { message: `Invalid serialization prefix` },
    130: { message: `Invalid incoming message` },
    131: { message: `Constraints error` },
    132: { message: `Access denied` },
    133: { message: `Contract stopped` },
    134: { message: `Invalid argument` },
    135: { message: `Code of a contract was not found` },
    136: { message: `Invalid address` },
    137: { message: `Masterchain support is not enabled for this contract` },
    8522: { message: `Invalid walletId` },
    12383: { message: `Sender is not allowed to send messages` },
    17654: { message: `Invalid seqno` },
    48401: { message: `Invalid signature` },
    54515: { message: `Transfer expired` },
}

export class Wallet implements Contract {
    
    static async init(publicKey: bigint, walletId: bigint) {
        return await Wallet_init(publicKey, walletId);
    }
    
    static async fromInit(publicKey: bigint, walletId: bigint) {
        const init = await Wallet_init(publicKey, walletId);
        const address = contractAddress(0, init);
        return new Wallet(address, init);
    }
    
    static fromAddress(address: Address) {
        return new Wallet(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        errors: Wallet_errors
    };
    
    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: Slice | ExternalOperation | WalletOperation) {
        
        let body: Cell | null = null;
        if (message && typeof message === 'object' && message instanceof Slice) {
            body = message.asCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'ExternalOperation') {
            body = beginCell().store(storeExternalOperation(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'WalletOperation') {
            body = beginCell().store(storeWalletOperation(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getSeqno(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('seqno', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    
    async getWalletId(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('walletId', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    
    async getPublicKey(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('publicKey', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    
    async getAllowances(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('allowances', builder.build())).stack;
        let result = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.Bool(), source.readCellOpt());
        return result;
    }
    
}