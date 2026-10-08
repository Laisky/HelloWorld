package main

import (
	"os"
	"testing"

	gencrypt "github.com/Laisky/go-utils/v3/encrypt"
	"golang.org/x/term"
)

// These tests never invoke main, Encrypt, getPin, piv.Cards, or piv.Open.
func TestOfflineRootCertificate(t *testing.T) {
	cert, err := gencrypt.Pem2Cert(pivRootCAPem)
	if err != nil {
		t.Fatal(err)
	}
	if !cert.IsCA {
		t.Fatal("embedded attestation root is not a CA")
	}
}

func TestOfflineTerminalRejectsPipe(t *testing.T) {
	reader, writer, err := os.Pipe()
	if err != nil {
		t.Fatal(err)
	}
	defer reader.Close()
	defer writer.Close()
	if term.IsTerminal(int(reader.Fd())) {
		t.Fatal("pipe identified as terminal")
	}
	if _, err := term.ReadPassword(int(reader.Fd())); err == nil {
		t.Fatal("password reader accepted a pipe")
	}
}
