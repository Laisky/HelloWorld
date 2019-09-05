package main_test

import "testing"

/*
BenchmarkBound/normal-4         	200000000	         7.69 ns/op	       0 B/op	       0 allocs/op
BenchmarkBound/reorder-4        	300000000	         5.49 ns/op	       0 B/op	       0 allocs/op
*/
func BenchmarkBound(b *testing.B) {
	var (
		v                         = make([]int, 9)
		A, B, C, D, E, F, G, H, I int
	)
	b.ReportAllocs()
	b.Run("normal", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			A = v[0]
			B = v[1]
			C = v[2]
			D = v[3]
			E = v[4]
			F = v[5]
			G = v[6]
			H = v[7]
			I = v[8]
		}
	})

	b.Run("reorder", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			I = v[8]
			A = v[0]
			B = v[1]
			C = v[2]
			D = v[3]
			E = v[4]
			F = v[5]
			G = v[6]
			H = v[7]
		}
	})

	b.Log(A, B, C, D, E, F, G, H, I)
}
