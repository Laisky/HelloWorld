package main

import (
	"bytes"
	"crypto"
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/base64"
	"encoding/json"
	"errors"
	"io"
	"os"
	"strings"
	"testing"

	"github.com/go-piv/piv-go/piv"
)

// historicalSoftwareDecrypter records the actual legacy call and uses real RSA.
type historicalSoftwareDecrypter struct {
	key   *rsa.PrivateKey
	t     *testing.T
	calls int
}

// Public returns the fixture's synthetic public key.
func (d *historicalSoftwareDecrypter) Public() crypto.PublicKey { return &d.key.PublicKey }

// Decrypt checks the existing nil-option contract before software decryption.
func (d *historicalSoftwareDecrypter) Decrypt(random io.Reader, ciphertext []byte, options crypto.DecrypterOpts) ([]byte, error) {
	d.calls++
	if options != nil {
		d.t.Fatal("legacy call changed padding selection")
	}
	return d.key.Decrypt(random, ciphertext, options)
}

// TestHistoricalCiphertext preserves the actual v3.4.0 encryptor's old output.
func TestHistoricalCiphertext(t *testing.T) {
	data, err := os.ReadFile("testdata/historical-v3.4.0-rsa-fixtures.json")
	if err != nil {
		t.Fatal(err)
	}
	var fixtures []struct {
		Name                                   string
		Bits                                   int
		PrivateKeyPKCS1, Plaintext, Ciphertext string
		SingleBlock                            bool
	}
	if err = json.Unmarshal(data, &fixtures); err != nil {
		t.Fatal(err)
	}
	if len(fixtures) != 10 {
		t.Fatalf("fixture inventory changed: %d", len(fixtures))
	}
	decode := func(s string) []byte {
		b, e := base64.StdEncoding.DecodeString(s)
		if e != nil {
			t.Fatal(e)
		}
		return b
	}
	for _, f := range fixtures {
		t.Run(f.Name, func(t *testing.T) {
			key, err := x509.ParsePKCS1PrivateKey(decode(f.PrivateKeyPKCS1))
			if err != nil {
				t.Fatal(err)
			}
			cipher := decode(f.Ciphertext)
			if len(cipher) != key.Size() {
				t.Fatal("fixture is not a canonical single ciphertext")
			}
			if strings.Contains(f.Name, "leading-zero") && cipher[0] != 0 {
				t.Fatal("leading-zero fixture changed")
			}
			d := &historicalSoftwareDecrypter{key: key, t: t}
			got, err := decryptLegacyRSA(d, cipher)
			if err != nil || !bytes.Equal(got, decode(f.Plaintext)) || d.calls != 1 {
				t.Fatalf("historical read failed: %v, calls %d", err, d.calls)
			}
			got, err = decryptLegacyRSA(d, make([]byte, key.Size()))
			if !errors.Is(err, rsa.ErrDecryption) || got != nil || d.calls != 2 {
				t.Fatalf("invalid ciphertext returned plaintext or changed calls: %v/%d", err, d.calls)
			}
		})
	}
}

// TestReviewedPIVConstructor confirms the main module selects the reviewed fork.
// Authentication stops at this deliberate callback; no card operation is made.
func TestReviewedPIVConstructor(t *testing.T) {
	key, err := rsa.GenerateKey(rand.Reader, 1024)
	if err != nil {
		t.Fatal(err)
	}
	sentinel := errors.New("offline PIN boundary")
	prompts := 0
	device, err := new(piv.YubiKey).PrivateKey(piv.SlotKeyManagement, &key.PublicKey, piv.KeyAuth{
		PINPolicy: piv.PINPolicyAlways,
		PINPrompt: func() (string, error) { prompts++; return "", sentinel },
	})
	if err != nil {
		t.Fatal(err)
	}
	d, ok := device.(crypto.Decrypter)
	if !ok {
		t.Fatal("RSA crypto.Decrypter missing")
	}
	capability, ok := device.(interface{ SupportsRSAOAEP() bool })
	if !ok || !capability.SupportsRSAOAEP() {
		t.Fatal("application selected the old options-ignoring PIV dependency")
	}
	_, err = d.Decrypt(rand.Reader, make([]byte, key.Size()), &rsa.OAEPOptions{Hash: crypto.SHA256, MGFHash: crypto.SHA256})
	if err == nil || !strings.Contains(err.Error(), sentinel.Error()) || prompts != 1 {
		t.Fatalf("native OAEP did not reach only the offline PIN boundary: %v/%d", err, prompts)
	}
}
