package fluentd

import (
	"fmt"
	"net"
	"reflect"
	"time"

	"github.com/ugorji/go/codec"
)

type TinyFluentRecord struct {
	Timestamp uint64
	Data      map[string]interface{}
}

func RunOutput() {
	conn, _ := net.DialTimeout("tcp", "127.0.0.1:24225", 10*time.Second)
	fmt.Println("connected to remote")

	_codec := &codec.MsgpackHandle{}
	_codec.MapType = reflect.TypeOf(map[string]interface{}(nil))
	_codec.RawToString = false

	tag := "spring.sit"
	// msg := FluentRecordSet{
	// 	Tag: tag,
	// 	Records: []*TinyFluentRecord{
	// 		&TinyFluentRecord{Data: map[string]interface{}{"message": "test msg 1"}},
	// 		&TinyFluentRecord{Data: map[string]interface{}{"message": "test msg 2"}},
	// 	},
	// }
	msg := map[string]interface{}{
		"log": "2018-03-06 16:56:22.514 | mscparea | INFO  | http-nio-8080-exec-1 | com.pateo.qingcloud.cp.core.service.impl.CPBusiness.reflectAdapterRequest | 84: test",
	}

	for {
		enc := codec.NewEncoder(conn, _codec)
		err := enc.Encode([]interface{}{tag, nil, msg})
		if err != nil {
			fmt.Printf("got error: %+v", err)
		}

		time.Sleep(1 * time.Second)

	}
}
