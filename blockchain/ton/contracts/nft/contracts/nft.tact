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
    staticTaxFee: Int = ton("0.02");

    nextItemIndex: Int as uint64 = 0;
    // collectionContent should follow the format of the TEP-64
    // https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md
    //
    // in most cases, it should be a url prefix of the NFT's metadata json url.
    // e.g. "https://s3.laisky.com/public/nft/ton-demo/{individualContent}.json"
    collectionContent: Cell;

    init(owner: Address, collectionContent: Cell){
        self.owner = owner;
        self.collectionContent = collectionContent;
    }

    bounced(msg: bounced<Mint>) {}

    // collection's owner can mint NFTs
    receive(msg: Mint) {
        let ctx: Context = context();

        nativeThrowUnless(codeUnauthorized, ctx.sender == self.owner);

        let nftItemContract = self.getNftItem(self.nextItemIndex);
        let customPayload = msg.individualContent;
        if (customPayload == null) {
            customPayload = self.collectionContent;
        }

        let transferMsg = Transfer {
            queryId: 0,
            newOwner: msg.newOwner,
            responseDestination: myAddress(),
            customPayload: customPayload,
            forwardAmount: 0,
            forwardPayload: emptySlice(),
        }.toCell();

        nativeReserve(myBalance() - ctx.value, ReserveExact);
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

        emit(transferMsg);
    }

    receive("deposit") {}

    receive(msg: Withdraw) {
        nativeThrowUnless(codeUnauthorized, sender() == self.owner);
        send(SendParameters{
            to: self.owner,
            value: msg.amount,
            bounce: false,
            body: beginString().concat("withdraw ").concat(msg.amount.toString()).toString().asComment(),
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

    get fun get_nft_address_by_index(itemIndex: Int): Address {
        nativeThrowUnless(codeNftIndexNotExists, itemIndex < self.nextItemIndex);
        return contractAddress(self.getNftItem(itemIndex));
    }

    get fun get_nft_content(index: Int, individualContent: Cell): Cell {
        return beginString()
            .concat(self.collectionContent.asSlice().asString())
            .concat(individualContent.asSlice().asString())
            .concat(".json").toCell();
    }
}

contract NftItem {
    owner: Address;
    collection: Address;

    nextItemIndex: Int;
    initialized: Bool;
    individualContent: Cell;

    init(collection: Address, nextItemIndex: Int){
        nativeThrowUnless(codeUnauthorized, sender() == collection);

        self.collection = collection;
        self.nextItemIndex = nextItemIndex;
        self.initialized = false;
    }

    // https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md#1-transfer
    receive(msg: Transfer){
        let ctx: Context = context();
        let msgValue: Int = self.msgValue(ctx.value);

        if (self.initialized == false) {
            nativeThrowUnless(codeUnauthorized, ctx.sender == self.collection);

            self.initialized = true;
            self.owner = msg.newOwner;
            self.individualContent = msg.customPayload;

            send(SendParameters{
                to: msg.responseDestination!!,
                value: msgValue,
                mode: SendPayGasSeparately,
                body: Excesses { queryId: msg.queryId }.toCell()
            });
        } else {
            require(ctx.sender == self.owner!!, "not owner");
            self.owner = msg.newOwner;  // change current owner to the newOwner
            if (msg.forwardAmount > 0) {
                send(SendParameters{
                    to: msg.newOwner,
                    value: msg.forwardAmount,
                    mode:  SendPayGasSeparately,
                    bounce: true,
                    body: OwnershipAssigned{
                        queryId: msg.queryId,
                        prev_owner: ctx.sender,
                        forwardPayload: msg.forwardPayload
                    }.toCell()
                });
            }

            msgValue = msgValue - ctx.readForwardFee();
            if (msg.responseDestination != null) {
                send(SendParameters{
                    to: msg.responseDestination!!,
                    value: msgValue - msg.forwardAmount,
                    mode: SendPayGasSeparately,
                    bounce: true,
                    body: Excesses { queryId: msg.queryId }.toCell()
                });
            }
        }
    }

    receive(msg: GetStaticData){
        let ctx: Context = context();
        send(SendParameters {
            to: ctx.sender,
            value: 0,
            mode: 64,  // (return msg amount except gas fees)
            bounce: true,
            body: ReportStaticData{
                queryId: msg.queryId,
                index_id: self.nextItemIndex,
                collection: self.collection
            }.toCell()
        });
    }

    fun msgValue(value: Int): Int {
        let tonBalanceBeforeMsg: Int = myBalance() - value;
        let storageFee: Int = minTonsForStorage - min(tonBalanceBeforeMsg, minTonsForStorage);
        return value - (storageFee + gasConsumption);
    }

    // --------- Get Function  --------- //
    get fun get_nft_data(): GetNftData {
        let b: StringBuilder = beginString();
        let collectionData: String = (self.individualContent!!).asSlice().asString();
        b.append(collectionData);
        b.append(self.nextItemIndex.toString());
        b.append(".json");

        return GetNftData {
            initialized: self.initialized,
            index: self.nextItemIndex,
            collection: self.collection,
            owner: self.owner!!,
            individualContent: b.toCell()
        };
    }
}
