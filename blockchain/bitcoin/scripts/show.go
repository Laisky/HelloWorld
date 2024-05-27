package main

import (
	"bytes"
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

	showTransactionCMD.Flags().StringVarP(&showTransactionCMDArgs.Txid, "txid", "t", "", "transaction id to show")
	showCMD.AddCommand(showTransactionCMD)

	transferCMD.Flags().StringVarP(&transferCMDArgs.From, "from", "f", "", "sender address")
	transferCMD.Flags().StringVarP(&transferCMDArgs.To, "to", "t", "", "receiver address")
	transferCMD.Flags().Float64VarP(&transferCMDArgs.Amount, "amount", "m", 0, "amount to transfer")
	rootCMD.AddCommand(transferCMD)
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

var showTransactionCMDArgs = struct {
	Txid string
}{}

var showTransactionCMD = &cobra.Command{
	Use:  "tx",
	Args: gcmd.NoExtraArgs,
	RunE: func(cmd *cobra.Command, args []string) error {
		return showTransaction(showTransactionCMDArgs.Txid)
	},
}

func showTransaction(txid string) error {
	url := fmt.Sprintf("https://blockchain.info/rawtx/%s", txid)
	resp, err := http.Get(url)
	if err != nil {
		return errors.Wrap(err, "error requesting transaction")
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return errors.Errorf("error requesting transaction, status code: %d", resp.StatusCode)
	}

	var result map[string]interface{}
	err = json.NewDecoder(resp.Body).Decode(&result)
	if err != nil {
		return errors.Wrap(err, "error decoding response")
	}

	fmt.Printf("Transaction: %s\n", txid)
	fmt.Printf("Inputs:\n")
	for _, input := range result["inputs"].([]interface{}) {
		inputMap := input.(map[string]interface{})
		prevOut := inputMap["prev_out"].(map[string]interface{})
		fmt.Printf("  %s: %.8f BTC\n", prevOut["addr"], float64(prevOut["value"].(float64))/1e8)
	}

	fmt.Printf("Outputs:\n")
	for _, output := range result["out"].([]interface{}) {
		outputMap := output.(map[string]interface{})
		fmt.Printf("  %s: %.8f BTC\n", outputMap["addr"], float64(outputMap["value"].(float64))/1e8)
	}

	return nil
}

var transferCMDArgs = struct {
	From   string
	To     string
	Amount float64
}{}

var transferCMD = &cobra.Command{
	Use:  "transfer",
	Args: gcmd.NoExtraArgs,
	RunE: func(cmd *cobra.Command, args []string) error {
		return transfer(transferCMDArgs.From, transferCMDArgs.To, transferCMDArgs.Amount)
	},
}

func transfer(from, to string, amount float64) error {
	if from == "" || to == "" {
		return errors.New("both from and to addresses are required")
	}
	if amount <= 0 {
		return errors.New("amount must be greater than zero")
	}

	payload := map[string]interface{}{
		"from":   from,
		"to":     to,
		"amount": amount,
	}

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return errors.Wrap(err, "error marshaling payload")
	}

	url := "https://api.cryptoservice.com/transfer" // Hypothetical URL
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(payloadBytes))
	if err != nil {
		return errors.Wrap(err, "error creating transaction")
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return errors.Errorf("error creating transaction, status code: %d", resp.StatusCode)
	}

	var result map[string]interface{}
	err = json.NewDecoder(resp.Body).Decode(&result)
	if err != nil {
		return errors.Wrap(err, "error decoding response")
	}

	txid, ok := result["txid"].(string)
	if !ok {
		return errors.New("invalid response from server, missing txid")
	}

	fmt.Printf("Transaction successful!\nTXID: %s\n", txid)
	return nil
}
