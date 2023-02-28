package main

import (
	"crypto"
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	_ "embed"
	"fmt"
	"strings"
	"syscall"

	"github.com/Laisky/errors"
	gencrypt "github.com/Laisky/go-utils/v3/encrypt"
	glog "github.com/Laisky/go-utils/v3/log"
	"github.com/Laisky/zap"
	"github.com/go-piv/piv-go/piv"
	"golang.org/x/term"
)

//go:embed piv_root_ca.pem
var pivRootCAPem []byte

func main() {
	logger, err := glog.New(glog.WithName("yubikey"))
	if err != nil {
		glog.Shared.Panic("new logger", zap.Error(err))
	}

	if err = Encrypt(logger); err != nil {
		logger.Panic("encrypt", zap.Error(err))
	}
}

func getPin() string {
	fmt.Print("PIN: ")
	bytepw, err := term.ReadPassword(int(syscall.Stdin))
	if err != nil {
		glog.Shared.Panic("read pin", zap.Error(err))
	}

	return string(bytepw)
}

func Encrypt(logger glog.Logger) error {
	// List all smartcards connected to the system.
	cards, err := piv.Cards()
	if err != nil {
		return errors.Wrap(err, "list cards")
	}

	// Find a YubiKey and open the reader.
	var yk *piv.YubiKey
	for _, card := range cards {
		if strings.Contains(strings.ToLower(card), "yubikey") {
			logger.Info("find yubikey", zap.String("name", card))
			if yk, err = piv.Open(card); err != nil {
				return errors.Wrap(err, "open yubikey")
			}

			break
		}
	}
	if yk == nil {
		return errors.Errorf("no yubikey found")
	}

	cert, err := yk.Attest(piv.SlotAuthentication)
	if err != nil {
		return errors.Wrap(err, "attest key")
	}

	// verify cert
	{
		rootca, err := gencrypt.Pem2Cert(pivRootCAPem)
		if err != nil {
			return errors.Wrap(err, "parse piv root ca")
		}

		ak, err := yk.AttestationCertificate()
		if err != nil {
			return errors.Wrap(err, "get ak")
		}
		intermedia := x509.NewCertPool()
		intermedia.AddCert(ak)

		roots := x509.NewCertPool()
		roots.AddCert(rootca)
		if _, err = cert.Verify(x509.VerifyOptions{
			Roots:         roots,
			Intermediates: intermedia,
		}); err != nil {
			return errors.Wrap(err, "slot cert cannot verify by piv root ca")
		}

		logger.Info("yubikey succeed attestted")
	}

	auth := piv.KeyAuth{PIN: getPin()}
	priv, err := yk.PrivateKey(piv.SlotAuthentication, cert.PublicKey, auth)
	if err != nil {
		return errors.Wrap(err, "get prikey")
	}

	raw := []byte("jrl32jr3jr23rl23rj23li")
	cipher, err := gencrypt.RSAEncrypt(cert.PublicKey.(*rsa.PublicKey), raw)
	if err != nil {
		return errors.Wrap(err, "encrypt data")
	}

	deviceDecrypter := priv.(crypto.Decrypter)
	gotRaw, err := deviceDecrypter.Decrypt(rand.Reader, cipher, nil)
	if err != nil {
		return errors.Wrap(err, "decrypt")
	}

	if string(gotRaw) != string(raw) {
		return errors.Errorf("got %s", string(gotRaw))
	}

	logger.Info("succeed encrypt and decrypt")
	return nil
}
