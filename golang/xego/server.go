package xego

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/hex"
	"math/big"
	"net/http"
	"strings"
	"time"

	"github.com/edgelesssys/ego/enclave"
	"github.com/pkg/errors"
)

type HTTPServer interface {
	HandleFunc(pattern string, handler http.HandlerFunc)
}

func RegisterRAHandler(urlPrefix string, srv HTTPServer, tlsCert []byte) error {
	if len(tlsCert) == 0 {
		return errors.Errorf("tlsCert is empty")
	}

	urlPrefix = strings.TrimSuffix(urlPrefix, "/")

	srv.HandleFunc(urlPrefix+"/cert",
		func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(http.StatusOK)
			w.Write(tlsCert)
		})

	srv.HandleFunc(urlPrefix+"/report",
		func(w http.ResponseWriter, r *http.Request) {
			salt := r.URL.Query().Get("salt")
			if salt == "" {
				w.WriteHeader(http.StatusBadRequest)
				w.Write([]byte("salt is empty"))
				return
			}

			hasher := sha256.New()
			hasher.Write(append(tlsCert, []byte(salt)...))
			hashed := hex.EncodeToString(hasher.Sum(nil))
			report, err := enclave.GetRemoteReport([]byte(hashed))
			if err != nil {
				w.WriteHeader(http.StatusBadRequest)
				w.Write([]byte("failed to get report"))
				return
			}

			w.WriteHeader(http.StatusOK)
			w.Write(report)
		})

	return nil
}

func GenerateSampleCert() (cert []byte, priKey *rsa.PrivateKey, err error) {
	template := &x509.Certificate{
		SerialNumber: &big.Int{},
		Subject:      pkix.Name{CommonName: "localhost"},
		NotAfter:     time.Now().Add(time.Hour),
		DNSNames:     []string{"localhost"},
	}
	if priKey, err = rsa.GenerateKey(rand.Reader, 2048); err != nil {
		return nil, nil, errors.Wrap(err, "generate key")
	}

	cert, err = x509.CreateCertificate(rand.Reader, template, template, &priKey.PublicKey, priKey)
	return cert, priKey, nil
}
