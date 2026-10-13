# Same-major go-utils example updates

Four example modules keep their existing import major and minimum Go floor:
golang/yubikey v3.4.0 to v3.5.0; blockchain/arweave/scripts and
blockchain/ethereum/scripts v4.9.1 to v4.10.0; blockchain/bitcoin/scripts
v4.9.2-0.20240412064731-eb19077af24c to v4.10.0.
The existing piv-go replacement at c682bc1db34c is preserved.

Run ordinary module race/test/vet/build checks in each module. The retained
software-key ciphertext fixtures and certificate/terminal controls do not use
a physical token. Offline command validation calls argument/flag guards only,
with nil valid arguments and unexpected arguments as failure controls.
Bitcoin's fixed public test scalar/address stays an offline control.

The Arweave wallet-generation/live balance test retains all its assertions
behind the explicit integration_arweave build tag. Normal acceptance never
invokes wallet generation, balances, main/RunE, external network services or
financial actions. Executing that live tagged test requires separate approval.
These checks do not qualify physical tokens or live blockchain deployments.

The PR description records exact baseline/candidate commands, local results
and exact-head CI. Keep this update Draft until the applicable gates complete.
Adopt through an application rebuild without rewriting stored records; retain
the old dependency commit/binary for rollback. No merge or rollout is performed.
