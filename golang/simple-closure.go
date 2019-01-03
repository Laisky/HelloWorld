package main

import (
	"fmt"
)

func main() {
	adder := GetAdder(0)

	fmt.Println(adder(1))
	fmt.Println(adder(1))
	fmt.Println(adder(1))
	fmt.Println(adder(1))
}

func GetAdder(init int) func(int) int {

	return func(num int) int {
		init += num
		return init
	}
}
