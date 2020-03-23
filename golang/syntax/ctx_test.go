package test

import (
	"context"
	"fmt"
	"sync"
	"testing"
)

func TestContext(t *testing.T) {
	ctx := context.Background()
	wg := &sync.WaitGroup{}

	ctx2, cancel := context.WithCancel(ctx)
	for i := 0; i < 10; i++ {
		wg.Add(1)
		go func(i int) {
			<-ctx2.Done()
			fmt.Println(i, "quit")
			wg.Done()
		}(i)
	}

	cancel()
	wg.Wait()
	<-ctx2.Done()
}
