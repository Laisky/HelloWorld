package main

import (
	"crypto/tls"
	"log"
	"net/http"

	xego "git.basebit.me/xss/lab/sgx/xego"
)

func main() {
	// Create certificate and a report that includes the certificate's hash.
	cert, priv := xego.GenerateSampleCert()

	tlsCfg := tls.Config{
		Certificates: []tls.Certificate{
			{
				Certificate: [][]byte{cert},
				PrivateKey:  priv,
			},
		},
	}

	listenAddr := "0.0.0.0:18083"
	server := http.Server{Addr: listenAddr, TLSConfig: &tlsCfg}

	if err := xego.RegisterRAHandler("/", &server, cert); err != nil {
		log.Panic("register ra handler, ", err.Error())
	}

	log.Println("listening " + listenAddr)
	if err := server.ListenAndServeTLS("", ""); err != nil {
		log.Println("exit, ", err.Error())
	}
}
