package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"log"
	"strconv"

	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/liteclient"
	"github.com/xssnick/tonutils-go/tlb"
	"github.com/xssnick/tonutils-go/ton"
	"github.com/xssnick/tonutils-go/ton/jetton"
	"github.com/xssnick/tonutils-go/ton/nft"
	"github.com/xssnick/tonutils-go/tvm/cell"
)

func main() {
	ctx := context.Background()
	client := liteclient.NewConnectionPool()

	// connect to testnet lite server
	err := client.AddConnectionsFromConfigUrl(ctx,
		"https://ton-blockchain.github.io/testnet-global.config.json")
	if err != nil {
		panic(err)
	}

	ctx = client.StickyContext(ctx)

	// initialize ton api lite connection wrapper
	api := ton.NewAPIClient(client).WithRetry()

	tokenContract := address.MustParseAddr("kQAnIbGD4TncXds8v4vvu86uw2HPQzYT-_bPis_dWxH1GL8y")
	master := jetton.NewJettonMasterClient(api, tokenContract)

	data, err := master.GetJettonData(ctx)
	if err != nil {
		log.Fatal(err)
	}

	decimals := 9
	content := data.Content.(*nft.ContentOnchain)
	log.Println("total supply:", data.TotalSupply.Uint64())
	log.Println("mintable:", data.Mintable)
	log.Println("admin addr:", data.AdminAddr)
	log.Println("onchain content:")
	log.Println("	name:", content.Name)
	log.Println("	symbol:", content.GetAttribute("symbol"))
	if content.GetAttribute("decimals") != "" {
		decimals, err = strconv.Atoi(content.GetAttribute("decimals"))
		if err != nil {
			log.Fatal("invalid decimals")
		}
	}
	log.Println("	decimals:", decimals)
	log.Println("	description:", content.Description)
	log.Println()

	// show user's jetton wallet
	userAddress := address.MustParseAddr("0QARnduCSjymI91urfHE_jXlnTHrmr0e4yaPubtPQkgy553b")
	tokenWallet, err := master.GetJettonWallet(ctx, userAddress)
	if err != nil {
		log.Fatal(err)
	}

	tokenBalance, err := tokenWallet.GetBalance(ctx)
	if err != nil {
		log.Fatal(err)
	}

	log.Println("jetton balance:", tlb.MustFromNano(tokenBalance, decimals))

	// transfer
	// https://github.com/tonkeeper/wallet-api?tab=readme-ov-file#payment-urls
	body := cell.BeginCell().
		MustStoreUInt(0, 32).
		MustStoreStringSnake("hop hey la la lay!").
		EndCell()
	fmt.Printf("https://app.tonkeeper.com/transfer/%s?bin=%s&amount=%s",
		userAddress.String(),
		base64.URLEncoding.EncodeToString(body.ToBOC()),
		tlb.MustFromTON("0.05").Nano().String(),
	)
}
