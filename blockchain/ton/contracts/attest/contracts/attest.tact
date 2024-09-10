import "@stdlib/deploy";
import "@stdlib/ownable";
import "@stdlib/stoppable";
import "./errcodes.tact";
import "./messages.tact";


const MinimalOracleStakeValue: Int = ton("0.01");

// =====================================
// Some utility functions
// =====================================


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
// Master Contract
// =====================================

// this is the master contract of TON.
contract Attest with Common {
    owner: Address;
    nonce: Int as uint64 = 0;
    staticTaxFee: Int as coins = ton("0.01");
    lockedValue: Int as coins = ton("0");

    init(){
        self.owner = sender();
    }

    fun reserveValue(delta: Int) {
        let ctx = context();
        let val = max(myBalance() - ctx.value + self.staticTaxFee, self.lockedValue + self.staticTaxFee);
        nativeReserve(val + delta, ReserveExact);
    }

    receive("deposit") {}

    // create bot contract for the sender,
    // all remaining value will be sent to the bot contract.
    receive(msg: RegisterBot){
        let ctx = context();

        msg.botOwner = sender();

        let bot = self.getBot(sender());
        let botAddr = contractAddress(bot);

        // deploy bot contract and send the manifest to the bot
        self.reserveValue(0);
        send(SendParameters{
                to: botAddr,
                value: 0,
                mode: SendRemainingBalance,
                bounce: false,
                body: SetBotManifest{
                    queryId: msg.queryId,
                    nonce: self.getNonce(),
                    manifestUrl: msg.manifestUrl,
                    responseDestination: msg.responseDestination,
                }.toCell(),
                code: bot.code,
                data: bot.data
            }
        );
    }

    // create oracle contract for the sender,
    // all remaining value will be sent to the oracle contract.
    receive(msg: RegisterOracle){
        let ctx = context();

        nativeThrowUnless(codeInflowValueNotSufficient, ctx.value >= self.staticTaxFee + msg.stakeValue);
        nativeThrowUnless(codeStakeValueNotSufficient, msg.stakeValue >= MinimalOracleStakeValue);

        msg.oracleOwner = sender();

        let oracle = self.getOracle(sender());
        let oracleAddr = contractAddress(oracle);

        // deploy oracle contract
        self.reserveValue(0);
        send(SendParameters{
                to: oracleAddr,
                value: 0,
                mode: SendRemainingBalance,
                bounce: false,
                body: SetOracleManifest{
                    queryId: msg.queryId,
                    nonce: self.getNonce(),
                    manifestUrl: msg.manifestUrl,
                    responseDestination: msg.responseDestination,
                }.toCell(),
                code: oracle.code,
                data: oracle.data
            }
        );
    }

    // publish attest task
    receive(msg: PublishAttestTask){
        let ctx = context();

        // verify sender is the owner of the bot
        let bot = self.getBot(msg.botOwner);
        let botAddr = contractAddress(bot);

        nativeThrowUnless(codeSenderAddressInvalid, botAddr == sender());
        nativeThrowUnless(codeInflowValueNotSufficient, ctx.value >= msg.attestValue + self.staticTaxFee);

        // publish the attest task via emit.
        // the task will be picked by the distributed verifier oracle.
        emit(msg.toCell());

        // refund the rest value to the bot
        self.reserveValue(0);
        send(SendParameters{
                to: msg.botOwner,
                value: 0,
                mode: SendRemainingBalance,
                bounce: false,
                body: Excesses{
                    queryId: msg.queryId,
                }.toCell()
            }
        );
    }

    receive("withdraw"){
        nativeThrowUnless(codeUnauthorized, sender() == self.owner);

        nativeReserve(self.staticTaxFee, ReserveExact);
        send(SendParameters{
                to: sender(),
                value: 0,
                bounce: false,
                mode: SendRemainingBalance,
                body: Excesses{
                    queryId: 0,
                }.toCell()
            }
        );
    }

    fun getBot(owner: Address): StateInit {
        return initOf Bot(myAddress(), owner);
    }

    fun getOracle(owner: Address): StateInit {
        return initOf Oracle(myAddress(), owner);
    }
}

// Bot is the wallet contract, will be deployed by the master contract
// to every submiter/bot. wallet contract will take the responsibility of
// storing the manifest and the attest task.
contract Bot with Common {
    owner: Address;
    nonce: Int as uint64 = 0;
    staticTaxFee: Int as coins = ton("0");
    master: Address;
    manifestUrl: String = "";
    // attestTaskIncentives is the balance of the attest task,
    // the key is the task id, the value is the incentive of the task.
    attestTaskIncentives: map<Int as uint64, Int> = emptyMap();
    // lockedValue is the value that is locked in the contract, cannot be withdrawed.
    // To ensure there is enough rent, a deposit of at least 1 TON is necessary.
    lockedValue: Int as coins = ton("0");
    emitFee: Int as coins = ton("0.01");
    attestTaskId: Int as uint64 = 0;

    init(master: Address, owner: Address){
        let ctx = context();
        nativeThrowUnless(codeBalanceNotSufficient, myBalance() >= self.lockedValue);

        self.master = master;
        self.owner = owner;
    }

    fun reserveValue(delta: Int) {
        let ctx = context();
        let val = max(myBalance() - ctx.value + self.staticTaxFee, self.lockedValue + self.staticTaxFee);
        nativeReserve(val + delta, ReserveExact);
    }

    bounced(msg: bounced<PublishAttestTask>) {}

    // receive deposit or refund
    receive("deposit") {}

    // master can set manifest of Bot
    receive(msg: SetBotManifest){
        let ctx = context();
        nativeThrowUnless(codeUnauthorized, sender() == self.master || sender() == self.owner);
        nativeThrowUnless(codeNonceInvalid, msg.nonce == self.nonce);
        nativeThrowUnless(codeBalanceNotSufficient, myBalance() >= self.lockedValue);

        emit(WalletManifestChangedEvent{
            oldManifestUrl: self.manifestUrl,
            newManifestUrl: msg.manifestUrl
        }.toCell());

        self.checkAndUpdateNonce(msg.nonce);
        self.manifestUrl = msg.manifestUrl;

        // refund
        self.reserveValue(0);
        send(SendParameters{
                to: msg.responseDestination,
                value: 0,
                mode: SendRemainingBalance,
                bounce: false,
                body: Excesses{
                    queryId: msg.queryId,
                }.toCell(),
            }
        );
    }

    // bot wallet publish attest task,
    // bot contract will forward the task to the master contract.
    // then distributed verifier oracle will pick the task.
    receive(msg: SubmitAttestTask){
        let ctx = context();

        nativeThrowUnless(codeUnauthorized, sender() == self.owner);
        nativeThrowUnless(codeManifestNotSet, self.manifestUrl != "");
        nativeThrowUnless(codeInflowValueNotSufficient, ctx.value >= msg.attestValue);
        nativeThrowUnless(codeBalanceNotSufficient, myBalance() >= self.lockedValue + msg.attestValue);
        nativeThrowUnless(codeAttestValueNotSufficient, msg.attestValue >= ton("0.05"));

        // forward the task to the master contract
        let pubMsg = PublishAttestTask{
            queryId: msg.queryId,
            taskId: self.attestTaskId,
            status: "pending",
            botOwner: self.owner,
            proofUrl: msg.proofUrl,
            attestValue: msg.attestValue
        };
        self.attestTaskId = self.attestTaskId + 1;

        self.reserveValue(msg.attestValue);
        send(SendParameters{
                to: self.master,
                value: 0,
                mode: SendRemainingBalance,
                bounce: true,
                body: pubMsg.toCell()
            }
        );

        // save the incentive of the task
        self.attestTaskIncentives.set(self.attestTaskId, msg.attestValue);
        // lock the incentive of the task for the verifier
        self.lockedValue = self.lockedValue + msg.attestValue;
    }

    // verifier contract will submit the attest task result by
    // this message, and the incentive will be sent to the verifier.
    receive(msg: AttestTaskResult) {
        let incentive = self.attestTaskIncentives.get(msg.taskId);
        nativeThrowUnless(codeAttestTaskNotFound, incentive != null);

        let ctx = context();
        let oracle = initOf Oracle(self.master, msg.oracleOwner);
        let oracleAddr = contractAddress(oracle);

        // sender must be an oracle contract
        nativeThrowUnless(codeSenderAddressInvalid, oracleAddr == sender());
        nativeThrowUnless(codeBalanceNotSufficient, myBalance() - ctx.value - incentive!! >= 0);

        // publish the attest task result,
        // The bot owner can listen to the attest results
        // and choose the appropriate way to notify the user.
        emit(msg.toCell());

        // pay the incentive to the verifier
        send(SendParameters{
                to: oracleAddr,
                value: incentive!!,
                bounce: false,
                body: PayAttestIncentive{
                    queryId: msg.queryId,
                    taskId: msg.taskId,
                    incentive: incentive!!,
                    releaseTime: now() + 3600 * 24 * 3,
                    botOwner: msg.botOwner
                }.toCell()
            }
        );

        // refund
        self.reserveValue(-incentive!!);
        send(SendParameters{
                to: msg.oracleOwner,
                value: 0,
                mode: SendRemainingBalance,
                bounce: false,
                body: Excesses{
                    queryId: msg.queryId,
                }.toCell()
            }
        );

        self.attestTaskIncentives.set(msg.taskId, null);
        self.lockedValue = self.lockedValue - incentive!!;
    }

    // owner can withdraw all balance that is not locked
    receive("withdraw"){
        nativeThrowUnless(codeUnauthorized, sender() == self.owner);

        // if the balance is not enough, reserve the rest value
        if (myBalance() < self.lockedValue + self.staticTaxFee) {
            return;
        }

        nativeReserve(self.lockedValue + self.staticTaxFee, ReserveExact);
        send(SendParameters{
                to: sender(),
                value: ton("0"),
                bounce: false,
                mode: SendRemainingBalance,
                body: Excesses{
                    queryId: 0,
                }.toCell()
            }
        );
    }

    get fun master(): String {
        return self.master.toString();
    }

    get fun manifestUrl(): String {
        return self.manifestUrl;
    }

    get fun taskIncentives(taskId: Int): Int {
        let val = self.attestTaskIncentives.get(taskId);
        if (val == null) {
            return 0;
        }

        return val!!;
    }

    get fun lockedValue(): Int {
        return self.lockedValue;
    }
}

contract Oracle with Common {
    owner: Address;
    nonce: Int as uint64 = 0;
    staticTaxFee: Int as coins = ton("0.01");
    master: Address;
    // lockedValue is the stake value that is locked in the contract,
    // cannot be withdrawed.
    lockedValue: Int as coins = ton("0");
    manifestUrl: String = "";

    // lockedIncentives stores the unreleased incentives of the attest task,
    // the key is the index, the value is the incentive.
    lockedIncentives: map<Int as uint64, PayAttestIncentive> = emptyMap();
    lockedIncentiveMaxIdx: Int as uint64 = 0;

    init(master: Address, owner: Address){
        self.master = master;
        self.owner = owner;
        self.lockedValue = MinimalOracleStakeValue;
    }

    fun reserveValue(delta: Int) {
        let ctx = context();
        let val = max(myBalance() - ctx.value + self.staticTaxFee, self.lockedValue + self.staticTaxFee);
        nativeReserve(val + delta, ReserveExact);
    }

    // receive deposit or refund
    receive("deposit") {}

    receive(msg: SetOracleManifest) {
        let ctx = context();
        nativeThrowUnless(codeUnauthorized, sender() == self.master || sender() == self.owner);
        nativeThrowUnless(codeNonceInvalid, msg.nonce == self.nonce);
        nativeThrowUnless(codeBalanceNotSufficient, myBalance() >= self.lockedValue);

        emit(WalletManifestChangedEvent{
            oldManifestUrl: self.manifestUrl,
            newManifestUrl: msg.manifestUrl
        }.toCell());

        self.checkAndUpdateNonce(msg.nonce);
        self.manifestUrl = msg.manifestUrl;

        // refund
        self.reserveValue(0);
        send(SendParameters{
                to: msg.responseDestination,
                value: 0,
                mode: SendRemainingBalance,
                bounce: false,
                body: Excesses{
                    queryId: msg.queryId,
                }.toCell(),
            }
        );
    }

    // oracle wallet submit the attest task result by this message,
    // then the oracle contract will forward the result to the
    // wallet contract to earn the incentive.
    receive(msg: AttestTaskResult) {
        nativeThrowUnless(codeUnauthorized, sender() == self.owner);
        nativeThrowUnless(codeBalanceNotSufficient, myBalance() >= self.lockedValue);
        nativeThrowUnless(codeAttestTaskStatusInvalid, msg.status == "verified" || msg.status == "rejected");

        let ctx = context();

        // get the address of bot contract
        let bot = initOf Bot(self.master, msg.botOwner);
        let botAddr = contractAddress(bot);

        // forward the result to the bot
        self.reserveValue(0);
        send(SendParameters{
                to: botAddr,
                value: ton("0"),
                bounce: false,
                body: msg.toCell(),
                mode: SendRemainingValue
            }
        );
    }

    // bot contract pay the incentive to the oracle contract
    // by this message, the incentive will be locked in the contract
    // until the release time.
    receive(msg: PayAttestIncentive){
        let ctx = context();
        let bot = initOf Bot(self.master, msg.botOwner);
        let botAddr = contractAddress(bot);

        // sender must be the bot contract
        nativeThrowUnless(codeSenderAddressInvalid, botAddr == sender());
        nativeThrowUnless(codeInflowValueNotSufficient, ctx.value >= msg.incentive);

        // refund the rest value to the bot
        self.reserveValue(msg.incentive);
        send(SendParameters{
                to: sender(),
                value: 0,
                mode: SendRemainingBalance,
                bounce: false,
                body: Excesses{
                    queryId: msg.queryId,
                }.toCell()
            }
        );

        // if the release time is greater than now, lock the incentive.
        // otherwise, refund the rest value to the bot
        if (now() < msg.releaseTime) {
            // lock the incentive
            let i = 0;
            while (i >= 0) {
                // find the first empty slot to store the incentive
                if (self.lockedIncentives.get(i) == null) {
                    self.lockedValue = self.lockedValue + msg.incentive;
                    self.lockedIncentives.set(i, msg);
                    if (i > self.lockedIncentiveMaxIdx) {
                        self.lockedIncentiveMaxIdx = i;
                    }

                    i = -1;
                }else {
                    i = i + 1;
                }
            }
        }
    }

    receive("gather_incentive"){
        let ctx = context();

        // iterate the lockedIncentives to release the incentive
        // if the release time is less than now.
        let nowTime = now();
        let i: Int = 0;
        let lastNonEmptyIdx: Int = -1;
        while (i <= self.lockedIncentiveMaxIdx) {
            let incentive = self.lockedIncentives.get(i);
            if (incentive != null) {
                lastNonEmptyIdx = i;

                if (nowTime >= incentive!!.releaseTime) {
                    // release the incentive
                    self.lockedIncentives.set(i, null);
                    self.lockedValue = self.lockedValue - incentive!!.incentive;
                }
            }

            i = i + 1;
        }

        // reset the lockedIncentiveMaxIdx
        if (lastNonEmptyIdx >= 0) {
            self.lockedIncentiveMaxIdx = lastNonEmptyIdx;
        }

        // refund the rest value to the bot
        self.reserveValue(0);
        send(SendParameters{
                to: sender(),
                value: 0,
                mode: SendRemainingBalance,
                bounce: false,
                body: Excesses{
                    queryId: 0,
                }.toCell()
            }
        );
    }

    // owner can withdraw all balance
    receive("withdraw"){
        nativeThrowUnless(codeUnauthorized, sender() == self.owner);

        // if the balance is not enough, reserve the rest value
        if (myBalance() < self.lockedValue + self.staticTaxFee) {
            return;
        }

        nativeReserve(self.lockedValue + self.staticTaxFee, ReserveExact);
        send(SendParameters{
                to: sender(),
                value: ton("0"),
                bounce: false,
                mode: SendRemainingBalance
            }
        );
    }

    get fun lockedValue(): Int {
        return self.lockedValue;
    }

    get fun lockedIncentiveMaxIdx(): Int {
        let total = 0;
        let i: Int = 0;
        while (i <= self.lockedIncentiveMaxIdx) {
            let incentive = self.lockedIncentives.get(i);
            if (incentive != null) {
                total = total + incentive!!.incentive;
            }

            i = i + 1;
        }

        return total;
    }

    get fun manifestUrl(): String {
        return self.manifestUrl;
    }
}
