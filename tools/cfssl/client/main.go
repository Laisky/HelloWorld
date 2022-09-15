package main

import (
	"crypto/tls"
	"crypto/x509"
	"encoding/pem"
	"io"
	"log"
	"net/http"
	"os"
)

func panicErr(err error) {
	if err != nil {
		panic(err)
	}
}

func parseCert(cnt []byte) *x509.Certificate {
	blk, _ := pem.Decode(cnt)
	cert, err := x509.ParseCertificate(blk.Bytes)
	panicErr(err)
	return cert
}

func main() {
	// 因为服务端提供了完整的证书链，
	// tester 仅需预先配置 rootCA 即可
	caCertPem, err := os.ReadFile("../ca.pem")
	panicErr(err)

	capool := x509.NewCertPool()
	capool.AddCert(parseCert(caCertPem))

	cli := &http.Client{
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{
				RootCAs: capool,
			},
		},
	}

	resp, err := cli.Get("https://l3.laisky.com:10443/hello")
	panicErr(err)
	defer resp.Body.Close()

	respBytes, err := io.ReadAll(resp.Body)
	panicErr(err)
	log.Printf("resp: %s", string(respBytes))
}
