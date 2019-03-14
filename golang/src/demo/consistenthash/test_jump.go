package test_main

import "fmt"

func JumpHash(key uint64, buckets int) int {
	var b, j int64

	if buckets <= 0 {
		panic(fmt.Errorf("buckets should greater than 0"))
	}

	for j < int64(buckets) {
		b = j
		key = key*2862933555777941757 + 1
		j = int64(float64(b+1) * (float64(int64(1)<<31) / float64((key>>33)+1)))
	}

	return int(b)
}

func TestJumpHash() {

}
