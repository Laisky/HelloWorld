package main

import (
	"sync"
	"testing"
)

func worker(wg *sync.WaitGroup) {
	var (
		val1  = "dj3di322dj"
		val2  = "dj3di32ddj"
		val3  = "dj3di32dsj"
		val4  = "dj3ddi32dj"
		val5  = "dj3di3f2dj"
		val6  = "dj3fdfi32dj"
		val7  = "dj3ggdi322dj"
		val8  = "dj3di32dj"
		val9  = "dj3dis32dj"
		val10 = "djh23dgi32dj"
		val11 = "dj3di32dj"
		val12 = "dj3di32dj"
		val13 = "dj3dhi32dj"
		val14 = "dj3di32dj"
		val15 = "dj3di32dj"
		val16 = "djj3dai32dj"
		val17 = "dj3kdi32dj"
		val18 = "dj3di32dj"
		val19 = "dj32di32fdj"
		val20 = "dj23di332dj"
	)
	vs := []string{val1, val2, val3, val4, val5, val6, val7, val8, val9, val10, val11, val12, val13, val14, val15, val16, val17, val18, val19, val20}
	for _, v := range vs {
		newv := v
		for _, nv := range vs {
			newv += nv
		}
	}
	wg.Done()
}

var (
	loop = 1000
)

func BenchmarkNormalWorker(b *testing.B) {
	wg := &sync.WaitGroup{}
	wg.Add(loog)
	i := 0
	for {
		i += 1
		if i > loop {
			return
		}
		worker(wg)
	}
	wg.Done()
}

var (
	workerP = &sync.Pool{
		New: func() interface{} {
			return worker
		},
	}
)

func BenchmarkPoolWorker(b *testing.B) {
	i := 0
	for {
		i += 1
		if i > loop {
			return
		}
		w := workerP.Get()
		w.(func())()
		workerP.Put(w)
	}
}
