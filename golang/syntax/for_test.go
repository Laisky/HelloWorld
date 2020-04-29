package test

import (
	"sync"
	"testing"

	"golang.org/x/sync/errgroup"
)

func TestFor(t *testing.T) {
	wg := &sync.WaitGroup{}
	z := 0
	for i := 0; i < 5; i++ {
		z++
		wg.Add(1)
		go func() {
			defer wg.Done()
			t.Log(i)
			t.Log(z)
			t.Log("----------------")
		}()
	}

	wg.Wait()
	t.Error()
}

func TestErrgroupInFor(t *testing.T) {
	var pool errgroup.Group
	for i := 0; i < 10; i++ {
		j := i
		pool.Go(func() error {
			t.Logf("%v - %v", i, j)
			return nil
		})

	}

	if err := pool.Wait(); err != nil {
		t.Fatalf("%+v", err)
	}

	t.Error("done")
}
