package test_uber

import (
	"context"
	"testing"
)

/*
BenchmarkChannel/size_0-4         	 1102160	      1348 ns/op	       0 B/op	       0 allocs/op
BenchmarkChannel/size_1-4         	 1000000	      1195 ns/op	       0 B/op	       0 allocs/op
BenchmarkChannel/size_100-4       	 2956615	       431 ns/op	       0 B/op	       0 allocs/op
BenchmarkChannel/size_1000-4    	 4134514	       278 ns/op	       0 B/op	       0 allocs/op
PASS
*/
func BenchmarkChannel(b *testing.B) {
	c0 := make(chan int)
	ctx, cancel := context.WithCancel(context.Background())
	runConsumer(ctx, c0)
	b.Run("size 0", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			c0 <- i
		}
	})
	cancel()

	c1 := make(chan int, 1)
	ctx, cancel = context.WithCancel(context.Background())
	runConsumer(ctx, c1)
	b.Run("size 1", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			c1 <- i
		}
	})
	cancel()

	c100 := make(chan int, 100)
	ctx, cancel = context.WithCancel(context.Background())
	runConsumer(ctx, c100)
	b.Run("size 100", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			c100 <- i
		}
	})
	cancel()

	c1000 := make(chan int, 1000)
	ctx, cancel = context.WithCancel(context.Background())
	runConsumer(ctx, c1000)
	b.Run("size 1000", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			c1000 <- i
		}
	})
	cancel()
}

func runConsumer(ctx context.Context, c chan int) {
	for i := 0; i < 100; i++ {
		go func() {
			for {
				select {
				case <-ctx.Done():
					return
				case <-c:
				}
			}
		}()
	}
}
