# TACT Compilation Report
Contract: Wallet
BOC Size: 889 bytes

# Types
Total Types: 5

## StateInit
TLB: `_ code:^cell data:^cell = StateInit`
Signature: `StateInit{code:^cell,data:^cell}`

## Context
TLB: `_ bounced:bool sender:address value:int257 raw:^slice = Context`
Signature: `Context{bounced:bool,sender:address,value:int257,raw:^slice}`

## SendParameters
TLB: `_ bounce:bool to:address value:int257 mode:int257 body:Maybe ^cell code:Maybe ^cell data:Maybe ^cell = SendParameters`
Signature: `SendParameters{bounce:bool,to:address,value:int257,mode:int257,body:Maybe ^cell,code:Maybe ^cell,data:Maybe ^cell}`

## WalletOperation
TLB: `wallet_operation#a6d4ab8a signature:fixed_bytes64 operation:remainder<slice> = WalletOperation`
Signature: `WalletOperation{signature:fixed_bytes64,operation:remainder<slice>}`

## ExternalOperation
TLB: `external_operation#e45771e6 operation:remainder<slice> = ExternalOperation`
Signature: `ExternalOperation{operation:remainder<slice>}`

# Get Methods
Total Get Methods: 4

## seqno

## walletId

## publicKey

## allowances

# Error Codes
2: Stack undeflow
3: Stack overflow
4: Integer overflow
5: Integer out of expected range
6: Invalid opcode
7: Type check error
8: Cell overflow
9: Cell underflow
10: Dictionary error
13: Out of gas error
32: Method ID not found
34: Action is invalid or not supported
37: Not enough TON
38: Not enough extra-currencies
128: Null reference exception
129: Invalid serialization prefix
130: Invalid incoming message
131: Constraints error
132: Access denied
133: Contract stopped
134: Invalid argument
135: Code of a contract was not found
136: Invalid address
137: Masterchain support is not enabled for this contract
8522: Invalid walletId
12383: Sender is not allowed to send messages
17654: Invalid seqno
48401: Invalid signature
54515: Transfer expired