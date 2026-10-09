# Historical sample ciphertext

Generated once using the actual github.com/Laisky/go-utils/v3 v3.4.0
RSAEncrypt function pinned by this module at HelloWorld
e4c26534d33b42acfba32d314f9135ca65b1dc17. The fixtures contain only
generated software keys and public test data, not user secrets or stored data.

The ten RSA-1024/2048 ciphertexts cover the original example message,
one-byte and binary input, maximum single-block payloads, and modulus-width
ciphertext beginning with zero. They are PKCS #1 v1.5 and need no reencryption
for historical reads. Empty/concatenated helper output is not a single PIV
ciphertext and is outside this gate.

Fixture SHA-256: e5317c1d2a70060dfe9c0ee3e7692b61137189ffd77194e5dfaec270a6846bf2

Ordinary tests read these fixed ciphertexts and never regenerate them.
Software RSA and APDU-boundary tests do not establish physical card behavior.
