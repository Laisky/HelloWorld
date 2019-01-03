package main

import "fmt"

func main() {
	var em map[int]int
	fmt.Println("emp", em)

	var m = map[int]int{}
	fmt.Println("emp", m)
	m[2] = 3
	fmt.Println(m)

	if _, ok := m[99]; !ok {
		fmt.Println("not exists in map")
	}
}
