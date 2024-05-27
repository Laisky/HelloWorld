package main

import (
	"os"
	"testing"

	"github.com/everFinance/goar"
	"github.com/stretchr/testify/require"
)

func TestGenPrivkeyAndAddress(t *testing.T) {
	// Create a temporary file for the wallet JSON
	tmpfile, err := os.CreateTemp("", "wallet.json")
	require.NoError(t, err)
	defer os.Remove(tmpfile.Name())

	// Generate a new private key
	_, _, err = genPrivkeyAndAddress(tmpfile.Name())
	require.NoError(t, err)

	wallet, err := goar.NewWalletFromPath(tmpfile.Name(), ArweaveAPI)
	require.NoError(t, err)

	bal, err := showBalance(wallet.Owner())
	require.NoError(t, err)
	t.Logf("balance: %s", bal.String())

	// t.Error()
}
