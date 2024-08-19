import "@stdlib/deploy";
import "@stdlib/ownable";
message RegisterBot {
    manifest_url: String;
}

// this is the master contract of TON.
contract Attest with Deployable, Ownable {
    owner: Address;

    init(){
        self.owner = sender();
    }

    // create AttestWallet for the sender
    receive(msg: RegisterBot){
        let walletInit: StateInit = self.getWalletInit(sender(), msg.manifest_url);
        let walletAddr: Address = contractAddress(walletInit);
        send(SendParameters{to: walletAddr, value: 0, bounce: false, mode: SendRemainingValue});
    }

    fun getWalletInit(walletOwner: Address, manifest_url: String): StateInit {
        return initOf AttestWallet(myAddress(), walletOwner, manifest_url);
    }
}

contract AttestWallet with Ownable {
    owner: Address;
    master: Address;
    manifest_url: String;

    init(master: Address, owner: Address, manifest_url: String){
        self.master = master;
        self.owner = owner;
        self.manifest_url = manifest_url;
    }
}
