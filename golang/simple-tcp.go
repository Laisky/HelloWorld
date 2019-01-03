package main

import (
	"bufio"
	"fmt"
	"io"
	"net"
	"reflect"

	"github.com/ugorji/go/codec"
)

func main() {
	ln, _ := net.Listen("tcp", "127.0.0.1:18081")

	for {
		fmt.Println("waiting for new conn...")
		conn, _ := ln.Accept()

		go func(conn, net.Conn) {
			defer conn.Close)
			reader := bufio.NewReader(conn)

			_codec := codec.MsgpackHandle{}
			_codec.MapType = reflect.TypeOf(map[string]interface{}(nil))
			_codec.RawToString = false
			dec := codec.NewDecoder(reader, _codec)

			for reader.Len()>0{
				entry:= []interface{}{}
				if err:=dec.Decode(&entry);err==io.EOF{
					break
				}
			}

		}(conn)
	}
}
