package main_test

import (
	"io"
	"io/ioutil"
	"net"
	"net/http"
	"sync"
	"testing"
	"time"

	"github.com/Laisky/go-utils"
	reuse "github.com/libp2p/go-reuseport"
	"go.uber.org/zap"
)

var (
	httpClient = &http.Client{ // default http client
		Transport: &http.Transport{
			MaxIdleConnsPerHost: 20,
		},
		Timeout: time.Duration(30) * time.Second,
	}
	addr = "127.0.0.1:28491"
)

func runSrv(closed chan struct{}) {
	ln, err := reuse.Listen("tcp", addr)
	if err != nil {
		utils.Logger.Panic("start listener got error", zap.Error(err))
	}

	for {
		select {
		case <-closed:
			return
		default:
		}

		conn, err := ln.Accept()
		if err != nil {
			utils.Logger.Error("accept conn got error", zap.Error(err))
		}

		go handleConn(conn)
	}
}

func handleConn(conn net.Conn) {
	if _, err := io.Copy(conn, conn); err != nil {
		utils.Logger.Error("try to response got error", zap.Error(err))
	}
}

func BenchmarkReuseport(b *testing.B) {
	closed := make(chan struct{})
	go runSrv(closed)
	count := 0
	wg := &sync.WaitGroup{}
	b.Run("simple", func(b *testing.B) {
		for gi := 0; gi < 50; gi++ {
			go func() {
				wg.Add(1)
				conn, err := net.DialTimeout("tcp", addr, 3*time.Second)
				if err != nil {
					b.Errorf("tcp dial got error: %+v", err)
				}
				defer conn.Close()

				for i := 0; i < b.N; i++ {
					ioutil.ReadAll(conn)
					conn.Write([]byte("yeo"))
				}
			}()
		}

		wg.Wait()
		close(closed)
	})

	b.Logf("success %v", count)
}
