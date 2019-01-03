package main

import "fmt"

func main() {
	defer fmt.Println("world")
	defer fmt.Println("hello, ")

	deferDemo()
}

func deferDemo() {
	defer println()
	for i := 0; i < 5; i++ {
		defer func() {
			print(i, " ")
		}()
	}
}
