//+build gofuzz

package fuzz


import (
	"demo/fuzz_demo"
)


func FuzzFoo(input []byte) int {
	bug.Foo(input)

	if len(input)>0 && input[0] == 'a' {
		return 1
	}

	return 0
}
