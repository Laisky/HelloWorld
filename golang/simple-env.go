package main

import (
	"fmt"
	"os"
)

func main() {
	e := os.Getenv("yeo")
	if e == "" {
		e = "123"
	}

	fmt.Println(e)
}
