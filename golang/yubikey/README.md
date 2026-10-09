# YubiKey example compatibility

The main module selects the reviewed PIV implementation with:

```go
replace github.com/go-piv/piv-go => github.com/Laisky/piv-go v1.11.1-0.20261009203706-c682bc1db34c
```

Imports and existing `*piv.YubiKey` handles retain their original identity.
The pinned `go-utils/v3 v3.4.0` encryptor and the example's existing nil-option
decryption keep reading historical PKCS #1 v1.5 ciphertext. No reencryption is
required. This legacy mode is deprecated: observable failures can expose a
padding oracle, and selecting this fork does not make an exposed legacy
decryptor safe. Restrict legacy reads to trusted historical data.

New protocols should explicitly select `rsa.OAEPOptions{Hash: crypto.SHA256,
MGFHash: crypto.SHA256}` with matching OAEP encryption parameters. Determine
the format from trusted metadata; never fall back to PKCS #1 v1.5 after an OAEP
error. The sample deliberately preserves its historical format.

The retained fixtures were produced by the actual pinned historical encryptor
using generated software keys and public binary inputs, including the original
example message, maximum single-block payloads and leading-zero ciphertext.
Offline tests exercise the example's decryption call with real software RSA,
and the concrete selected PIV constructor with a deliberately failing PIN
callback. Local acceptance also runs the selected dependency's decoder/APDU
regressions; automatic CI runs only formatting and fast sample unit tests.
These checks do not validate hardware, PIN/touch handling or device timing.
Do not invoke `main` or `Encrypt` during offline verification.
