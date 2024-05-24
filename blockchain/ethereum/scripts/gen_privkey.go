package main

import (
	"crypto/ecdsa"
	"fmt"
	"log"

	ecrypto "github.com/ethereum/go-ethereum/crypto"
)

func main() {
	// Generate a new private key
	privateKey, err := ecrypto.GenerateKey()
	if err != nil {
		log.Fatalf("Failed to generate private key: %v", err)
	}

	// Get the hexadecimal representation of the private key
	privateKeyHex := ecrypto.FromECDSA(privateKey)
	fmt.Printf("Private key: %x\n", privateKeyHex)

	// Derive the public key from the private key
	publicKey := privateKey.Public()
	publicKeyECDSA, ok := publicKey.(*ecdsa.PublicKey)
	if !ok {
		log.Fatal("Error casting public key to ECDSA")
	}

	// Obtain the hexadecimal representation of the public key
	publicKeyBytes := ecrypto.FromECDSAPub(publicKeyECDSA)
	fmt.Printf("Public key: %x\n", publicKeyBytes)

	// Derive the Ethereum address from the public key
	address := ecrypto.PubkeyToAddress(*publicKeyECDSA)
	fmt.Printf("Address: %s\n", address.Hex())
}
