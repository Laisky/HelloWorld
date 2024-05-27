package main

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"
	"crypto/x509"
	"encoding/base64"
	"encoding/json"
	"encoding/pem"
	"fmt"
	"math/big"
	"os"

	"github.com/Laisky/errors/v2"
	gcmd "github.com/Laisky/go-utils/v4/cmd"
	"github.com/spf13/cobra"
)

const ArweaveAPI = "https://arweave.net"

func init() {
	genPrivkeyCMD.Flags().StringVarP(&genPrivkeyCMDArgs.keyfilePath, "keyfile", "k", "wallet.json", "path to save the generated wallet")
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
		_, address, err := genPrivkeyAndAddress(genPrivkeyCMDArgs.keyfilePath)
		if err != nil {
			return err
		}

		fmt.Printf("write wallet to %s, address: %s\n", genPrivkeyCMDArgs.keyfilePath, address)
		return nil
	},
}

// Wallet arweave wallet
type Wallet struct {
	Kty string `json:"kty"`
	N   string `json:"n"`
	E   string `json:"e"`
	D   string `json:"d"`
	P   string `json:"p"`
	Q   string `json:"q"`
	Dp  string `json:"dp"`
	Dq  string `json:"dq"`
	Qi  string `json:"qi"`
}

func generateKey() (*rsa.PrivateKey, error) {
	return rsa.GenerateKey(rand.Reader, 2048)
}

func exportRsaPrivateKeyAsPemStr(privkey *rsa.PrivateKey) string {
	privkeyBytes := x509.MarshalPKCS1PrivateKey(privkey)
	privkeyPem := &pem.Block{
		Type:  "RSA PRIVATE KEY",
		Bytes: privkeyBytes,
	}
	return string(pem.EncodeToMemory(privkeyPem))
}

func toBase64URL(b []byte) string {
	return base64.URLEncoding.WithPadding(base64.NoPadding).EncodeToString(b)
}

func createWallet(priv *rsa.PrivateKey) *Wallet {
	pub := priv.PublicKey
	e := big.NewInt(int64(pub.E))

	w := &Wallet{
		Kty: "RSA",
		N:   toBase64URL(pub.N.Bytes()),
		E:   toBase64URL(e.Bytes()),
		D:   toBase64URL(priv.D.Bytes()),
		P:   toBase64URL(priv.Primes[0].Bytes()),
		Q:   toBase64URL(priv.Primes[1].Bytes()),
		Dp:  toBase64URL(priv.Precomputed.Dp.Bytes()),
		Dq:  toBase64URL(priv.Precomputed.Dq.Bytes()),
		Qi:  toBase64URL(priv.Precomputed.Qinv.Bytes()),
	}

	return w
}

func genPrivkeyAndAddress(keyfilePath string) (*Wallet, string, error) {
	priv, err := generateKey()
	if err != nil {
		return nil, "", errors.Wrap(err, "generate key")
	}

	wallet := createWallet(priv)
	walletJson, err := json.MarshalIndent(wallet, "", "  ")
	if err != nil {
		return nil, "", errors.Wrap(err, "marshal wallet")
	}

	err = os.WriteFile(keyfilePath, walletJson, 0644)
	if err != nil {
		return nil, "", errors.Wrap(err, "write wallet")
	}

	address := getWalletAddress(wallet)
	return wallet, address, nil
}

// getWalletAddress returns the wallet address
func getWalletAddress(wallet *Wallet) string {
	nBytes, err := base64.URLEncoding.WithPadding(base64.NoPadding).DecodeString(wallet.N)
	if err != nil {
		panic("invalid base64 string for N")
	}
	hash := sha256.Sum256(nBytes)
	return base64.URLEncoding.WithPadding(base64.NoPadding).EncodeToString(hash[:])
}
