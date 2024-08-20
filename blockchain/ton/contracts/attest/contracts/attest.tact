import "@stdlib/deploy";
import "@stdlib/ownable";


message RegisterBot {
    manifestUrl: String;
}

message SetWalletManifest {
    nonce: Int as uint32;
    manifestUrl: String;
}

message WalletInfo {
    manifestUrl: String;
    owner: Address;
    master: Address;
}

message WalletManifestChangedEvent {
    oldManifestUrl: String;
    newManifestUrl: String;
}

message WalletCreatedEvent {
    wallet: Address;
    owner: Address;
}

message WalletWithdraw {
}

message SubmitAttestTask {
    nonce: Int as uint32;
    proofUrl: String;
    subscribers: map<Int, Address>;
    subscribersLength: Int;
}

// this is the master contract of TON.
contract Attest with Deployable, Ownable {
    owner: Address;
    setManifestNounce: map<Address, Int as uint32> = emptyMap();

    init(){
        self.owner = sender();
    }

    // create AttestWallet for the sender
    receive(msg: RegisterBot){
        let walletInit: StateInit = self.getWalletInit(sender());
        let walletAddr: Address = contractAddress(walletInit);
        let nonce = self.getManifestNonce(walletAddr);

        send(SendParameters{
                to: walletAddr,
                value: 0,
                bounce: false,
                mode: SendRemainingValue,
                body: SetWalletManifest{
                    nonce: nonce,
                    manifestUrl: msg.manifestUrl
                    }.toCell(),
                code: walletInit.code,
                data: walletInit.data
            });

        self.setManifestNounce.set(walletAddr, nonce + 1);

    }

    fun getWalletInit(walletOwner: Address): StateInit {
        return initOf AttestWallet(myAddress(), walletOwner);
    }

    fun getManifestNonce(walletOwner: Address): Int {
        let nonce: Int = 0;
        if (self.setManifestNounce.get(sender()) != null) {
            nonce = self.setManifestNounce.get(sender())!!;
        }
        return nonce;
    }

    receive(msg: SetWalletManifest) {
        let walletInit: StateInit = self.getWalletInit(sender());
        let walletAddr: Address = contractAddress(walletInit);
        let nonce = self.getManifestNonce(walletAddr);

        send(SendParameters{
            to: walletAddr,
            value: 0,
            bounce: false,
            mode: SendRemainingValue,
            body: SetWalletManifest{
                nonce: nonce,
                manifestUrl: msg.manifestUrl
            }.toCell(),
        });

        self.setManifestNounce.set(walletAddr, nonce + 1);
    }
}

contract AttestWallet with Ownable {
    owner: Address;
    master: Address;
    manifestUrl: String = "";
    manifestNonce: Int as uint32 = 0;

    init(master: Address, owner: Address){
        self.master = master;
        self.owner = owner;
    }

    receive(msg: SetWalletManifest){
        require(self.master == sender(), "Only master can set manifest");
        require(msg.nonce == self.manifestNonce, "Nonce not match");

        emit(WalletManifestChangedEvent{
            oldManifestUrl: self.manifestUrl,
            newManifestUrl: msg.manifestUrl
        }.toCell());

        self.manifestUrl = msg.manifestUrl;
        self.manifestNonce = self.manifestNonce + 1;
    }

    receive(msg: WalletWithdraw){
        require(self.owner == sender(), "Only master can withdraw");

        send(SendParameters{
            to: sender(),
            value: myBalance() - context().value - ton("0.01"),
            bounce: false,
            mode: SendRemainingValue
        });
    }

    get fun master(): String {
        return self.master.toString();
    }

    get fun manifestUrl(): String {
        return self.manifestUrl;
    }
}
