```sh
gramine-sgx-gen-private-key private.key

make SGX=1
gramine-sgx-get-token -s python3.sig
```
