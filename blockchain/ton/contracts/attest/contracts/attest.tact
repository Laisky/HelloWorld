import "@stdlib/deploy";
import "@stdlib/ownable";
import "@stdlib/stoppable";
import "./errcodes.tact";
import "./messages.tact";


const MinimalOracleStakeValue: Int = ton("1");


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

// this is the master contract of TON.
contract Attest with Deployable, OwnableTransferable, Txable, Common {
    owner: Address;
    nonce: Int as uint64 = 0;
    staticTaxFee: Int = ton("0.01");

    init(){
        self.owner = sender();
    }

    fun getBot(owner: Address): StateInit {
        return initOf Bot(myAddress(), owner);
    }

    fun getOracle(owner: Address): StateInit {
        return initOf Oracle(myAddress(), owner);
    }

    receive("deposit") {}

    // create bot contract for the sender,
    // all remaining value will be sent to the bot contract.
    receive(msg: RegisterBot){
        let ctx = context();

        msg.botOwner = sender();
        emit(msg.toCell());

        let bot = self.getBot(sender());
        let botAddr = contractAddress(bot);

        // deploy bot contract and send the manifest to the bot
        nativeReserve(myBalance() - ctx.value + self.staticTaxFee, ReserveExact);
        send(SendParameters{
                to: botAddr,
                value: 0,
                mode: SendRemainingBalance,
                bounce: false,
                body: SetBotManifest{
                    nonce: 0,
                    manifestUrl: msg.manifestUrl
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
        emit(msg.toCell());

        let oracle = self.getOracle(sender());
        let oracleAddr = contractAddress(oracle);

        // deploy oracle contract
        nativeReserve(myBalance() - ctx.value + self.staticTaxFee, ReserveExact);
        send(SendParameters{
                to: oracleAddr,
                value: 0,
                mode: SendRemainingBalance,
                bounce: false,
                body: "deposit".asComment(),
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
        nativeThrowUnless(codeInflowValueNotSufficient, ctx.value >= self.staticTaxFee);

        // publish the attest task via emit.
        // the task will be picked by the distributed verifier oracle.
        emit(msg.toCell());

        // refund the rest value to the bot
        nativeReserve(myBalance() - ctx.value + self.staticTaxFee, ReserveExact);
        send(SendParameters{
                to: botAddr,
                value: 0,
                mode: SendRemainingBalance,
                bounce: false,
                body: "deposit".asComment()
            }
        );
    }

    receive("withdraw"){
        nativeThrowUnless(codeUnauthorized, sender() == self.owner);

        send(SendParameters{
                to: sender(),
                value: 0,
                bounce: false,
                mode: SendRemainingBalance
            }
        );
    }
}

// Bot is the wallet contract, will be deployed by the master contract
// to every submiter/bot. wallet contract will take the responsibility of
// storing the manifest and the attest task.
contract Bot with Ownable, Common {
    owner: Address;
    nonce: Int as uint64 = 0;
    master: Address;
    manifestUrl: String = "";
    // attestTaskIncentives is the balance of the attest task,
    // the key is the task id, the value is the incentive of the task.
    attestTaskIncentives: map<Int as uint64, Int> = emptyMap();
    // lockedValue is the value that is locked in the contract, cannot be withdrawed.
    // To ensure there is enough rent, a deposit of at least 1 TON is necessary.
    lockedValue: Int = ton("0.01");
    emitFee: Int = ton("0.01");
    attestTaskId: Int as uint64 = 0;

    init(master: Address, owner: Address){
        let ctx = context();
        nativeThrowUnless(codeBalanceNotSufficient, myBalance() >= self.lockedValue);

        self.master = master;
        self.owner = owner;
    }

    // receive deposit or refund
    receive("deposit") {}

    // master can set manifest of Bot
    receive(msg: SetBotManifest){
        nativeThrowUnless(codeUnauthorized, sender() == self.master || sender() == self.owner);
        nativeThrowUnless(codeNonceInvalid, msg.nonce == self.nonce);
        nativeThrowUnless(codeBalanceNotSufficient, myBalance() >= self.lockedValue);

        emit(WalletManifestChangedEvent{
            oldManifestUrl: self.manifestUrl,
            newManifestUrl: msg.manifestUrl
        }.toCell());

        self.nonce = self.nonce + 1;
        self.manifestUrl = msg.manifestUrl;
    }

    // bot wallet publish attest task,
    // bot contract will forward the task to the master contract.
    // then distributed verifier oracle will pick the task.
    receive(msg: SubmitAttestTask){
        let ctx = context();

        nativeThrowUnless(codeUnauthorized, sender() == self.owner);
        nativeThrowUnless(codeManifestNotSet, self.manifestUrl != "");
        nativeThrowUnless(codeInflowValueNotSufficient, ctx.value >= msg.attestValue);
        nativeThrowUnless(codeBalanceNotSufficient, myBalance() - self.lockedValue - msg.attestValue >= 0);
        nativeThrowUnless(codeAttestValueNotSufficient, msg.attestValue >= ton("0.05"));

        // lock the incentive of the task for the verifier
        self.lockedValue = self.lockedValue + msg.attestValue;

        // save the incentive of the task
        self.attestTaskIncentives.set(self.attestTaskId, msg.attestValue);

        // forward the task to the master contract
        let pubMsg = PublishAttestTask{
            taskId: self.attestTaskId,
            status: "pending",
            botOwner: self.owner,
            proofUrl: msg.proofUrl,
            attestValue: msg.attestValue
        };
        self.attestTaskId = self.attestTaskId + 1;

        nativeReserve(myBalance() - ctx.value + msg.attestValue, ReserveExact);
        send(SendParameters{
                to: self.master,
                value: 0,
                mode: SendRemainingBalance,
                bounce: false,
                body: pubMsg.toCell()
            }
        );
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
        nativeReserve(myBalance() - ctx.value - incentive!!, ReserveExact);
        send(SendParameters{
                to: sender(),
                value: 0,
                mode: SendRemainingBalance,
                bounce: false,
                body: PayAttestIncentive{
                    taskId: msg.taskId,
                    incentive: incentive!!,
                    releaseTime: now() + 3600 * 24 * 3,
                    botOwner: msg.botOwner
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
        if (myBalance() < self.lockedValue) {
            return;
        }

        nativeReserve(self.lockedValue, ReserveExact);
        send(SendParameters{
                to: sender(),
                value: ton("0"),
                bounce: true,
                mode: SendRemainingBalance
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

contract Oracle with Ownable, Common {
    owner: Address;
    nonce: Int as uint64 = 0;
    master: Address;
    // lockedValue is the stake value that is locked in the contract,
    // cannot be withdrawed.
    lockedValue: Int = ton("0");

    // lockedIncentives stores the unreleased incentives of the attest task,
    // the key is the index, the value is the incentive.
    lockedIncentives: map<Int as uint64, PayAttestIncentive> = emptyMap();
    lockedIncentiveMaxIdx: Int as uint64 = 0;

    init(master: Address, owner: Address){
        let ctx = context();

        nativeThrowUnless(codeInflowValueNotSufficient, ctx.value >= self.lockedValue + MinimalOracleStakeValue);

        self.master = master;
        self.owner = owner;
        self.lockedValue = self.lockedValue + MinimalOracleStakeValue;
    }

    // receive deposit or refund
    receive("deposit") {}

    // oracle wallet submit the attest task result by this message,
    // then the oracle contract will forward the result to the
    // wallet contract to earn the incentive.
    receive(msg: AttestTaskResult){
        nativeThrowUnless(codeUnauthorized, sender() == self.owner);
        nativeThrowUnless(codeBalanceNotSufficient, myBalance() >= self.lockedValue);
        nativeThrowUnless(codeAttestTaskStatusInvalid, msg.status == "verified" || msg.status == "rejected");

        let ctx = context();

        // get the address of bot contract
        let bot = initOf Bot(self.master, msg.botOwner);
        let botAddr = contractAddress(bot);

        // forward the result to the bot
        nativeReserve(myBalance() - ctx.value, ReserveExact);
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

        // refund the rest value to the bot
        nativeReserve(myBalance() - ctx.value + msg.incentive, ReserveExact);
        send(SendParameters{
                to: sender(),
                value: 0,
                mode: SendRemainingBalance,
                bounce: false,
                body: "deposit".asComment()
            }
        );
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
        nativeReserve(myBalance() - ctx.value, ReserveExact);
        send(SendParameters{
                to: sender(),
                value: 0,
                mode: SendRemainingBalance,
                bounce: false,
                body: (myBalance() - ctx.value - self.lockedValue).toString().asComment()
            }
        );
    }

    // owner can withdraw all balance
    receive("withdraw"){
        nativeThrowUnless(codeUnauthorized, sender() == self.owner);

        // if the balance is not enough, reserve the rest value
        if (myBalance() < self.lockedValue) {
            return;
        }

        nativeReserve(self.lockedValue, ReserveExact);
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
}
