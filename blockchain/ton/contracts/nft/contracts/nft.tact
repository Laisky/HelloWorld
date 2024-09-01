import "@stdlib/deploy";
import "@stdlib/ownable";
import "./messages.tact";
import "./errcodes.tact";


// SetStaticTaxFee is the message that used to set the static tax fee.
message(0x1509a420) SetStaticTaxFee {
    staticTaxFee: Int;
}


trait Txable with Ownable {
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
trait Common with Ownable {
    owner: Address;
    nonce: Int = 0;

    get fun nonce(): Int {
        return self.nonce;
    }
}

// =====================================
// Main contract
// =====================================


contract NftCollection with Txable {
    owner: Address;
    staticTaxFee: Int = ton("0.01");

    nextItemIndex: Int as uint64 = 0;
    // collectionContent should follow the format of the TEP-64
    // https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md
    //
    // in most cases, it should be a url prefix of the NFT's metadata json url.
    // e.g. "https://s3.laisky.com/public/nft/ton-demo/{individualContent}.json"
    collectionContent: Cell;

    init(owner: Address, collectionContent: String){
        self.owner = owner;
        self.collectionContent = collectionContent.asSlice().asCell();
    }

    bounced(msg: bounced<Mint>) {}

    // collection's owner can mint NFTs
    receive(msg: Mint) {
        let ctx: Context = context();

        nativeThrowUnless(codeUnauthorized, ctx.sender == self.owner);
        nativeThrowUnless(codeInflowValueNotSufficient, ctx.value >= self.staticTaxFee);

        let nftItemContract = self.getNftItem(self.nextItemIndex);
        let transferMsg = Transfer {
            queryId: 0,
            newOwner: msg.newOwner,
            responseDestination: myAddress(),
            customPayload: beginString()
                .concat(self.nextItemIndex.toString())
                .concat(".json")
                .toCell(),
            forwardAmount: 0,
            forwardPayload: emptySlice(),
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

    fun getNftItem(nextItemIndex: Int): StateInit {
        return initOf NftItem(myAddress(), nextItemIndex);
    }

    get fun get_collection_data(): CollectionData {
        return CollectionData{
            nextItemIndex: self.nextItemIndex,
            collectionContent: beginString()
                .concat(self.collectionContent.asSlice().asString())
                .concat("collection.json")
                .toCell(),
            ownerAddress: self.owner,
        };
    }

    get fun get_nft_address_by_index(itemIndex: Int): Address {
        nativeThrowUnless(codeNftIndexNotExists, itemIndex < self.nextItemIndex);
        return contractAddress(self.getNftItem(itemIndex));
    }

    get fun get_nft_content(index: Int, individualContent: Cell): Cell {
        return individualContent;
        // return beginString()
        //     .concat(self.collectionContent.asSlice().asString())
        //     .concat(individualContent.asSlice().asString())
        //     .toCell();
        // return beginString()
        //     .concat("{")
        //     .concat("\"description\": \"Laisky's first TON NFT\",")
        //     .concat("\"image\": \"https://ario.laisky.com/alias/head\",")
        //     .concat("\"marketplace\": \"getgems.io\",")
        //     .concat("\"name\": \"Laisky's TON NFT\",")
        //     .concat("\"social_links\": [")
        //     .concat("\"https://twitter.com/LaiskyCai\",")
        //     .concat("\"https://t.me/laiskynotes\"")
        //     .concat("]")
        //     .concat("}")
        //     .toCell();
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

    receive(msg: Transfer){
        let ctx: Context = context();

        nativeThrowUnless(codeInflowValueNotSufficient, ctx.value >= msg.forwardAmount);
        nativeThrowUnless(codeUnauthorized, ctx.sender == self.owner);

        self.owner = msg.newOwner;
        if (self.initialized == false) {
            // only the collection contract can initialize the NFT
            nativeThrowUnless(codeUnauthorized, ctx.sender == self.collection);
            nativeThrowUnless(codeNftCustomPayloadInvalid, msg.customPayload != null);

            self.initialized = true;
            self.individualContent = msg.customPayload!!;
        }

        nativeReserve(myBalance() - ctx.value, ReserveExact);

        // forward fee
        if (msg.forwardAmount > 0) {
            send(SendParameters{
                to: msg.newOwner,
                value: msg.forwardAmount,
                bounce: false,
                body: OwnershipAssigned{
                    queryId: msg.queryId,
                    prevOwner: sender(),
                    forwardPayload: msg.forwardPayload,
                }.toCell(),
            });
        }

        // refund the remaining balance to the responseDestination
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
            bounce: false,
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
            individualContent: beginString()
                .concat("https://s3.laisky.com/public/nft/ton-demo/")
                .concat(self.individualContent.asSlice().asString())
                .toCell(),
        };
    }
}
