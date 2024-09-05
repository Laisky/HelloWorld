import "@stdlib/ownable";
import "./errcodes.tact";
import "./messages.tact";


// This is your custom jetton's master contract.
contract JettonMaster with OwnableTransferable {
    owner: Address;

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
        nativeThrowUnless(codeNotMintable, self.mintable);

        self.totalSupply = self.totalSupply + msg.amount;
        let jettonWallet = self.getJettonContract(msg.receiver);

        // deploy the wallet if it's not deployed yet,
        // then send the minted tokens to the wallet.
        send(SendParameters{
            to: contractAddress(jettonWallet),
            value: 0,
            bounce: false,
            mode: SendRemainingValue,
            body: TokenTransferInternal{
                queryId: 0,
                amount: msg.amount,
                from: myAddress(),
                response_destination: sender(),
                forward_ton_amount: ton("0.03"),
                forward_payload: emptyCell(),
            }.toCell(),
            code: jettonWallet.code,
            data: jettonWallet.data
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

    receive("airdrop") {
        let ctx = context();
        self.mint(Mint{
            amount: ton("1"),
            receiver: sender(),
        });
    }

    // Generate a new jetton wallet contract for any user.
    // This is the standard way to get a contract address.
    // Remember, it only generates the address, not the actual deployment!
    get fun get_jetton_data(): JettonMasterData {
        return JettonMasterData{
            totalSupply: self.totalSupply,
            mintable: self.mintable,
            owner: self.owner,
            content: self.content,
            walletCode: self.getJettonContract(myAddress()).code
        };
    }

    get fun get_wallet_address(owner: Address): Address {
        return contractAddress(self.getJettonContract(owner));
    }
}


contract JettonWallet {
    owner: Address;
    master: Address;
    balance: Int;

    init(master: Address, owner: Address){
        self.balance = 0;
        self.owner = owner;
        self.master = master;
    }

    fun getJettonContract(owner: Address): StateInit {
        return initOf JettonWallet(myAddress(), owner);
    }

    receive(msg: TokenTransfer){
        let ctx: Context = context();
        nativeThrowUnless(codeUnauthorized, ctx.sender == self.owner);
        nativeThrowUnless(codeBalanceNotSufficient, self.balance >= msg.amount);
        nativeThrowUnless(codeInflowValueNotSufficient, ctx.value >= msg.forward_ton_amount);

        self.balance = self.balance - msg.amount;

        // deploy the wallet if it's not deployed yet,
        // then transfer the tokens to the wallet.
        let jettonContract = self.getJettonContract(msg.destination);
        send(SendParameters{
            to: contractAddress(jettonContract),
            value: 0,
            mode: SendRemainingValue,
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

        // return the excess TON to the sender
        nativeReserve(myBalance() - ctx.value + msg.forward_ton_amount, ReserveExact);
        send(SendParameters{
            to: msg.response_destination,
            value: 0,
            bounce: false,
            mode: SendRemainingBalance,
            body: Excesses{queryId: msg.queryId}.toCell(),
        });
    }

    receive(msg: Burn){
        let ctx: Context = context();
        nativeThrowUnless(codeUnauthorized, ctx.sender == self.owner);
        nativeThrowUnless(codeInflowValueNotSufficient, msg.amount >= 0);
        nativeThrowUnless(codeBalanceNotSufficient, self.balance >= msg.amount);

        // Update balance
        self.balance = self.balance - msg.amount;

        nativeReserve(myBalance() - ctx.value, ReserveExact);
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

    bounced(src: bounced<TokenTransferInternal>){
        self.balance = self.balance + src.amount;
    }

    get fun get_wallet_data(): JettonWalletData {
        return JettonWalletData{
            balance: self.balance,
            owner: self.owner,
            master: self.master,
            walletCode: self.getJettonContract(self.owner).code,
        };
    }
}
