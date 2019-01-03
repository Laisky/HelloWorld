package main

import (
	"fmt"
	"sync"
)

func main() {
	l := &sync.RWMutex{}
	wg := &sync.WaitGroup{}

	l.RLock()
	fmt.Println("rlock done")

	go func() {
		for {
			l.RUnlock()
			l.RLock()
		}
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		l.Lock()
		fmt.Println("lock done")
	}()

	wg.Wait()
	l.RLock()
	fmt.Println("rlock done")
}
