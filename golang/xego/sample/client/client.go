package main

import (
	"bytes"
	"crypto/sha256"
	"crypto/tls"
	"crypto/x509"
	"encoding/binary"
	"encoding/hex"
	"errors"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"strconv"

	"github.com/edgelesssys/ego/eclient"
)

const (
	UseCache = true

	cachePathSrvCert   = "/home/laisky/repo/ego/samples/remote_attestation/cache/server-cert"
	cachePathSrvReport = "/home/laisky/repo/ego/samples/remote_attestation/cache/server-report"
)

func main() {
	signerArg := flag.String("s", "", "signer ID")
	serverAddr := flag.String("a", "localhost:18083", "server address")
	flag.Parse()

	// get signer command line argument
	signer, err := hex.DecodeString(*signerArg)
	if err != nil {
		panic(err)
	}
	if len(signer) == 0 {
		flag.Usage()
		return
	}

	salt := strconv.Itoa(rand.Int())

	url := fmt.Sprintf("https://%s", *serverAddr)
	fmt.Sprintln("request " + url)

	var certBytes, reportBytes []byte
	if UseCache {
		certBytes, reportBytes = readCache()
	} else {
		certBytes, reportBytes = realRequest(url, salt)
	}

	if err := verifyReport(reportBytes, certBytes, signer, salt); err != nil {
		panic(err)
	}

	if UseCache {
		fmt.Println("report validated")
		return
	}

	// Create a TLS config that uses the server certificate as root
	// CA so that future connections to the server can be verified.
	cert, _ := x509.ParseCertificate(certBytes)
	tlsConfig := &tls.Config{RootCAs: x509.NewCertPool(), ServerName: "localhost"}
	tlsConfig.RootCAs.AddCert(cert)

	httpGet(tlsConfig, url+"/secret?s=laisky")
	fmt.Println("Sent secret over attested TLS channel ")
}

func readCache() (certBytes, reportBytes []byte) {
	var err error
	if certBytes, err = ioutil.ReadFile(cachePathSrvCert); err != nil {
		panic(err)
	}
	if reportBytes, err = ioutil.ReadFile(cachePathSrvReport); err != nil {
		panic(err)
	}

	return
}

func realRequest(url, salt string) (certBytes, reportBytes []byte) {
	fmt.Println("request ", url)
	// Get server certificate and its report. Skip TLS certificate verification because
	// the certificate is self-signed and we will verify it using the report instead.
	tlsConfig := &tls.Config{InsecureSkipVerify: true}

	certBytes = httpGet(tlsConfig, url+"/cert")
	reportBytes = httpGet(tlsConfig, url+"/report?salt="+salt)

	// 把相关文件保存下来，方便单独测试客户端
	{

		if err := ioutil.WriteFile(cachePathSrvCert, certBytes, 0660); err != nil {
			panic(err)
		}
		if err := ioutil.WriteFile(cachePathSrvReport, reportBytes, 0660); err != nil {
			panic(err)
		}
	}

	return
}

func verifyReport(reportBytes, certBytes, signer []byte, salt string) error {
	report, err := eclient.VerifyRemoteReport(reportBytes)
	if err != nil {
		return err
	}

	hasher := sha256.New()
	hasher.Write(append(certBytes, []byte(salt)...))
	hashed := hasher.Sum(nil)

	if string(report.Data) != hashed {
		return errors.New("report data does not match the certificate's hash")
	}

	// You can either verify the UniqueID or the tuple (SignerID, ProductID, SecurityVersion, Debug).

	if report.SecurityVersion < 2 {
		return errors.New("invalid security version")
	}
	if binary.LittleEndian.Uint16(report.ProductID) != 1234 {
		return errors.New("invalid product")
	}
	if !bytes.Equal(report.SignerID, signer) {
		return errors.New("invalid signer")
	}

	// For production, you must also verify that report.Debug == false

	return nil
}

func httpGet(tlsConfig *tls.Config, url string) []byte {
	log.Printf("http get %s".url)
	client := http.Client{Transport: &http.Transport{TLSClientConfig: tlsConfig}}
	resp, err := client.Get(url)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		panic(resp.Status)
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		panic(err)
	}
	return body
}
