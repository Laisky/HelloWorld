message WalletOperation {
    signature: Slice as bytes64;
    operation: Slice as remaining;
}

message ExternalOperation  {
    operation: Slice as remaining;
}

contract Wallet {

    publicKey: Int as uint256;
    seqno: Int as uint64;
    walletId: Int as uint64;
    allowances: map<Address, Bool>;

    init(publicKey: Int, walletId: Int) {
        self.publicKey = publicKey;
        self.seqno = 0;
        self.walletId = walletId;
    }

    fun processTransfer(msg: WalletOperation, external: Bool) {

        // Check Signature
        let op_hash: Int = msg.operation.hash();
        require(checkSignature(op_hash, msg.signature, self.publicKey), "Invalid signature");

        // Check parameters
        // NOTE: Using manual parsing because we don't need tact level typesafety here
        //       instead we need to be able to hash message without double-serialization
        //       for signature check
        let pkg: Slice = msg.operation;
        let timeout: Int = pkg.loadInt(32);
        let seqno: Int = pkg.loadInt(32);
        let walletId: Int = pkg.loadInt(64);
        require(seqno == self.seqno, "Invalid seqno");
        require(walletId == self.walletId, "Invalid walletId");
        require(now() < timeout, "Transfer expired");

        // Accept message
        if (external) {
            acceptMessage();
        }

        // Increment seqno
        self.seqno = (self.seqno + 1);

        // Commit state for reply protection
        commit();

        // Process operation
        self.processOperation(pkg);
    }

    fun processOperation(pkg: Slice) {
        let mode: Int = pkg.loadUint(8); // Operation type
        if (mode == 0) { // Multiop
            while(pkg.refs() > 0) {
                self.processOperation(pkg.loadRef().beginParse());
            }
        } else if (mode == 1) {
            self.sendTransfer(pkg);
        } else if (mode == 2) {
            self.allowances.set(pkg.loadAddress(), true);
        } else if (mode == 3) {
            self.allowances.set(pkg.loadAddress(), null);
        }
    }

    fun sendTransfer(transfer: Slice) {
        while(transfer.refs() > 0) {
            let mode: Int = transfer.loadInt(8);
            let body: Cell = transfer.loadRef();
            nativeSendMessage(body, mode);
        }
    }

    receive(msg: Slice) {
        // Fallback
    }

    receive(msg: ExternalOperation) {
        require(self.allowances.get(sender()) == true, "Sender is not allowed to send messages");
        self.processOperation(msg.operation);
    }

    receive(msg: WalletOperation) {
        self.processTransfer(msg, false);
    }

    external(msg: WalletOperation) {
        self.processTransfer(msg, true);
    }

    get fun seqno(): Int {
        return self.seqno;
    }

    get fun walletId(): Int {
        return self.walletId;
    }

    get fun publicKey(): Int {
        return self.publicKey;
    }

    get fun allowances(): map<Address, Bool> {
        return self.allowances;
    }
}