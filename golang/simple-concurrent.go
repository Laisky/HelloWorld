package main

import (
	"fmt"
	"time"
)

var ch = make(chan int)

func say(v string) {
	time.Sleep(time.Second * 1)
	fmt.Println(v)
	ch <- 0
}

func main() {
	go say("bob") // 启动 goroutine
	fmt.Printf("hello ")
	// 最终会输出 "hello bob"

	// 等待 goroutine 执行完成
	<-ch
}
