package main

import (
	"fmt"
	"runtime"
	"time"
)

func GetSomething(c chan int, i int) {
	time.Sleep(time.Second * time.Duration(i))
	c <- 2
	if i == 4 {
		defer close(c)
	}
}

func main() {
	runtime.GOMAXPROCS(runtime.NumCPU())

	c := make(chan int, 5)

	for i := 0; i < 5; i++ {
		go GetSomething(c, i)

	}

	for i := range c {
		fmt.Println(i)
	}

}
