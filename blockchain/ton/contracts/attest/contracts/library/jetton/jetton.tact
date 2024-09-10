// =====================================
// https://blog.laisky.com/p/ton-tact/
// =====================================

import "@stdlib/ownable";
import "./errcodes.tact";
import "./messages.tact";


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
trait Common with Txable {
    owner: Address;
    nonce: Int = 0;
    staticTaxFee: Int = ton("0.01");

    get fun nonce(): Int {
        return self.nonce;
    }

    fun checkAndUpdateNonce(receivedNonce: Int){
        nativeThrowUnless(codeNonceInvalid, receivedNonce > self.nonce);
        self.nonce = receivedNonce;
    }

    fun getNonce(): Int {
        self.nonce = self.nonce + 1;
        return self.nonce;
    }
}

// =====================================
// Main contract
//
// https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md
// =====================================


// This is your custom jetton's master contract.
contract JettonMaster with Txable {
    owner: Address;
    staticTaxFee: Int as coins = ton("0.01");

    // Cell to store arbitrary data related to the jetton
    //
    // https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#jetton-metadata-example-offchain
    content: Cell;
    // Total number of tokens in existence.
    totalSupply: Int as coins;
    mintable: Bool;

    init(owner: Address, contentUrl: String){
        self.owner = owner;

        self.content = Metadata{
            flag: 1,
            content: contentUrl,
        }.toCell();
        self.totalSupply = 0;
        self.mintable = true;
    }

    fun getJettonContract(owner: Address): StateInit {
        return initOf JettonWallet(myAddress(), owner);
    }

    // this is a non-standard method, it's used to mint new tokens to specified user.
    receive(msg: Mint){
        let ctx: Context = context();
        // This is my personal preference: I think nativeThrowUnless more useful
        // than require because it lets you customize the code.
        nativeThrowUnless(codeUnauthorized, ctx.sender == self.owner);

        self.mint(msg);
    }

    fun mint(msg: Mint){
        let ctx = context();
        nativeThrowUnless(codeNotMintable, self.mintable);
        nativeThrowUnless(codeInflowValueNotSufficient, ctx.value >= msg.forwardTonAmount);

        self.totalSupply = self.totalSupply + msg.amount;
        let jettonWallet = self.getJettonContract(msg.receiver);

        // deploy the wallet if it's not deployed yet,
        // then send the minted tokens to the wallet.
        nativeReserve(myBalance() - ctx.value + self.staticTaxFee, ReserveExact);
        send(SendParameters{
            to: contractAddress(jettonWallet),
            value: 0,
            bounce: false,
            mode: SendRemainingBalance,
            body: TokenTransferInternal{
                queryId: 0,
                amount: msg.amount,
                from: myAddress(),
                response_destination: sender(),
                forward_ton_amount: msg.forwardTonAmount,
                forward_payload: emptyCell(),
            }.toCell(),
            code: jettonWallet.code,
            data: jettonWallet.data
        });
    }

    // this is a non-standard method, it's used to mint new tokens to multiple users.
    receive(msg: MultiMint){
        let ctx: Context = context();
        nativeThrowUnless(codeNotMintable, self.mintable);
        nativeThrowUnless(codeUnauthorized, ctx.sender == self.owner);

        let totalTonAmount: Int = 0;
        let i: Int = 0;
        while (i < msg.receiverCount) {
            let receiver = msg.receivers.get(i);
            nativeThrowUnless(codeMapIndexNotExists, receiver != null);

            self.totalSupply = self.totalSupply + receiver!!.amount;
            totalTonAmount = totalTonAmount + receiver!!.tonAmount;

            let jettonWallet = self.getJettonContract(receiver!!.address);
            send(SendParameters{
                to: contractAddress(jettonWallet),
                value: receiver!!.tonAmount,
                bounce: false,
                body: TokenTransferInternal{
                    queryId: 0,
                    amount: receiver!!.amount,
                    from: myAddress(),
                    response_destination: sender(),
                    forward_ton_amount: 0,
                    forward_payload: emptyCell(),
                }.toCell(),
                code: jettonWallet.code,
                data: jettonWallet.data
            });

            i = i + 1;
        }

        nativeThrowUnless(codeInflowValueNotSufficient, ctx.value >= totalTonAmount);

        // refund
        nativeReserve(myBalance() - ctx.value + self.staticTaxFee, ReserveExact);
        send(SendParameters{
            to: sender(),
            value: 0,
            bounce: false,
            mode: SendRemainingBalance,
            body: Excesses{queryId: 0}.toCell(),
        });
    }

    // this is a non-standard method, it's used to deposit coins to the wallet.
    receive("deposit") {}

    // this is a non-standard method,
    // allows the owner to withdraw tokens from the wallet.
    receive(msg: Withdraw){
        let ctx: Context = context();
        nativeThrowUnless(codeUnauthorized, ctx.sender == self.owner);
        nativeThrowUnless(codeInflowValueNotSufficient, msg.remain >= 0);
        nativeThrowUnless(codeBalanceNotSufficient, myBalance() >= msg.remain);

        nativeReserve(msg.remain, ReserveExact);
        send(SendParameters{
            to: self.owner,
            value: 0,
            mode: SendRemainingBalance,
            bounce: false,
            body: "withdraw".asComment(),
        });
    }

    // this is a non-standard method, it's used by some experimental projects.
    receive("airdrop") {
        let ctx = context();

        self.mint(Mint{
            amount: ton("1"),
            receiver: sender(),
            forwardTonAmount: ton("0"),
        });
    }

    // this is a TEP-074 standard getter method
    get fun get_jetton_data(): JettonMasterData {
        return JettonMasterData{
            totalSupply: self.totalSupply,
            mintable: self.mintable,
            owner: self.owner,
            content: self.content,
            walletCode: self.getJettonContract(myAddress()).code
        };
    }

    // this is a TEP-074 standard getter method,
    // generate the jetton wallet address for any user.
    get fun get_wallet_address(owner: Address): Address {
        return contractAddress(self.getJettonContract(owner));
    }
}


contract JettonWallet with Txable {
    // owner is the address of the user who owns the wallet.
    owner: Address;
    // master is the address of the master contract that deployed this wallet.
    master: Address;
    // balance is the number of tokens that the wallet currently holds.
    // unlike the centralized ledger of Ethereum Tokens,
    // TON users keep track of the number of tokens they own in their own wallets.
    balance: Int;
    // staticTaxFee is the fee that will be charged for each transaction.
    staticTaxFee: Int as coins = ton("0.01");

    // The parameters of the init function should not be too complex,
    // as it will be called frequently when generating the jetton wallet address.
    init(master: Address, owner: Address){
        self.balance = 0;
        self.owner = owner;
        self.master = master;
    }

    fun getJettonContract(owner: Address): StateInit {
        return initOf JettonWallet(self.master, owner);
    }

    bounced(src: bounced<TokenTransferInternal>){
        self.balance = self.balance + src.amount;
    }

    // this is a TEP-074 standard receiver method,
    // owner can transfer tokens to another jetton wallet
    // by sending TokenTransfer message to the contract.
    receive(msg: TokenTransfer){
        let ctx: Context = context();
        nativeThrowUnless(codeUnauthorized, ctx.sender == self.owner);
        nativeThrowUnless(codeBalanceNotSufficient, self.balance >= msg.amount);
        nativeThrowUnless(codeInflowValueNotSufficient, ctx.value >= msg.forward_ton_amount);

        self.balance = self.balance - msg.amount;

        // deploy the wallet if it's not deployed yet,
        // then transfer the tokens to the wallet.
        nativeReserve(myBalance() - ctx.value + self.staticTaxFee, ReserveExact);
        let jettonContract = self.getJettonContract(msg.destination);
        send(SendParameters{
            to: contractAddress(jettonContract),
            value: 0,
            mode: SendRemainingBalance,
            // amount could be negative, it is impossible to pre-confirm whether
            // the receiver has enough balance to cover the negative amount,
            // which means the transfer may fail. If that happens,
            // the contract's balance must be adjusted using a bounced message.
            bounce: true,
            body: TokenTransferInternal{
                queryId: msg.queryId,
                amount: msg.amount,
                from: self.owner,
                response_destination: msg.response_destination,
                forward_ton_amount: msg.forward_ton_amount,
                forward_payload: msg.forward_payload
            }.toCell(),
            code: jettonContract.code,
            data: jettonContract.data
        });
    }

    // this is unspecified by standard, but suggested format of internal message.
    // receive tokens from another jetton wallet
    receive(msg: TokenTransferInternal){
        let ctx: Context = context();

        // only the owner or another jetton wallet can send TokenTransferInternal
        if (ctx.sender != self.master) {
            let peerJettonContractAddr = contractAddress(self.getJettonContract(msg.from));
            nativeThrowUnless(codeUnauthorized, ctx.sender == peerJettonContractAddr);
        }

        nativeThrowUnless(codeInflowValueNotSufficient, self.balance + msg.amount >= 0);
        nativeThrowUnless(codeInflowValueNotSufficient, ctx.value > msg.forward_ton_amount);

        // Update balance
        self.balance = self.balance + msg.amount;

        // send TransferNotification only if forward_ton_amount > 0
        if (msg.forward_ton_amount > 0) {
            send(SendParameters{
                to: msg.response_destination,
                value: msg.forward_ton_amount,
                bounce: false,
                // mode: SendIgnoreErrors,
                body: TransferNotification{
                    queryId: msg.queryId,
                    amount: msg.amount,
                    sender: msg.from,
                    forward_payload: msg.forward_payload
                }.toCell()
            });
        }

        // refund the excess TON to the sender.
        //
        // using the SendRemainingBalance mode will transfer all balances
        // that are not locked by nativeReserve.
        // https://docs.tact-lang.org/ref/core-advanced#nativereserve
        nativeReserve(myBalance() - ctx.value + self.staticTaxFee, ReserveExact);
        send(SendParameters{
            to: msg.response_destination,
            value: 0,
            bounce: false,
            mode: SendRemainingBalance,
            body: Excesses{queryId: msg.queryId}.toCell(),
        });
    }

    // this is a TEP-074 standard receiver method
    receive(msg: Burn){
        let ctx: Context = context();
        nativeThrowUnless(codeUnauthorized, ctx.sender == self.owner);
        nativeThrowUnless(codeInflowValueNotSufficient, msg.amount >= 0);
        nativeThrowUnless(codeBalanceNotSufficient, self.balance >= msg.amount);

        // Update balance
        self.balance = self.balance - msg.amount;

        nativeReserve(myBalance() - ctx.value + self.staticTaxFee, ReserveExact);
        send(SendParameters{
            to: sender(),
            value: 0,
            mode: SendRemainingBalance,
            bounce: true,
            body: Excesses{
                queryId: msg.queryId
            }.toCell(),
        });
    }

    receive("deposit") {}

    // this is a non-standard method,
    // allows the owner to withdraw tokens from the wallet.
    receive(msg: Withdraw){
        let ctx: Context = context();
        nativeThrowUnless(codeUnauthorized, ctx.sender == self.owner);
        nativeThrowUnless(codeInflowValueNotSufficient, msg.remain >= 0);
        nativeThrowUnless(codeBalanceNotSufficient, myBalance() >= msg.remain);

        nativeReserve(msg.remain, ReserveExact);
        send(SendParameters{
            to: self.owner,
            value: 0,
            mode: SendRemainingBalance,
            bounce: false,
            body: "withdraw".asComment(),
        });
    }

    // this is a TEP-074 standard getter method
    get fun get_wallet_data(): JettonWalletData {
        return JettonWalletData{
            balance: self.balance,
            owner: self.owner,
            master: self.master,
            walletCode: self.getJettonContract(self.owner).code,
        };
    }
}
