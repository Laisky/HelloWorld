package main

import (
	"crypto/ecdsa"
	"fmt"

	gcmd "github.com/Laisky/go-utils/v4/cmd"
	ecrypto "github.com/ethereum/go-ethereum/crypto"
	"github.com/pkg/errors"
	"github.com/spf13/cobra"
)

func init() {
	// genPrivkeyCMD.Flags().StringVarP(&genPrivkeyCMDArgs.keyfilePath, "keyfile", "k", "wallet.json", "path to save the generated wallet")
	rootCMD.AddCommand(genPrivkeyCMD)
}

var genPrivkeyCMDArgs = struct {
	keyfilePath string
}{}

var genPrivkeyCMD = &cobra.Command{
	Use:   "gen",
	Short: "Generate privkey and address",
	Args:  gcmd.NoExtraArgs,
	RunE: func(cmd *cobra.Command, args []string) error {
		err := genPrivkeyAndAddress()
		if err != nil {
			return err
		}

		return nil
	},
}

func genPrivkeyAndAddress() error {
	// Generate a new private key
	privateKey, err := ecrypto.GenerateKey()
	if err != nil {
		return errors.Wrap(err, "failed to generate private key")
	}

	// Get the hexadecimal representation of the private key
	privateKeyHex := ecrypto.FromECDSA(privateKey)
	fmt.Printf("Private key: %x\n", privateKeyHex)

	// Derive the public key from the private key
	publicKey := privateKey.Public()
	publicKeyECDSA, ok := publicKey.(*ecdsa.PublicKey)
	if !ok {
		return errors.New("error casting public key to ECDSA")
	}

	// Obtain the hexadecimal representation of the public key
	publicKeyBytes := ecrypto.FromECDSAPub(publicKeyECDSA)
	fmt.Printf("Public key: %x\n", publicKeyBytes)

	// Derive the Ethereum address from the public key
	address := ecrypto.PubkeyToAddress(*publicKeyECDSA)
	fmt.Printf("Address: %s\n", address.Hex())

	return nil
}
