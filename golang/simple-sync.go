package main

import (
	"fmt"
	"runtime"
	"sync"
)

func helloworld() {
	fmt.Println("hello, world")
}

func getOutput(val string, times int) func() {
	return func() {
		for i := 0; i < times; i++ {
			fmt.Println(val)
		}
	}
}

func runWithLock(wg *sync.WaitGroup, lock *sync.Mutex, f func()) {
	defer wg.Done()
	lock.Lock()
	f()
	lock.Unlock()
	runtime.Gosched()
}

func runWithCond(cond *sync.Cond, f func()) {
	defer cond.Signal()
	f()
}

func frequentCreateNumber(p *sync.Pool) {
	n := p.Get().(int) // 获取到一个初始化的 int
	// do something with n
	n = 0 // reset before put back
	p.Put(n)
}

func main() {
	runtime.GOMAXPROCS(runtime.NumCPU())

	// mutex
	lock := &sync.Mutex{}
	wg := &sync.WaitGroup{}
	wg.Add(2)
	output1 := getOutput("a", 5)
	output2 := getOutput("b", 5)
	go runWithLock(wg, lock, output1)
	go runWithLock(wg, lock, output2)
	wg.Wait()

	// Once
	once := &sync.Once{}
	for i := 0; i < 10; i++ {
		once.Do(helloworld)
	}

	// cond
	lock.Lock()
	cond := sync.NewCond(lock)
	go runWithCond(cond, output1)
	cond.Wait()

	// pool
	p := &sync.Pool{
		New: func() interface{} {
			return 0
		},
	}

	for i := 0; i < 10; i++ {
		go frequentCreateNumber(p)
	}

	// Map
	m := &sync.Map{}
	val := 10
	key := "key"
	m.Store(key, val)
	v, _ := m.Load(key)
	fmt.Printf("map %v:%v\n", key, v)
	v, _ = m.LoadOrStore(key, 20) // key 已存在，所以直接返回 10，20 被丢弃
	fmt.Printf("map %v:%v\n", key, v)

	// Map with pointer key
	m = &sync.Map{}
	d := struct{ n int }{n: 10}
	m.Store(&d, d)
	m.Load(&d)
}
