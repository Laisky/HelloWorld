package main

import (
	"fmt"
	"math/rand"
	"os"
	"runtime/pprof"
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
	// CPU Profiling
	f, err := os.Create("cpuprofile")
	if err != nil {
		panic(err)
	}
	defer f.Close()
	pprof.StartCPUProfile(f)
	defer pprof.StopCPUProfile()

	// Your program here
	rand.Seed(time.Now().UnixNano())
	nWorkers := 10000
	wg.Add(nWorkers)
	for i := 0; i < nWorkers; i++ {
		go heavyWork()
	}

	// Memory Profiling
	// f, err := os.Create("memory.pprof")
	// if err != nil {
	// 	panic(err)
	// }
	// defer f.Close()
	// pprof.WriteHeapProfile(f)

	wg.Wait()
	fmt.Println("All done")

}
