package main

import (
	"runtime"
	"testing"
)

// goos: linux
// goarch: amd64
// pkg: github.com/Laisky/HelloWorld/golang/false_sharing
// cpu: AMD Ryzen 7 5700G with Radeon Graphics
// BenchmarkFalseSharing/notpadded_1core-16                      13          88986612 ns/op              64 B/op          2 allocs/op
// BenchmarkFalseSharing/notpadded-16                             3         556081963 ns/op            6778 B/op         31 allocs/op
// BenchmarkFalseSharing/padded-16                                4         282946009 ns/op            4424 B/op         25 allocs/op
// PASS
// ok      github.com/Laisky/HelloWorld/golang/false_sharing       6.587s
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
