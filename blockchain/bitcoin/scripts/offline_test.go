package main

import (
	"testing"

	"github.com/btcsuite/btcd/btcec"
	"github.com/btcsuite/btcd/chaincfg"
	"github.com/btcsuite/btcutil"
)

func TestOfflineWIFRoundTrip(t *testing.T) {
	// Public, fixed test scalar; never a real wallet credential.
	private, _ := btcec.PrivKeyFromBytes(btcec.S256(), []byte{1})
	encoded, err := btcutil.NewWIF(private, &chaincfg.MainNetParams, true)
	if err != nil {
		t.Fatal(err)
	}
	decoded, err := btcutil.DecodeWIF(encoded.String())
	if err != nil {
		t.Fatal(err)
	}
	if !decoded.IsForNet(&chaincfg.MainNetParams) || !decoded.CompressPubKey {
		t.Fatal("WIF network/compression changed")
	}
	if string(decoded.PrivKey.Serialize()) != string(private.Serialize()) {
		t.Fatal("WIF did not retain the test key")
	}
	address, err := btcutil.NewAddressPubKey(private.PubKey().SerializeCompressed(), &chaincfg.MainNetParams)
	if err != nil {
		t.Fatal(err)
	}
	if address.EncodeAddress() != "1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH" {
		t.Fatal("compressed address derivation changed")
	}
}

func TestOfflineCommandValidation(t *testing.T) {
	if genPrivkeyCMD.Args(genPrivkeyCMD, []string{"unexpected"}) == nil {
		t.Fatal("gen accepted unexpected arguments")
	}
	original := showBalanceCMDArgs.Address
	defer func() { showBalanceCMDArgs.Address = original }()
	showBalanceCMDArgs.Address = ""
	if showBalanceCMD.PreRunE(showBalanceCMD, nil) == nil {
		t.Fatal("balance accepted a missing address")
	}
}
