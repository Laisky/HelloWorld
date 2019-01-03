package main_test

import (
	"bufio"
	"io/ioutil"
	"os"
	"testing"

	utils "github.com/Laisky/go-utils"
)

func BenchmarkWrite(b *testing.B) {
	fp, err := ioutil.TempFile("", "fs-test")
	if err != nil {
		b.Fatalf("%+v", err)
	}
	defer fp.Close()
	defer os.Remove(fp.Name())
	b.Logf("create file name: %v", fp.Name())

	fpBuf := bufio.NewWriter(fp)
	data := []byte(utils.RandomStringWithLength(2048))
	b.Run("direct write", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			if _, err = fp.Write(data); err != nil {
				b.Fatalf("got error: %+v", err)
			}
		}
	})

	b.Run("write default buf", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			if _, err = fpBuf.Write(data); err != nil {
				b.Fatalf("got error: %+v", err)
			}
		}
	})

	b.Run("write default buf with flush", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			if _, err = fpBuf.Write(data); err != nil {
				b.Fatalf("got error: %+v", err)
			}
			if err = fpBuf.Flush(); err != nil {
				b.Fatalf("got error: %+v", err)
			}
		}
	})

}
