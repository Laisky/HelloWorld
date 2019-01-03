package main

import "fmt"

// func demo() {
// 	var (
// 		s1 = []int{}
// 		s2 = make([]int, 10)
// 	)
// }

func main() {
	var s []int

	s = append(s, 1)
	fmt.Println("emp", s)

	fmt.Println("-------------------------")
	arr := [50]int{}
	s = arr[0:10]
	fmt.Println(">> len", len(s)) // 10
	fmt.Println(">> cap", cap(s)) // 50

	fmt.Println("-------------------------")
	var s2 []int
	fmt.Println(cap(s2)) // 0
	fmt.Println(len(s2)) // 0
	s2 = append(s2, 1)
	fmt.Println(s2)
}
