// =====================================
// Received messages
// =====================================

// -------------------------------------
// NFT standard messages
// -------------------------------------

message(0x693d3950) GetRoyaltyParams {
    queryId: Int as uint64;
}

message(0xa8cb00ad) ReportRoyaltyParams {
    queryId: Int as uint64;
    numerator: Int as uint16;
    denominator: Int as uint16;
    destination: Address;
}

// https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#1-transfer
message(0x5fcc3d14) Transfer {
    queryId: Int as uint64;
    // newOwner is address of the new owner of the NFT item.
    newOwner: Address;
    // responseDestination is the address where to send a response
    // with confirmation of a successful transfer and the rest of
    // the incoming message coins.
    responseDestination: Address;
    // customPayload is the optional custom data.
    customPayload: Cell?;
    // forwardAmount is the amount of nanotons to be sent to the new owner.
    forwardAmount: Int as uint16;
    // forwardPayload is the optional custom data that should be
    // sent to the new owner.
    forwardPayload: Slice as remaining;
}

message(0x05138d91) OwnershipAssigned {
    queryId: Int as uint64;
    prevOwner: Address;
    forwardPayload: Slice as remaining;
}

message(0xd53276db) Excesses {
    queryId: Int as uint64;
}

message(0x2fcb26a2) GetStaticData {
    queryId: Int as uint64;
}

message(0x8b771735) ReportStaticData {
    queryId: Int as uint64;
    index: Int;
    collection: Address;
}

// -------------------------------------
// Non-standard messages
// -------------------------------------

message(0xa32a5c5f) Mint {
    newOwner: Address;
}

message(0x4ca83dc8) Withdraw {
    amount: Int as coins;
}

// =====================================
// Logs
// =====================================


// =====================================
// Responsed structures
// =====================================

struct GetNftData {
    init: Bool;
    index: Int;
    collectionAddress: Address;
    ownerAddress: Address;
    individualContent: Cell;
}

struct CollectionData {
    nextItemIndex: Int;
    collectionContent: Cell;
    ownerAddress: Slice;
}

// https://github.com/ton-blockchain/TEPs/blob/master/text/0066-nft-royalty-standard.md#get-methods
struct RoyaltyParams {
    numerator: Int;
    denominator: Int;
    destination: Address;
}
