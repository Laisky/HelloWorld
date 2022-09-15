package main

import (
	"crypto/tls"
	"crypto/x509"
	"encoding/pem"
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

func pem2der(pemBytes []byte) (derBytes []byte) {
	pemBlk, _ := pem.Decode(pemBytes)
	return pemBlk.Bytes
}

func main() {
	caCertPem, err := os.ReadFile("../ca.pem")
	panicErr(err)

	l2CertPem, err := os.ReadFile("../l2/cert.pem")
	panicErr(err)

	l3CertPem, err := os.ReadFile("../l2/l3/cert.pem")
	panicErr(err)
	// l3Cert := parseCert(l3CertPem)

	l3keyPem, err := os.ReadFile("../l2/l3/cert-key.pem")
	panicErr(err)
	l3key, err := x509.ParseECPrivateKey(pem2der(l3keyPem))
	panicErr(err)

	// 准备好完整证书链， l3 crt -> l2 crt -> root CA
	tlsCfg := &tls.Config{
		Certificates: []tls.Certificate{
			{
				Certificate: [][]byte{pem2der(l3CertPem), pem2der(l2CertPem), pem2der(caCertPem)},
				PrivateKey:  l3key,
			},
		},
	}

	mux := http.NewServeMux()

	mux.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/plain")
		w.Write([]byte("world\n"))
	})

	server := &http.Server{
		Handler:   mux,
		Addr:      ":10443",
		TLSConfig: tlsCfg,
	}
	if err := server.ListenAndServeTLS("", ""); err != nil {
		log.Println("exit, ", err.Error())
	}
	panicErr(err)
}
