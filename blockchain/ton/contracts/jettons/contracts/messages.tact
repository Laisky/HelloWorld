// =====================================
// Standard Jettom messages
//
// https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md
// =====================================
message(0xf8a7ea5) TokenTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    response_destination: Address;
    custom_payload: Cell?;
    forward_ton_amount: Int as coins;
    forward_payload: Slice as remaining; // Comment Text message when Transfer the jetton
}

message(0x178d4519) TokenTransferInternal {
    queryId: Int as uint64;
    amount: Int as coins;
    from: Address;
    response_destination: Address;
    forward_ton_amount: Int as coins;
    forward_payload: Slice as remaining; // Comment Text message when Transfer the jetton
}

message(0x7362d09c) TransferNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    from: Address;
    forward_payload: Slice as remaining; // Comment Text message when Transfer the jetton
}

message(0x59f07bc) Burn {
    queryId: Int as uint64;
    amount: Int as coins;
    response_destination: Address;
    custom_payload: Cell?;
}

message(0x7bdd97de) TokenBurnNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    // the owner property seems redundant,
    // the owner can be extracted from the sender of the message.
    owner: Address;
    response_destination: Address?;
}

message(0xd53276db) Excesses {
    queryId: Int as uint64;
}

// =====================================
// Project specific messages
// =====================================
// Mint is a message that allows the owner to mint new tokens
// and send them to a specified walletOwner.
message(0xa32a5c5f) Mint {
    amount: Int;
    receiver: Address;
}

// Withdraw is a message that allows the owner to withdraw tokens from the wallet.
message(0x4ca83dc8) Withdraw {
    amount: Int;
}

message(0x6f08b23c) TokenUpdateContent {
    contentUrl: String;
}

// =====================================
// Structs
// =====================================
struct JettonWalletData {
    balance: Int;
    owner: Address;
    master: Address;
    walletCode: Cell;
}

struct JettonMasterData {
    totalSupply: Int;
    mintable: Bool;
    owner: Address;
    content: Cell;
    walletCode: Cell;
}

struct Metadata {
    // https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#content-representation
    // 0 for onchain, 1 for offchain
    flag: Int as uint8;
    // if flag is 1, then the content is a URL to the offchain metadata.
    content: String;
}
