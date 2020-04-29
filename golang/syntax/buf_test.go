package test

import (
	"bytes"
	"testing"
)

func TestBytesBuffer(t *testing.T) {
	buf := bytes.NewBuffer([]byte{})

	for i := 0; i < 1000; i++ {
		buf.Write([]byte("1"))
	}

	t.Logf("len: %d", buf.Len())
	t.Logf("len: %d", buf.Len())
	t.Error()
}
