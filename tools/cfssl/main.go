package main

import (
	"crypto/x509"
	"encoding/pem"
	"log"
	"os"
	"time"
)

func panicErr(err error) {
	if err != nil {
		panic(err)
	}
}

func loadL3Cert() []byte {
	l3CertPem, err := os.ReadFile("./l2/l3/cert.pem")
	panicErr(err)

	return l3CertPem
}

func parseCert(cnt []byte) *x509.Certificate {
	blk, _ := pem.Decode(cnt)
	cert, err := x509.ParseCertificate(blk.Bytes)
	panicErr(err)
	return cert
}

func main() {
	caCertPem, err := os.ReadFile("ca.pem")
	panicErr(err)

	l2CertPem, err := os.ReadFile("./l2/cert.pem")
	panicErr(err)

	l3CertPem, err := os.ReadFile("./l2/l3/cert.pem")
	panicErr(err)
	l3Cert := parseCert(l3CertPem)

	capool := x509.NewCertPool()
	capool.AppendCertsFromPEM(caCertPem)

	interPool := x509.NewCertPool()
	interPool.AppendCertsFromPEM(l2CertPem)

	l3Cert.CheckCRLSignature()

	_, err = l3Cert.Verify(x509.VerifyOptions{
		Roots: capool,
	})
	if err == nil {
		panic("should not verified")
	}

	chains, err := l3Cert.Verify(x509.VerifyOptions{
		Roots:         capool,
		Intermediates: interPool,
	})
	panicErr(err)
	log.Printf("chains %+v", chains)
	// Output: l3 -> l2 -> l1

	checkCRL(
		parseCert(caCertPem),
		parseCert(l2CertPem),
		l3Cert,
	)
}

// check cert by crl.pem
//
// prepare crl.txt
//
//	cfssl certinfo -cert l2/l3/cert.pem | jq .serial_number | tr -d '"' > crl.txt
//
// generate crl.pem:
//
//	cfssl gencrl crl.txt ca.pem ca-key.pem 604800 | base64 -d | openssl crl -inform DER -out crl.pem
//
// check CRL:
//
//	openssl crl -text -noout -in crl.pem
func checkCRL(certs ...*x509.Certificate) {
	rawCRL, err := os.ReadFile("crl.pem")
	panicErr(err)

	crl, err := x509.ParseCRL(rawCRL)
	panicErr(err)

	if crl.TBSCertList.NextUpdate.Before(time.Now()) {
		panic("crl is expired")
	}

	for _, c := range certs {
		c.CRLDistributionPoints
		for _, rc := range crl.TBSCertList.RevokedCertificates {
			if c.SerialNumber.Cmp(rc.SerialNumber) == 0 {
				log.Panicf("cert revoked: %s - %s", c.DNSNames[0], c.SerialNumber.String())
			}
		}
	}

	log.Println("crl verified")
}
