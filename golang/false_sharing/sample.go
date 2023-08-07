package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"runtime"
	"runtime/pprof"
	"sync"
	"sync/atomic"
)

type Counter interface {
	Increment()
}

type NotPaddedCounter struct {
	v1 uint64
	v2 uint64
	v3 uint64
}

func (pc *NotPaddedCounter) Increment() {
	atomic.AddUint64(&pc.v1, 1)
	atomic.AddUint64(&pc.v2, 1)
	atomic.AddUint64(&pc.v3, 1)
}

type PaddedCounter struct {
	v1 uint64
	p1 [8]uint64
	v2 uint64
	p2 [8]uint64
	v3 uint64
	p3 [8]uint64
}

func (pc *PaddedCounter) Increment() {
	atomic.AddUint64(&pc.v1, 1)
	atomic.AddUint64(&pc.v2, 1)
	atomic.AddUint64(&pc.v3, 1)
}

func main() {
	runCase := flag.String("case", "notpadded", "notpadded or padded")
	flag.Parse()

	// Create a CPU profile file
	f, err := os.Create(fmt.Sprintf("%s.prof", *runCase))
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	// Start CPU profiling
	if err := pprof.StartCPUProfile(f); err != nil {
		log.Fatal(err)
	}
	defer pprof.StopCPUProfile()

	total := int(1e6)
	ncpu := runtime.NumCPU()

	switch *runCase {
	case "notpadded":
		runner(&NotPaddedCounter{}, total, ncpu)
	case "padded":
		runner(&PaddedCounter{}, total, ncpu)
	default:
		log.Fatal("unknown case")
	}

	// Stop CPU profiling and write the profile to disk
	pprof.StopCPUProfile()
	if err := f.Close(); err != nil {
		log.Fatal(err)
	}
}

func runner(c Counter, total, ncpu int) {
	wg := sync.WaitGroup{}
	wg.Add(ncpu)
	for cpu := 0; cpu < ncpu; cpu++ {
		go func() {
			defer wg.Done()

			for i := 0; i < total; i++ {
				c.Increment()
			}
		}()
	}

	wg.Wait()
}
