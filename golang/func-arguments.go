package main

import (
	"fmt"
)

// VariableLengthFunc name 是一个 slice
func VariableLengthFunc(prefix string, name ...string) {
	for _, n := range name {
		fmt.Println(prefix + n)
	}
}

func main() {
	VariableLengthFunc("hello: ", "alice", "bob", "carlo", "dave")
}
