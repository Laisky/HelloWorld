package main

import (
	"bufio"
	"compress/gzip"
	"io"
	"os"

	"github.com/Laisky/go-utils"
	"go.uber.org/zap"
)

func main() {
	// Write
	fp, err := os.OpenFile("/Users/laisky/Downloads/test.txt.gz", os.O_CREATE|os.O_RDWR, 0666)
	if err != nil {
		utils.Logger.Panic("open file got error", zap.Error(err))
	}

	fpb := bufio.NewWriter(fp)
	gwriter := gzip.NewWriter(fpb)
	for i := 0; i < 100; i++ {
		if _, err = gwriter.Write([]byte("1234567890")); err != nil {
			utils.Logger.Panic("write date got error", zap.Error(err))
		}

		gwriter.Flush()
	}

	gwriter.Close()
	fpb.Flush()
	fp.Seek(0, 0)

	// Read
	fpc := bufio.NewReader(fp)
	greader, err := gzip.NewReader(fpc)
	if err != nil {
		utils.Logger.Panic("create gzip reader got error", zap.Error(err))
	}

	cnt := make([]byte, 10)
	for {
		n, err := greader.Read(cnt)
		if err == io.EOF {
			utils.Logger.Info("all done")
			break
		}
		if err != nil {
			utils.Logger.Panic("try to load file got error", zap.Error(err))
		}

		utils.Logger.Info("read bytes", zap.Int("n", n), zap.ByteString("cnt", cnt))

	}

}
