package main

import (
	"fmt"
	"math/big"

	"github.com/Laisky/errors/v2"
	gcmd "github.com/Laisky/go-utils/v4/cmd"
	"github.com/everFinance/goar"
	"github.com/spf13/cobra"
)

func init() {
	rootCMD.AddCommand(showCMD)

	showBalanceCMD.Flags().StringVarP(&showBalanceCMDArgs.Address, "address", "a", "", "address to show balance")
	showCMD.AddCommand(showBalanceCMD)
}

var showCMD = &cobra.Command{
	Use:  "show",
	Args: gcmd.NoExtraArgs,
}

var showBalanceCMDArgs = struct {
	Address string
}{}

var showBalanceCMD = &cobra.Command{
	Use:  "balance",
	Args: gcmd.NoExtraArgs,
	PreRunE: func(cmd *cobra.Command, args []string) error {
		if showBalanceCMDArgs.Address == "" {
			return errors.New("address is required")
		}

		return nil
	},
	RunE: func(cmd *cobra.Command, args []string) error {
		balance, err := showBalance(showBalanceCMDArgs.Address)
		if err != nil {
			return err
		}

		fmt.Printf("address: %s\nbalance: %s AR\n",
			showBalanceCMDArgs.Address, balance.String())
		return nil
	},
}

func showBalance(address string) (balance *big.Float, err error) {
	cli := goar.NewClient(ArweaveAPI)
	return cli.GetWalletBalance(address)
}
