package main

import "fmt"

func main() {
	fmt.Println(1)
	goto LABEL
	fmt.Println(2) // jump
LABEL:
	fmt.Println(3)
}
