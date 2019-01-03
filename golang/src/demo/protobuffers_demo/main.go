package main

import (
	"bufio"
	"demo/protobuffers_demo/protos"
	"encoding/binary"
	"fmt"
	"io"
	"os"
	"testing"

	utils "github.com/Laisky/go-utils"
	proto "github.com/golang/protobuf/proto"
	"go.uber.org/zap"
)

func BenchmarkMarshal(b *testing.B) {
	msg := &dockerlog.Message{
		Msg: map[string]string{
			"log":          "jeji23je3jeoei32ej23oe",
			"tag":          "test.sit",
			"container_id": "docker",
		},
		Tag:    "test.sit",
		Offset: -1,
	}

	var (
		db  []byte
		err error
	)
	b.Run("marshal", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			db, err = proto.Marshal(msg)
			if err != nil {
				b.Fatalf("marshal error %+v\n", err)
			}
		}
	})

	var msg2 = &dockerlog.Message{}
	b.Run("unmarshal", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			if err = proto.Unmarshal(db, msg2); err != nil {
				b.Fatalf("marshal error %+v\n", err)
			}

			if msg2.GetTag() != "test.sit" ||
				msg2.GetOffset() != -1 ||
				msg2.GetMsg()["container_id"] != "docker" {
				b.Fatalf("msg mismatch")
			}
		}
	})

}

func BenchmarkStreamMarshal(b *testing.B) {
	// fp, err := ioutil.TempFile("", "journal-test")
	// if err != nil {
	// 	b.Fatalf("%+v", err)
	// }
	// defer fp.Close()
	// defer os.Remove(fp.Name())
	// b.Logf("create file name: %v", fp.Name())

	fp, err := os.OpenFile("/Users/laisky/Downloads/pbtest.dat", os.O_RDWR|os.O_CREATE, 0664)
	if err != nil {
		b.Fatalf("got error %+v", err)
	}
	defer fp.Close()

	msg := &dockerlog.Message{
		Msg: map[string]string{
			"log":          "jeji23je3jeoei32ej23oe",
			"tag":          "test.sit",
			"container_id": "docker",
		},
		Tag:    "test.sit",
		Offset: -1,
	}

	var (
		db    []byte
		sizeb = make([]byte, 8)
	)
	writer := bufio.NewWriterSize(fp, 1024*1024*4)
	b.Run("pb-writefile", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			b.Logf("write bufferd: %v", writer.Buffered())
			if db, err = proto.Marshal(msg); err != nil {
				b.Fatalf("marshal error %+v\n", err)
			}

			binary.LittleEndian.PutUint64(sizeb, uint64(len(db)))
			if _, err = writer.Write(sizeb[:3]); err != nil {
				b.Fatalf("got error: %+v", err)
			}
			if _, err = writer.Write(db); err != nil {
				b.Fatalf("got error: %+v", err)
			}
		}
	})
	writer.Flush()
	fp.Sync()

	var (
		msg2    = &dockerlog.Message{}
		dataLen uint64
	)
	db = make([]byte, 16777215)

	if _, err = fp.Seek(0, 0); err != nil {
		b.Fatalf("got error: %+v", err)
	}

	fs, _ := fp.Stat()
	b.Logf("file size: %v", fs.Size())
	// b.Fatal()

	reader := bufio.NewReaderSize(fp, 1024*1024*4)
	nmsg := 0
	b.Run("pb-readfile", func(b *testing.B) {
		// for i := 0; i < b.N; i++ {
		for {
			b.Logf("buffered: %v", reader.Buffered())
			if _, err = reader.Read(sizeb[:3]); err == io.EOF {
				b.Fatalf("file EOF")
				break
			} else if err != nil {
				b.Fatalf("got error: %+v", err)
			}
			dataLen = binary.LittleEndian.Uint64(sizeb)
			// b.Logf("datalen: %v", dataLen)

			if _, err = reader.Read(db[:dataLen]); err != nil {
				b.Fatalf("got error: %+v", err)
			}

			if err = proto.Unmarshal(db[:dataLen], msg2); err != nil {
				b.Fatalf("marshal error %+v\n", err)
			}

			nmsg++
			// b.Logf(">> got msg[%v]: %v", nmsg, msg2)
			if msg2.GetTag() != "test.sit" ||
				msg2.GetOffset() != -1 ||
				msg2.GetMsg()["container_id"] != "docker" {
				b.Fatalf("msg mismatch")
			}
		}
	})

	b.Fatalf("done [%v]", nmsg)
}

func main() {
	utils.SetupLogger("debug")

	// read file
	fp, err := os.OpenFile("/Users/laisky/Downloads/pbtest.dat", os.O_RDWR|os.O_CREATE, 0664)
	if err != nil {
		utils.Logger.Error("got error", zap.Error(err))
	}
	// defer os.Remove(fp.Name())
	defer fp.Close()

	var (
		sizeb   = make([]byte, 4)
		dataLen uint32
		db      = make([]byte, 16777215)
		msg     = &dockerlog.Message{
			Msg: map[string]string{
				"log":          "jeji23je3jeoei32ej23oe",
				"tag":          "test.sit",
				"container_id": "docker",
			},
			Tag:    "test.sit",
			Offset: -1,
		}
	)

	// write
	writer := bufio.NewWriterSize(fp, 1024*1024*4)
	for i := 0; i < 10; i++ {
		// utils.Logger.Debug("write bufferd", zap.Int("len", writer.Buffered()))
		if db, err = proto.Marshal(msg); err != nil {
			utils.Logger.Error("marshal error", zap.Error(err))
		}

		binary.LittleEndian.PutUint32(sizeb, uint32(len(db)))
		if _, err = writer.Write(sizeb); err != nil {
			utils.Logger.Error("got error", zap.Error(err))
		}
		if _, err = writer.Write(db); err != nil {
			utils.Logger.Error("got error", zap.Error(err))
		}
	}

	writer.Flush()
	fp.Sync()
	fp.Seek(0, 0)

	var (
		reader = bufio.NewReaderSize(fp, 1024*1024*4)
		nmsg   = 0
		msg2   = &dockerlog.Message{}
	)

	// read
	for {
		utils.Logger.Debug("buffered", zap.Int("len", reader.Buffered()))
		if _, err = reader.Read(sizeb); err == io.EOF {
			utils.Logger.Error("got error", zap.Error(err))
			break
		} else if err != nil {
			utils.Logger.Error("got error", zap.Error(err))
		}
		dataLen = binary.LittleEndian.Uint32(sizeb)
		utils.Logger.Debug("datalen", zap.Uint32("len", dataLen))

		if _, err = reader.Read(db[:dataLen]); err != nil {
			utils.Logger.Error("got error", zap.Error(err))
		}

		if err = proto.Unmarshal(db[:dataLen], msg2); err != nil {
			utils.Logger.Error("got error", zap.Error(err))
		}

		nmsg++
		utils.Logger.Debug("got msg", zap.Int("count", nmsg), zap.String("msg", fmt.Sprintf("%v", msg2)))
		if msg2.GetTag() != "test.sit" ||
			msg2.GetOffset() != -1 ||
			msg2.GetMsg()["container_id"] != "docker" {
			utils.Logger.Debug("msg mismatch")
		}
	}

	utils.Logger.Info("all done", zap.Int("total", nmsg))

}
