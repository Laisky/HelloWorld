package main

import "fmt"

func twoSum(nums []int, target int) []int {
	remainsMap := make(map[int]int)
	for i, v := range nums {
		if val, ok := remainsMap[v]; ok {
			return []int{val, i}
		}
		remainsMap[target-v] = i
	}

	return []int{}
}

func main() {
	// twosum
	fmt.Println(twoSum([]int{1, 2, 4, 8}, 6)) // [1, 2]
}
