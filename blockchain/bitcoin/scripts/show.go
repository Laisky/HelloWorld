package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/Laisky/errors/v2"
	gcmd "github.com/Laisky/go-utils/v4/cmd"
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
		return showBalance(showBalanceCMDArgs.Address)
	},
}

type BalanceResponse struct {
	FinalBalance int64 `json:"final_balance"`
}

func showBalance(address string) error {
	url := fmt.Sprintf("https://blockchain.info/balance?active=%s", address)
	resp, err := http.Get(url)
	if err != nil {
		return errors.Wrap(err, "error requesting balance")
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return errors.Errorf("error requesting balance, status code: %d", resp.StatusCode)
	}

	var result map[string]BalanceResponse
	err = json.NewDecoder(resp.Body).Decode(&result)
	if err != nil {
		return errors.Wrap(err, "error decoding response")
	}

	balance := float64(result[address].FinalBalance) / 1e8
	fmt.Printf("Address: %s\nBalance: %.8f BTC\n", address, balance)

	return nil
}
