package test

import (
	"os"
	"testing"
	"time"
)

func TestExit(t *testing.T) {
	p, err := os.FindProcess(os.Getpid())
	if err != nil {
		t.Fatalf("%+v", err)
	}

	if err := p.Kill(); err != nil {
		t.Fatalf("%+v", err)
	}
	time.Sleep(1 * time.Second)
}
