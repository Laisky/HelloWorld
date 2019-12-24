package test

import (
	"sync/atomic"
	"testing"
)

type noPadding struct {
	a, b, c uint64
}

type padding struct {
	a   uint64
	_p1 [8]uint64
	b   uint64
	_p2 [8]uint64
	c   uint64
}

func BenchmarkFakeSharing(b *testing.B) {
	const nFork = 4
	b.ResetTimer()
	b.Run("no padding individual var", func(b *testing.B) {
		noPaddingData := new(noPadding)
		b.RunParallel(func(pb *testing.PB) {
			for pb.Next() {
				atomic.AddUint64(&noPaddingData.a, 1)
			}
		})
		b.RunParallel(func(pb *testing.PB) {
			for pb.Next() {
				atomic.AddUint64(&noPaddingData.b, 1)
			}
		})
		b.RunParallel(func(pb *testing.PB) {
			for pb.Next() {
				atomic.AddUint64(&noPaddingData.c, 1)
			}
		})
	})

	b.ResetTimer()
	b.Run("no padding all vars", func(b *testing.B) {
		noPaddingData := new(noPadding)
		for i := 0; i < nFork; i++ {
			b.RunParallel(func(pb *testing.PB) {
				for pb.Next() {
					atomic.AddUint64(&noPaddingData.a, 1)
					atomic.AddUint64(&noPaddingData.b, 1)
					atomic.AddUint64(&noPaddingData.c, 1)
				}
			})
		}
	})

	b.ResetTimer()
	b.Run("padding individual var", func(b *testing.B) {
		paddingData := new(padding)
		b.RunParallel(func(pb *testing.PB) {
			for pb.Next() {
				atomic.AddUint64(&paddingData.a, 1)
			}
		})
		b.RunParallel(func(pb *testing.PB) {
			for pb.Next() {
				atomic.AddUint64(&paddingData.b, 1)
			}
		})
		b.RunParallel(func(pb *testing.PB) {
			for pb.Next() {
				atomic.AddUint64(&paddingData.c, 1)
			}
		})
	})

	b.ResetTimer()
	b.Run("padding all vars", func(b *testing.B) {
		paddingData := new(padding)
		for i := 0; i < nFork; i++ {
			b.RunParallel(func(pb *testing.PB) {
				for pb.Next() {
					atomic.AddUint64(&paddingData.a, 1)
					atomic.AddUint64(&paddingData.b, 1)
					atomic.AddUint64(&paddingData.c, 1)
				}
			})
		}
	})
}
