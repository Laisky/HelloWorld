import "@stdlib/deploy";
import "@stdlib/ownable";
import "./messages.tact";
import "./errcodes.tact";


// SetStaticTaxFee is the message that used to set the static tax fee.
message(0x1509a420) SetStaticTaxFee {
    staticTaxFee: Int;
}


trait Txable with OwnableTransferable {
    owner: Address;
    staticTaxFee: Int = ton("0");

    get fun staticTaxFee(): Int {
        return self.staticTaxFee;
    }

    receive(msg: SetStaticTaxFee){
        nativeThrowUnless(codeUnauthorized, sender() == self.owner);

        self.staticTaxFee = msg.staticTaxFee;
        let answer = beginString()
            .concat("set static tax fee to ")
            .concat(msg.staticTaxFee.toString())
            .toString();
        self.reply(answer.asComment());
    }
}


// Common is the common trait that will be used by the master contract
trait Common with OwnableTransferable {
    owner: Address;
    nonce: Int = 0;

    get fun nonce(): Int {
        return self.nonce;
    }
}

// =====================================
// Main contract
//
// https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md
// =====================================


contract NftCollection with Txable, Deployable {
    owner: Address;
    staticTaxFee: Int = ton("0.01");

    nextItemIndex: Int as uint256 = 0;
    // collectionContent should follow the format of the TEP-64
    // https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md
    collectionContent: Cell;
    // itemContentUrlPrefix is the prefix of the individual NFT's content url.
    // e.g. "https://s3.laisky.com/public/nft/ton-demo/"
    itemContentUrlPrefix: String;
    royalty: RoyaltyParams;

    init(owner: Address,
        collectionContentUrl: String,
        itemContentUrlPrefix: String,
        royalty: RoyaltyParams?) {
        self.owner = owner;
        self.collectionContent = Tep64TokenData{
            flag: 1,
            content: collectionContentUrl,
        }.toCell();
        self.itemContentUrlPrefix = itemContentUrlPrefix;

        if (royalty != null) {
            self.royalty = royalty!!;
        } else {
            self.royalty = RoyaltyParams{
                numerator: 0,
                denominator: 10,
                destination: owner,
            };
        }

        nativeThrowUnless(codeRoyaltyNumInvalid, self.royalty.numerator < self.royalty.denominator);
        nativeThrowUnless(codeRoyaltyNumInvalid, self.royalty.denominator > 0);
    }

    bounced(msg: bounced<Mint>) {}

    // collection's owner can mint NFTs
    receive(msg: Mint) {
        let ctx: Context = context();

        nativeThrowUnless(codeUnauthorized, ctx.sender == self.owner);
        nativeThrowUnless(codeInflowValueNotSufficient, ctx.value >= self.staticTaxFee + msg.forwardAmount);

        self.mint(msg);
    }

    fun mint(msg: Mint){
        let ctx: Context = context();
        let nftItemContract = self.getNftItem(self.nextItemIndex);
        let transferMsg = Transfer {
            queryId: 0,
            newOwner: msg.newOwner,
            responseDestination: sender(),
            customPayload: self.nextItemIndex.toString().asSlice().asCell(),
            forwardAmount: msg.forwardAmount,
            forwardPayload: emptyCell(),
        }.toCell();

        nativeReserve(myBalance() - ctx.value + self.staticTaxFee, ReserveExact);
        send(SendParameters{
                to: contractAddress(nftItemContract),
                value: 0,
                bounce: true,
                mode: SendRemainingBalance,
                body: transferMsg,
                code: nftItemContract.code,
                data: nftItemContract.data,
            });

        self.nextItemIndex = self.nextItemIndex + 1;
    }

    receive(msg: GetRoyaltyParams) {
        send(SendParameters {
            to: sender(),
            value: 0,
            mode: SendRemainingValue,
            bounce: false,
            body: ReportRoyaltyParams{
                queryId: msg.queryId,
                numerator: self.royalty.numerator,
                denominator: self.royalty.denominator,
                destination: self.royalty.destination,
            }.toCell(),
        });
    }

    receive("deposit") {}

    receive(msg: Withdraw) {
        nativeThrowUnless(codeUnauthorized, sender() == self.owner);
        send(SendParameters{
            to: self.owner,
            value: msg.amount,
            bounce: false,
            body: msg.amount.toString().asComment(),
        });
    }

    receive("airdrop") {
        let ctx = context();
        self.mint(Mint{
            newOwner: sender(),
        });
    }

    fun getNftItem(nextItemIndex: Int): StateInit {
        return initOf NftItem(myAddress(), nextItemIndex);
    }

    get fun get_collection_data(): CollectionData {
        return CollectionData{
            nextItemIndex: self.nextItemIndex,
            collectionContent: self.collectionContent,
            ownerAddress: self.owner,
        };
    }

    get fun get_nft_address_by_index(index: Int): Address {
        nativeThrowUnless(codeNftIndexNotExists, index < self.nextItemIndex);
        return contractAddress(self.getNftItem(index));
    }

    get fun get_nft_content(index: Int, individualContent: Cell): Cell {
        return Tep64TokenData{
            flag: 1,
            content: beginString()
                .concat(self.itemContentUrlPrefix)
                .concat(individualContent.asSlice().asString())
                .concat(".json")
                .toString(),
        }.toCell();
    }

    get fun royalty_params(): RoyaltyParams {
        return self.royalty;
    }
}


contract NftItem {
    owner: Address;
    collection: Address;

    itemIndex: Int;
    initialized: Bool = false;
    individualContent: Cell;

    init(collection: Address, itemIndex: Int){
        nativeThrowUnless(codeUnauthorized, sender() == collection);

        self.owner = sender();
        self.collection = collection;
        self.itemIndex = itemIndex;
        self.individualContent = emptyCell();
    }

    bounced(msg: bounced<OwnershipAssigned>) {}
    bounced(msg: bounced<ReportStaticData>) {}
    bounced(msg: Excesses) {}

    receive(msg: Transfer){
        let ctx: Context = context();

        nativeThrowUnless(codeInflowValueNotSufficient, ctx.value >= msg.forwardAmount);
        nativeThrowUnless(codeUnauthorized, ctx.sender == self.owner);

        let prevOwner = self.owner;
        self.owner = msg.newOwner;
        if (self.initialized == false) {
            // only the collection contract can initialize the NFT
            nativeThrowUnless(codeUnauthorized, ctx.sender == self.collection);
            nativeThrowUnless(codeNftCustomPayloadInvalid, msg.customPayload != null);

            self.initialized = true;
            self.individualContent = msg.customPayload!!;
        }

        // forward fee
        if (msg.forwardAmount > 0) {
            send(SendParameters{
                to: msg.newOwner,
                value: msg.forwardAmount,
                bounce: false,
                // mode: SendIgnoreErrors,
                body: OwnershipAssigned{
                    queryId: msg.queryId,
                    prevOwner: prevOwner,
                    forwardPayload: msg.forwardPayload,
                }.toCell(),
            });
        }

        // refund the remaining balance to the responseDestination
        // nativeReserve(myBalance() - ctx.value, ReserveExact);
        nativeReserve(myBalance() - ctx.value, ReserveExact);
        send(SendParameters{
            to: msg.responseDestination,
            value: 0,
            mode: SendRemainingBalance,
            bounce: false,
            body: Excesses{
                queryId: msg.queryId
            }.toCell(),
        });
    }

    receive(msg: GetStaticData){
        let ctx: Context = context();

        send(SendParameters {
            to: ctx.sender,
            value: 0,
            mode: SendRemainingValue,
            bounce: true,
            body: ReportStaticData{
                queryId: msg.queryId,
                index: self.itemIndex,
                collection: self.collection
            }.toCell(),
        });
    }

    receive("deposit") {}

    receive(msg: Withdraw) {
        nativeThrowUnless(codeUnauthorized, sender() == self.owner);
        send(SendParameters{
            to: self.owner,
            value: msg.amount,
            // mode: SendRemainingBalance,
            bounce: false,
            body: msg.amount.toString().asComment(),
        });
    }

    get fun get_nft_data(): GetNftData {
        return GetNftData {
            init: self.initialized,
            index: self.itemIndex,
            collectionAddress: self.collection,
            ownerAddress: self.owner,
            individualContent: self.individualContent
        };
    }
}
