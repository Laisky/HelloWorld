package main

import (
	"fmt"
	"runtime"
)

var ch chan int = make(chan int)

func loop(isGo bool, num int) {
	fmt.Printf("run loop with isGo: %v, num: %v\n", isGo, num)
	for i := 0; i < 10; i++ {
		fmt.Println(i)
		if isGo {
			runtime.Gosched() // 让出 CPU
		}
	}
	if isGo {
		ch <- 0
	}
}

func main() {
	// runtime.GOMAXPROCS(2) // 增加更多的 CPU 参与调度
	go loop(true, 1)
	loop(false, 2)
	go loop(true, 3)
	<-ch
	<-ch
}
