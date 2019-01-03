package thrift_demo

import (
	"fmt"
	"thrift_demo/hello"

	"git.apache.org/thrift.git/lib/go/thrift"
)

func runServer(transportFactory thrift.TTransportFactory, protocolFactory thrift.TProtocolFactory, addr string, secure bool) error {
	var transport thrift.TServerTransport
	var err error
	// if secure {
	// 	cfg := new(tls.Config)
	// 	if cert, err := tls.LoadX509KeyPair("server.crt", "server.key"); err == nil {
	// 		cfg.Certificates = append(cfg.Certificates, cert)
	// 	} else {
	// 		return err
	// 	}
	// 	transport, err = thrift.NewTSSLServerSocket(addr, cfg)
	// } else {
	// 	transport, err = thrift.NewTServerSocket(addr)
	// }

	transport, err = thrift.NewTServerSocket(addr)
	if err != nil {
		return err
	}
	fmt.Printf("%T\n", transport)
	handler := NewCalculatorHandler()
	processor := hello.NewCalculatorProcessor(handler)
	server := thrift.NewTSimpleServer4(processor, transport, transportFactory, protocolFactory)

	fmt.Println("Starting the simple server... on ", addr)
	return server.Serve()
}
