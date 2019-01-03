package fluentd

import (
	"sync"

	"github.com/ugorji/go/codec"
)

func RunConcurrent() {

	// _codec := &codec.MsgpackHandle{}
	// _codec.MapType = reflect.TypeOf(map[string]interface{}(nil))
	// _codec.RawToString = false

	// encoder := codec.NewEncoderBytes(&bb, &codec.MsgpackHandle{})
	wg := &sync.WaitGroup{}
	// bb := []byte{}

	for i := 0; i < 100; i++ {
		wg.Add(1)
		go func() {
			bb := []byte{}
			msg := map[string]interface{}{"test": "yo"}
			msgWrap := []interface{}{nil, nil, nil}
			defer wg.Done()
			encoder := codec.NewEncoderBytes(&bb, &codec.MsgpackHandle{})
			for i := 0; i < 100; i++ {
				msgWrap[0] = "tag"
				msgWrap[2] = msg
				encoder.Encode(msg)
			}
		}()
	}

	wg.Wait()
	// fmt.Println(string(bb))
}
