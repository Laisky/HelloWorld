package test

import (
	"fmt"
	"testing"
)

func foo() (err error) {
	defer func() {
		if err != nil {
			fmt.Println("got err:", err)
		}
	}()

	return fmt.Errorf("123")
}
func TestDefer(t *testing.T) {
	_ = foo()
	t.Error()
}
