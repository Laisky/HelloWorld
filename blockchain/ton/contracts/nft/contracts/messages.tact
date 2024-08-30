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

message(0x5fcc3d14) Transfer {
    queryId: Int as uint64;
    newOwner: Address;
    responseDestination: Address?;
    customPayload: Cell?;
    forwardAmount: Int as coins;
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
    indexId: Int;
    collection: Address;
}

// -------------------------------------
// Non-standard messages
// -------------------------------------

message(0xa32a5c5f) Mint {
    newOwner: Address;
    individualContent: Cell?;
}

message(0x4ca83dc8) Withdraw {
    amount: Int as coins;
}

// =====================================
// Logs
// =====================================

message LogEventMintRecord {
    minter: Address;
    itemId: Int;
    generate_number: Int;
}

// =====================================
// Responsed structures
// =====================================

struct GetNftData {
    initialized: Bool;
    index: Int;
    collectionAddress: Address;
    ownerAddress: Address;
    individualContent: Cell;
}

struct CollectionData {
    nextItemIndex: Int;
    collectionContent: Cell;
    ownerAddress: Address;
}

struct RoyaltyParams {
    numerator: Int;
    denominator: Int;
    destination: Address;
}
