package test_uber

import (
	"sync"
	"testing"
	"time"

	"github.com/Laisky/go-utils"
)

func TestMutex(t *testing.T) {
	var (
		l  sync.Mutex
		wg = new(sync.WaitGroup)
	)
	for i := 0; i < 10; i++ {
		wg.Add(1)
		go foo(wg, l)
	}

	wg.Wait()
	t.Error("done")
}

func foo(wg *sync.WaitGroup, l sync.Mutex) {
	l.Lock()
	defer wg.Done()
	defer l.Unlock()
	defer utils.Logger.Info("release lock")
	utils.Logger.Info("acquired lock")
	time.Sleep(3 * time.Second)
}
