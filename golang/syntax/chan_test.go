package test

import (
	"runtime"
	"sync"
	"testing"
	"time"
)

func TestClocsChan(t *testing.T) {

	intChan := make(chan int, 100)
	n := 123
	close(intChan)
	<-intChan
	<-intChan
	<-intChan

	n = <-intChan
	if n != 0 {
		t.Fatalf("got n: %v", n)
	}

	mapChan := make(chan map[string]string, 10)
	mm := map[string]string{"1": "123"}
	close(mapChan)

	mm = <-mapChan
	if mm != nil {
		t.Fatalf("got n: %v", n)
	}

}

/*
 * 44: len chan1: 42
 * 45: len chan2: 58
 * 46: len chan3: 0
 */
func TestSelectChan(t *testing.T) {
	chan1 := make(chan int, 100000)
	chan2 := make(chan int, 100000)
	chan3 := make(chan int, 100000)

	for i := 0; i < 100; i++ {
		select {
		case chan1 <- i:
		case chan2 <- i:
		default:
			chan3 <- i
		}
	}

	t.Logf("len chan1: %v", len(chan1))
	t.Logf("len chan2: %v", len(chan2))
	t.Logf("len chan3: %v", len(chan3))
	t.Error()
}

func TestClosedChan(t *testing.T) {
	c := make(chan int, 10)
	var wg sync.WaitGroup
	wg.Add(2)

	go func() {
		defer wg.Done()
		for i := 0; i < 10; i++ {
			c <- i
		}
		close(c)
	}()
	go func() {
		defer wg.Done()
		for v := range c {
			time.Sleep(100 * time.Millisecond)
			t.Logf("got: %+v", v)
			runtime.Gosched()
		}
	}()

	wg.Wait()
	t.Error()
}
