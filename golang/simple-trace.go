package main

import (
	"fmt"
	"math/rand"
	"os"
	"runtime/trace"
	"sync"
	"time"
)

var letterRunes = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")
var data = sync.Map{}
var wg sync.WaitGroup

func RandStringRunes(n int) string {
	b := make([]rune, n)
	for i := range b {
		b[i] = letterRunes[rand.Intn(len(letterRunes))]
	}
	return string(b)
}

func heavyWork() {
	time.Sleep(time.Second * time.Duration(rand.Intn(2)))
	k := RandStringRunes(5)
	v := RandStringRunes(20)
	data.Store(k, v)
	defer wg.Done()
}

func main() {
	f, err := os.Create("trace.out")
	if err != nil {
		panic(err)
	}
	defer f.Close()

	err = trace.Start(f)
	if err != nil {
		panic(err)
	}
	defer trace.Stop()

	// Your program here
	rand.Seed(time.Now().UnixNano())
	nWorkers := 10000
	wg.Add(nWorkers)
	for i := 0; i < nWorkers; i++ {
		go heavyWork()
	}
	wg.Wait()
	fmt.Println("All done")
}
