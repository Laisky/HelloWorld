package main

import (
	"fmt"
	"log"

	gcmd "github.com/Laisky/go-utils/v4/cmd"
	"github.com/btcsuite/btcd/btcec"
	"github.com/btcsuite/btcd/chaincfg"
	"github.com/btcsuite/btcutil"
	"github.com/spf13/cobra"
)

func init() {
	rootCMD.AddCommand(genPrivkeyCMD)
}

var genPrivkeyCMD = &cobra.Command{
	Use:   "gen",
	Short: "Generate privkey and address",
	Args:  gcmd.NoExtraArgs,
	Run: func(cmd *cobra.Command, args []string) {
		genPrivkeyAndAddress()
	},
}

func genPrivkeyAndAddress() {
	// Generate a new private key.
	privKey, err := btcec.NewPrivateKey(btcec.S256())
	if err != nil {
		log.Fatal(err)
	}

	// Convert the private key to WIF (Wallet Import Format)
	wif, err := btcutil.NewWIF(privKey, &chaincfg.MainNetParams, true)
	if err != nil {
		log.Fatal(err)
	}

	// Derive the public key from the private key.
	pubKey := privKey.PubKey()

	// Generate a Bitcoin address from the public key.
	address, err := btcutil.NewAddressPubKey(pubKey.SerializeCompressed(), &chaincfg.MainNetParams)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Private Key (WIF):", wif.String())
	fmt.Println("Bitcoin Address:", address.EncodeAddress())
}
