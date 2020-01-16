package test

import "testing"

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
