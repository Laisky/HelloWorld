package main

import (
	"bufio"
	"crypto/tls"
	"crypto/x509"
	"time"

	"github.com/Laisky/go-utils"
	"github.com/Laisky/zap"
)

var (
	clientKey = []byte(`-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQCmyhaiIm2esskOrj0A49SZgcldU/Uj8uZb861X+Cejq/cK8oy0
XS4hPx4IRHGqn1GBifrHAPn9yIYeDMWyVHg0Lz+gIf/t97TPRyijfoUnTIXDpjf1
r9f4TWP4OspXHVfjgb+GrxmWYCS64jV9oZJ/t3w/lgqfxFn5EgOqot9jcQIDAQAB
AoGAEqBpDKxZn6qJx6jvySSofog/C7wvmVcsIMLC7hsZmi6/RSq3SgFKAI6C9Rtn
sk1eld/p8MWMJap6R+rXPUYvsj4YCBhzaYppQ2zQdkp6ehA20Foy3gLVrSc9LktX
vyiAZ0Gk1U4plN+0K6q/IPLQ7iGP/ZhEfJOFPW+whqgV8O0CQQDRoGETMNXX9GPT
nXJlYhIKo6XY2vdo/4GLi2D5qED4R0zPVnu2FrhI+786meVqi3NgwbCWckr+VO9N
d2q/Y7ljAkEAy6+/wgz4OxNtTWwX2Ld5MuHaDOjcW+m1TMPLqtVl/ViCwhO8EE9l
nj3RDhlQcXGyQS2p9P54hS2LJt7slfyyGwJBAIRvSmURaUhyAc9jnS4n8zX9hX2n
eL9BDNrYR3/yqHkysngbLzUuzWZuhbXEHIhfaZkrRSEHPBHKHxVV6H7ZxfkCQEjD
fAligLr58a4a01oEETPwIulBtpbPIolN2NAqc8jRecTDMAfTlUW2Z5xVxrsAFuHZ
4kE3Nu68ml1EfdgG8ckCQQDJjHw2lZQbJGyrg7V0o3tOSPiyA6KPGwES8IJRuL7o
wYWUbvrJmhZ9RNQUgeIFE6npESMvKj3nX/RROzrG9s1j
-----END RSA PRIVATE KEY-----`)
	clientCrt = []byte(`-----BEGIN CERTIFICATE-----
MIIDpDCCAYwCAQEwDQYJKoZIhvcNAQEFBQAwRTELMAkGA1UEBhMCQVUxEzARBgNV
BAgTClNvbWUtU3RhdGUxITAfBgNVBAoTGEludGVybmV0IFdpZGdpdHMgUHR5IEx0
ZDAeFw0xOTEwMTAwNzI0MjBaFw0yMDEwMDkwNzI0MjBaMG8xCzAJBgNVBAYTAmNu
MQ4wDAYDVQQIEwVzdGF0ZTEPMA0GA1UEBxMGbGFpc2t5MQ4wDAYDVQQKEwVwYXRl
bzENMAsGA1UECxMEcGFhczEMMAoGA1UEAxMDY3poMRIwEAYJKoZIhvcNAQkBFgNs
bGwwgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBAKbKFqIibZ6yyQ6uPQDj1JmB
yV1T9SPy5lvzrVf4J6Or9wryjLRdLiE/HghEcaqfUYGJ+scA+f3Ihh4MxbJUeDQv
P6Ah/+33tM9HKKN+hSdMhcOmN/Wv1/hNY/g6ylcdV+OBv4avGZZgJLriNX2hkn+3
fD+WCp/EWfkSA6qi32NxAgMBAAEwDQYJKoZIhvcNAQEFBQADggIBAGC9h+fuSkWA
hAKZhbQ7fGaDBKiN6yIZ0eAQZjRw28nM7SzfIyHFiiHXAf9NWgykk2vSqNLeXkkR
+nBYv1bIOhnnWjiKlSWnew1H/ix14EHigK0rZHCOPqV9E6bmbXA+MChk/B+ryVsL
rMRtM3MARrKbPZOMyyLTBKrOFGwxyLPtkIafwWj4/ibQ5wt1j2VEoCEyZpXhIRAk
3U1yIUKmQ/3OxWoTsCzolwEWfrVNw1RClVFyHrS4xaK6SkeiT3goz44CyV37opCN
iXeyC2VARmHcGhTH0fiJjbhUnuMhaJyTq0fVo4hgdH48lBMMptEt8ElIlSpOQyVP
7YnwS0gDpZK8JxoghMeGbMKoZKtAWJYMTOcD0l4HoKqYLYrTuhIzokJ6DrmFA+rX
Z/Z0IAXXVD/vPTVOrrRsWHQPKqkiIhvQe0dSX7m62SsuFOb5Efrk6s1vtRrfNeCf
WByFeqdBWsmWd8VZTL+BEzrBcB/NkuVdo1+crQWyw/e3tyHW6r06MWJS+alWp2uS
JhT2fzBigx+ipDRs+RRnaMmd69ddV3zfE2Ch7Jst1uYZQsC9sYyXxv5NHKAhgBuY
HOwD1SbspdXlPMgph54dL0JPQZAsWvT5SQSZ9ER4tiO/U+f3U3ixGDZhiTOwALp6
eWApK+Slh2Q3gGS3k32I4A7P45QN/+kb
-----END CERTIFICATE-----`)
	caCrt = []byte(`-----BEGIN CERTIFICATE-----
MIIFtTCCA52gAwIBAgIJAOdAgEw9U786MA0GCSqGSIb3DQEBBQUAMEUxCzAJBgNV
BAYTAkFVMRMwEQYDVQQIEwpTb21lLVN0YXRlMSEwHwYDVQQKExhJbnRlcm5ldCBX
aWRnaXRzIFB0eSBMdGQwHhcNMTkxMDEwMDE1MzE0WhcNMjAxMDA5MDE1MzE0WjBF
MQswCQYDVQQGEwJBVTETMBEGA1UECBMKU29tZS1TdGF0ZTEhMB8GA1UEChMYSW50
ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIIC
CgKCAgEAz+vS5dvX9qqcjuxLnsNvq1KU4EJaLOrjfC/+aO40205/qIYHaeXGw+n0
NxrccXDyXPsHXAGs/806g3Lc8wCuS43rmnpVjqdYLRnFege4OyG+7xmGGjPVtqBh
5agW7cfu8VOcV9Iv0nW/P2MYfN1PjUO4AFy5jaEssZF8av9fsplRKU0ud4ZTGIo3
gPLPWu2YZRXQHYiMmodS6mn4RYncKTiVSMCkrcOv9rWe0j0JfJC2dIO1aAr/tL2r
7AKS8YchT4+cj/oqR0xIEfVURiYv0o/+PVeENZ/VngBv57qI6b3nEQByL89LyaJh
J+gjSOq9MSQhQQ5YLSkoWsAbOdVahT0IYUy8+GKRY+/98tCCB9k1/Pgwaqd0rfkT
QTtpokxYEmqIQYe/Et/ktOkgud0+isCSL0euo8t4qNkvgCpilEQWDpALIWHVisXk
XruKGnios78I7PNjaVTjq69If0ULl8QhCyYNYHNNoisRIlObdWVWxy5XKgpLutOW
6i8rJvc2CruMr0KWsJ3U8T5Q40uXteUa2o5wH4uvaQkxt0G9XA/iWX+S44blAZYJ
iVCE9Fh6yyimykqIxw+X8qBFjR9ej9jdT/NvfWcx4mbvrRWdDrISgRCckTzO7Oeu
7kGcHCf+a/PAx9NuLMdumrBDMgnejMwe3yanVhyCJZ8MQIsPcIsCAwEAAaOBpzCB
pDAdBgNVHQ4EFgQUyCYrzeVnSsrA100NRLRLRGgthPYwdQYDVR0jBG4wbIAUyCYr
zeVnSsrA100NRLRLRGgthPahSaRHMEUxCzAJBgNVBAYTAkFVMRMwEQYDVQQIEwpT
b21lLVN0YXRlMSEwHwYDVQQKExhJbnRlcm5ldCBXaWRnaXRzIFB0eSBMdGSCCQDn
QIBMPVO/OjAMBgNVHRMEBTADAQH/MA0GCSqGSIb3DQEBBQUAA4ICAQDB4MnxGmYF
aPq0atZiqzJMtCC/y/WwsqHkU5Z3p7QC+S11VPI19F3RVpbMDoho/Z5Ds/PWAt6s
AZMoQAmdrst2at47/HQaLeIIGc68vHuBw3Lzzb5gg/USXihBzx9ugABlOb8h1S+T
YXT0TMXwJVgUQmW+2YNjKrd2O/s4PNw5CC3UXkBVdFs/+UG7xA6LSYK8tmX0n0py
pfZqiq0pS8k8JSCsTTmWAD1j3XbVPP+HIzNsKDmNjrrmXSWD7/BKz0Kt9UtmO/Fg
J0QB3zXVznR4rXpM4iQJ0U05Xpq8Km5n13xA8bof+go6nj0GrjA8nucnxH4AsDr6
yZThU7dV/t2yQskE6eiwAAeN2xOzwQe9dysykTgnznqli7tiYy5U4hdeWR8Yz9DA
GcyJ7D1ultBKZ5hdoa9e+EQOtuMn8+2COHYbPErw7SBlk6ZtQ5kO/rvzYIrVJMbE
CWQCIdDWXNE2IrSchVVrLbcw97tk5FBoFSBUhBEq78zyDgRBiF+ygnT6n+v3YrT7
/4Qp1sy58pwqnbmbHRPm9q94LGPN//nAbF6KxRe+o3VFOiNDTMD+3PRlICE6P+/Z
I0SAtTOxgZANGPKoRTslIWb/PDA7sHaGZoAIadKQlzJHtDOR1EFwJ6ABFQYz0bVJ
xD7xsZEsYPG8IDIHfH+zEivH7eb8eRbt/Q==
-----END CERTIFICATE-----`)
)

const (
	addr = "127.0.0.1:24444"
)

func main() {
	cliCrt, err := tls.X509KeyPair(clientCrt, clientKey)
	if err != nil {
		utils.Logger.Panic("try to load key & crt got error", zap.Error(err))
	}

	// load ca
	caCertPool := x509.NewCertPool()
	caCertPool.AppendCertsFromPEM(caCrt)

	// https tls config
	tlsConfig := &tls.Config{
		Certificates:       []tls.Certificate{cliCrt},
		RootCAs:            caCertPool,
		InsecureSkipVerify: true,
	}
	tlsConfig.BuildNameToCertificate()

	conn, err := tls.Dial("tcp", addr, tlsConfig)
	if err != nil {
		utils.Logger.Panic("try to dial tcp got error", zap.Error(err))
	}
	defer conn.Close()

	writer := bufio.NewWriter(conn)
	utils.Logger.Info("start writing")
	for {
		utils.Logger.Info("sending...")
		if _, err = writer.WriteString("hello, world\n"); err != nil {
			utils.Logger.Panic("try to write got error", zap.Error(err))
		}
		if err = writer.Flush(); err != nil {
			utils.Logger.Panic("try to flush got error", zap.Error(err))
		}
		time.Sleep(1 * time.Second)
	}
}
