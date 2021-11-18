package fluentd

import (
	"bufio"
	"bytes"
	"fmt"
	"net"
	"reflect"
	"time"

	"github.com/ugorji/go/codec"
)

type FluentRecordSet struct {
	Tag     string
	Records []*TinyFluentRecord
}

func RunBatchOutput() {
	conn, _ := net.DialTimeout("tcp", "127.0.0.1:24225", 10*time.Second)
	fmt.Println("connected to remote")

	_codec := &codec.MsgpackHandle{}
	_codec.MapType = reflect.TypeOf(map[string]interface{}(nil))
	_codec.RawToString = false

	tag := "spring.sit"

	msgs := []map[string]interface{}{
		map[string]interface{}{"message": "test msg 1"},
		map[string]interface{}{"message": "test msg 2"},
		map[string]interface{}{"message": "test msg 3"},
		map[string]interface{}{"message": "test msg 4"},
		map[string]interface{}{"message": "test msg 5"},
		map[string]interface{}{"message": "test msg 6"},
	}
	// msg := map[string]interface{}{
	// 	"log": "2018-03-06 16:56:22.514 | mscparea | INFO  | http-nio-8080-exec-1 | com.laisky.qingcloud.cp.core.service.impl.CPBusiness.reflectAdapterRequest | 84: test",
	// }

	var err error
	for {
		msgBytes := &bytes.Buffer{}
		msgBuf := bufio.NewWriter(msgBytes)

		enc := codec.NewEncoder(conn, _codec)
		enc2 := codec.NewEncoder(msgBuf, _codec)

		for _, msg := range msgs {
			if err = enc2.Encode([]interface{}{0, msg}); err != nil {
				fmt.Printf("got error: %+v", err)
			}
		}

		msgBuf.Flush()
		err := enc.Encode([]interface{}{tag, msgBytes.Bytes(), nil})
		if err != nil {
			fmt.Printf("got error: %+v", err)
		}

		time.Sleep(1 * time.Second)

	}
}
