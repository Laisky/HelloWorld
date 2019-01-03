package main

import (
	"fmt"
	"sync"
	"sync/atomic"
	"time"
)

var wg = &sync.WaitGroup{}

func goro(l *int32, taskName string) {
	defer wg.Done()
	var i int = 0
	for {
		if ok := atomic.CompareAndSwapInt32(l, 0, 1); !ok {
			time.Sleep(1)
			continue
		}
		fmt.Printf("[%v]do some works...\n", taskName)
		if ok := atomic.CompareAndSwapInt32(l, 1, 0); !ok {
			panic("atomic error")
		}
		i++
		if i > 10 {
			return
		}
	}
}

func main() {
	var i int32 = 0
	wg.Add(4)

	go goro(&i, "1")
	go goro(&i, "2")
	go goro(&i, "3")
	go goro(&i, "4")
	wg.Wait()
}
