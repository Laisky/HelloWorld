package main

import (
	"errors"
	"fmt"

	"github.com/Laisky/go-chaining"
)

var c = &chaining.Chain{}

func rootChainFunc() (int, error) {
	return 0, nil
}

func plus1(c *chaining.Chain) (interface{}, error) {
	v := c.GetInt()
	return v + 1, nil
}

func throwError(c *chaining.Chain) (r interface{}, err error) {
	return c.GetInt(), errors.New("some error happened")
}

func fail(err error) {
	fmt.Printf("deal with error: %v\n", err)
}

func main() {
	r := c.New(rootChainFunc()).
		Next(plus1).
		Next(plus1).
		Next(throwError). // will interupt chain
		Next(plus1).
		Fail(fail). // will recover chain
		Next(plus1).
		Next(plus1)

	fmt.Printf("got result: %v\n", r.GetInt())
	// r = 4
}
