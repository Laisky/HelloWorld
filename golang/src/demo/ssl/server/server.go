package main

import (
	"bufio"
	"crypto/tls"
	"crypto/x509"
	"fmt"
	"net"

	"github.com/Laisky/go-utils"
	"github.com/Laisky/zap"
)

var (
	serverKey = []byte(`-----BEGIN RSA PRIVATE KEY-----
MIICXwIBAAKBgQCzguWNYOoEgZNpJ5MY+sHCiSvNNWx84YoN/JwbsXkdfnVn8Aur
ufUqXd9NVVBm24J9DSbc+kciIbQerquVpHqdt/ekcuVBDnta5L5m4DdC9xjYqNcf
ncOp0cxklCxYpBaXqyKV/PZIVFkakDjuzPsIpwruFzVp1gXTYQftiE0eGQIDAQAB
AoGBAKj++CDrNiTb3+1FJoSDvdnozWW5f9LpedDFGiowIDeWD+2z3SjkPlyOV2U0
hibvTJ9xvD6ZGFKXrDyecEbGu+8fldTGZOKzve9fhNNPK6pVE8FT6lyEmGfZhOoH
uO2L0rjrI0Sb4GzSb/GW43IBTA8JHRTNN/DyNrHn/+PS2r2hAkEA3lGRPDOikBA+
WkPCiNicQzZmX/68wv0Lx76MevcFqBjQQ1BvO1JQN5t6urqfqQ1H1RZss73IvE//
p/gnuBqGDQJBAM61FeSjyg7q1DBOkLUDnE00/4JyQ1/c9pv880X7otiKAPCFZlWs
Q8hXiUiUr7tNF9dsXn3+lj7QdNXKtIQhoT0CQQCPBWhqk0lEZr7GMQtIIBm+/5My
tF1ZD5Nxh7s2LA4+iuAIPgmg3x5t958n24F1Lu8EPa3mn/QweUKeG33p6V5NAkEA
nAwC2hd4G6jVxR4aijyOi46d8ZlXGZCTL5FXChb8ieIs8WaTqcuhZCYJQpzUyV5a
yEtMTmuaexMdkKQ1gKZutQJBAKMNnhMLAspV49zjW43y7MpKtx9UcwhRWBJk+Qgq
U/bp2jv5RlBg1cCmdZn1rAnYbV+kubJ93X+NnQc2sKtsuYA=
-----END RSA PRIVATE KEY-----`)
	serverCrt = []byte(`-----BEGIN CERTIFICATE-----
MIIDnjCCAYYCAQEwDQYJKoZIhvcNAQEFBQAwRTELMAkGA1UEBhMCQVUxEzARBgNV
BAgTClNvbWUtU3RhdGUxITAfBgNVBAoTGEludGVybmV0IFdpZGdpdHMgUHR5IEx0
ZDAeFw0xOTEwMTAwNzEyMjdaFw0yMDEwMDkwNzEyMjdaMGkxCzAJBgNVBAYTAmNu
MRMwEQYDVQQIEwpTb21lLVN0YXRlMSEwHwYDVQQKExhJbnRlcm5ldCBXaWRnaXRz
IFB0eSBMdGQxIjAgBgNVBAMTGTEyNy4wLjAuMToyNDQ0NCwxMjcuMC4wLjEwgZ8w
DQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBALOC5Y1g6gSBk2knkxj6wcKJK801bHzh
ig38nBuxeR1+dWfwC6u59Spd301VUGbbgn0NJtz6RyIhtB6uq5Wkep2396Ry5UEO
e1rkvmbgN0L3GNio1x+dw6nRzGSULFikFperIpX89khUWRqQOO7M+winCu4XNWnW
BdNhB+2ITR4ZAgMBAAEwDQYJKoZIhvcNAQEFBQADggIBAGoP0P6zIQpXUzZrFalI
J97f1hzkW+BwqZ0XtYWF+8Tb2aWHfr6CmU20XezoJ84eE5cAc5XcWB2ez5ETznq4
7NXA31lN/khjJJUxKkJhE1Ct9E+e6gGMn4DR0ZdlfvPp72KqTBhe24bnSSGcS34d
AGtkN1EpexIONXYGARCANWTMe4cQgmaKN09raTxEuVM+jrGDiMfaSm0st2zO/l/S
EcQ2UQ1XLoUOqCrjFM038vxKvFvEkdDaz5VdoPCDGb0pVxYCj70ClD7VOWGIl70a
37Tih9K5FH3VKMQQwZjeB/2Mxn5JkGthRCi/G2H7CCw1gAXphhvPWYar/lVDDGNv
7BlmNwwHDnsG/i/EB9ieUhSdGdbJ8rBZ6gSGx4cWFSRPhIsDO+GZClvjgs8LXN7m
1mfCwF4RmuBSzcPY/QQCnpSH6mYqn7fOaKMCKwQL3x5V7aif2UfG94CTJL2LnRkw
dB3rgzHqbwKiS4iXvaNSehIm0mzw0aNN81kmStCB5NmHv66YIFlznss0iH+QUf6y
/hdqWwd1FW1drzj4OKY23V3e64+AkEzRyWk6SVpLCZuxqAys4ooiYH+bj0GDsrLc
fxpOUjHiuboitqxZ8fE+pVGbGXQWHrtwRg02l9ga5Rainyo4gAj+Zoiy/acbuMDV
bd2si0VgwJ2KiU68GiRJr1ck
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
	addr = "1.1.1.1:24444"
)

func main() {
	srvCert, err := tls.X509KeyPair(serverCrt, serverKey)
	if err != nil {
		utils.Logger.Panic("try to load key & crt got error", zap.Error(err))
	}

	// load ca
	caCertPool := x509.NewCertPool()
	caCertPool.AppendCertsFromPEM(caCrt)

	// https tls config
	tlsConfig := &tls.Config{
		Certificates: []tls.Certificate{srvCert},
		// RootCAs:            caCertPool,
		ClientCAs:          caCertPool,
		InsecureSkipVerify: false,
		ClientAuth:         tls.RequireAndVerifyClientCert,
	}
	tlsConfig.BuildNameToCertificate()

LISTEN_LOOP:
	for {
		// tlsConfig.BuildNameToCertificate()
		ln, err := tls.Listen("tcp", addr, tlsConfig)
		if err != nil {
			utils.Logger.Error("try to listen tcp got error", zap.Error(err))
			break LISTEN_LOOP
		}
		utils.Logger.Info("listening...", zap.String("addr", addr))

		var (
			tlsConn *tls.Conn
			ok      bool
		)
	ACCEPT_LOOP:
		for {
			conn, err := ln.Accept()
			if err != nil {
				utils.Logger.Error("accept conn got error", zap.Error(err))
				break ACCEPT_LOOP
			}
			if tlsConn, ok = conn.(*tls.Conn); !ok {
				utils.Logger.Info("refuse connection since tls error")
				continue ACCEPT_LOOP
			}

			state := tlsConn.ConnectionState()
			fmt.Printf(">> Version: %x\n", state.Version)
			fmt.Printf(">> HandshakeComplete: %t\n", state.HandshakeComplete)
			fmt.Printf(">> DidResume: %t\n", state.DidResume)
			fmt.Printf(">> CipherSuite: %x\n", state.CipherSuite)
			fmt.Printf(">> NegotiatedProtocol: %s\n", state.NegotiatedProtocol)
			fmt.Printf(">> NegotiatedProtocolIsMutual: %t\n", state.NegotiatedProtocolIsMutual)
			for i, cert := range state.PeerCertificates {
				subject := cert.Subject
				issuer := cert.Issuer
				fmt.Printf(">> %d s:/C=%v/ST=%v/L=%v/O=%v/OU=%v/CN=%s\n", i, subject.Country, subject.Province, subject.Locality, subject.Organization, subject.OrganizationalUnit, subject.CommonName)
				fmt.Printf(">>    i:/C=%v/ST=%v/L=%v/O=%v/OU=%v/CN=%s\n", issuer.Country, issuer.Province, issuer.Locality, issuer.Organization, issuer.OrganizationalUnit, issuer.CommonName)
			}

			go handle(tlsConn)
		}
		ln.Close()
	}
}

func handle(conn net.Conn) {
	utils.Logger.Info("got connection", zap.String("remote", conn.RemoteAddr().String()))
	defer utils.Logger.Info("close connection", zap.String("remote", conn.RemoteAddr().String()))
	defer conn.Close()
	reader := bufio.NewReader(conn)
	var (
		err     error
		content string
	)
	for {
		if content, err = reader.ReadString('\n'); err != nil {
			utils.Logger.Error("try to read got error", zap.Error(err))
			break
		}

		utils.Logger.Info("got", zap.String("cnt", content))
	}
}
