package main

import "testing"

// TestOfflineArgumentContracts checks go-utils command validation without
// generating wallets, reading balances, invoking RunE or contacting a network.
func TestOfflineArgumentContracts(t *testing.T) {
	for _, command := range []*struct {
		name string
		args func([]string) error
	}{
		{"root", func(args []string) error { return rootCMD.Args(rootCMD, args) }},
		{"gen", func(args []string) error { return genPrivkeyCMD.Args(genPrivkeyCMD, args) }},
	} {
		t.Run(command.name, func(t *testing.T) {
			if err := command.args(nil); err != nil {
				t.Fatalf("empty argument contract: %v", err)
			}
			if err := command.args([]string{"unexpected"}); err == nil {
				t.Fatal("extra argument accepted")
			}
		})
	}
}
