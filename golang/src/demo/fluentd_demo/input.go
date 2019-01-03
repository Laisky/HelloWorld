package fluentd

import (
	"bufio"
	"fmt"
	"net"
	"reflect"
	"time"

	"github.com/ugorji/go/codec"
)

func RunInput() {
	ln, _ := net.Listen("tcp", "127.0.0.1:18081")

	_codec := &codec.MsgpackHandle{}
	_codec.MapType = reflect.TypeOf(map[string]interface{}(nil))
	_codec.RawToString = false

	for {
		conn, _ := ln.Accept()
		fmt.Println("got new connection", conn.RemoteAddr().String())
		go func(conn net.Conn) {
			defer conn.Close()

			dec := codec.NewDecoder(bufio.NewReader(conn), _codec)

			v := []interface{}{nil, nil, nil}
			err := dec.Decode(&v)
			if err != nil {
				fmt.Printf("got error: %+v", err)
				return
			}

			fmt.Println("--------------------------")
			fmt.Printf("tag: %v\n", string(v[0].([]byte)))
			fmt.Printf("time: %v\n", time.Unix(int64(v[1].(float64)), 0))
			fmt.Printf("msg: %+v\n", string(v[2].(map[string]interface{})["message"].([]byte)))
		}(conn)
	}
}
