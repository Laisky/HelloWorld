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
