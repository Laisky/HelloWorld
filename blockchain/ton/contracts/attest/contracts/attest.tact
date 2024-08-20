import "@stdlib/deploy";
import "@stdlib/ownable";


message RegisterBot {
    manifest_url: String;
}

message SetWalletManifest {
    manifest_url: String;
}

message WalletInfo {
    manifest_url: String;
    owner: Address;
    master: Address;
}

message WalletManifestChangedEvent {
    old_manifest_url: String;
    new_manifest_url: String;
}

message WalletCreatedEvent {
    wallet: Address;
    owner: Address;
}

message WalletWithdraw {
}

// this is the master contract of TON.
contract Attest with Deployable, Ownable {
    owner: Address;
    init(){
        self.owner = sender();
    }

    // create AttestWallet for the sender
    receive(msg: RegisterBot){
        let walletInit: StateInit = self.getWalletInit(sender());
        let walletAddr: Address = contractAddress(walletInit);

        send(SendParameters{
                to: walletAddr,
                value: 0,
                bounce: false,
                mode: SendRemainingValue,
                body: SetWalletManifest{manifest_url: msg.manifest_url}.toCell(),
                code: walletInit.code,
                data: walletInit.data
            });

    }

    fun getWalletInit(walletOwner: Address): StateInit {
        return initOf AttestWallet(myAddress(), walletOwner);
    }

    receive(msg: SetWalletManifest) {
        let walletInit: StateInit = self.getWalletInit(sender());
        let walletAddr: Address = contractAddress(walletInit);

        send(SendParameters{
            to: walletAddr,
            value: 0,
            bounce: false,
            mode: SendRemainingValue,
            body: SetWalletManifest{manifest_url: msg.manifest_url}.toCell(),
        });
    }
}

contract AttestWallet with Ownable {
    owner: Address;
    master: Address;
    manifest_url: String = "";

    init(master: Address, owner: Address){
        self.master = master;
        self.owner = owner;
    }

    receive(msg: SetWalletManifest){
        require(self.master == sender(), "Only master can set manifest");

        emit(WalletManifestChangedEvent{
            old_manifest_url: self.manifest_url,
            new_manifest_url: msg.manifest_url
        }.toCell());

        self.manifest_url = msg.manifest_url;
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

    get fun manifest_url(): String {
        return self.manifest_url;
    }
}
