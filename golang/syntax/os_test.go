package test

import (
	"os"
	"path/filepath"
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

// func TestMove(t *testing.T) {
// 	dir, err := ioutil.TempDir("", "")
// 	if err != nil {
// 		t.Fatalf("%+v", err)
// 	}
// 	defer os.Remove(dir)

// 	os.Makedir(filepath.Join(dir, "a"))
// 	os.MkDir(filepath.Join(dir, "b"))
// }

func TestFilepath(t *testing.T) {
	src := "/a/v/c/d.xxx"
	t.Logf("%+v", filepath.Split(src))
	t.Error()
}
