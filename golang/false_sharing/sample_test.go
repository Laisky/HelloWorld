package main

import (
	"runtime"
	"testing"
)

// cpu: AMD Ryzen 7 5700G with Radeon Graphics
// BenchmarkFalseSharing
// BenchmarkFalseSharing/notpadded
// BenchmarkFalseSharing/notpadded-16         	       1	5020354358 ns/op	   31280 B/op	      79 allocs/op
// BenchmarkFalseSharing/padded
// BenchmarkFalseSharing/padded-16            	       1	4967160945 ns/op	    7024 B/op	      32 allocs/op
// PASS
//
//	github.com/Laisky/HelloWorld/golang/false_sharing	coverage: 45.2% of statements
//
// ok  	github.com/Laisky/HelloWorld/golang/false_sharing	10.022s
func BenchmarkFalseSharing(b *testing.B) {
	total := int(1e6)
	ncpu := runtime.NumCPU()

	b.Run("notpadded 1core", func(b *testing.B) {
		counter := new(NotPaddedCounter)
		b.ResetTimer()
		for i := 0; i < b.N; i++ {
			runner(counter, total*ncpu, 1)
		}
	})

	b.Run("notpadded", func(b *testing.B) {
		counter := new(NotPaddedCounter)
		b.ResetTimer()
		for i := 0; i < b.N; i++ {
			runner(counter, total, ncpu)
		}
	})

	b.Run("padded", func(b *testing.B) {
		counter := new(PaddedCounter)
		b.ResetTimer()
		for i := 0; i < b.N; i++ {
			runner(counter, total, ncpu)
		}
	})
}
