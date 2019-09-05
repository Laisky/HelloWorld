package test

import (
	"sync"
	"testing"
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
	// t.Error()
}
