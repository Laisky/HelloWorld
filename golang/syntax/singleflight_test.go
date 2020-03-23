package test

import (
	"testing"

	"golang.org/x/sync/singleflight"
)

func TestSingleFlight(t *testing.T) {
	g := singleflight.Group{}
	const key = "1"
	n := 0
	v, err, shared := g.Do(key, func() (interface{}, error) {
		n++
		return n, nil
	})
	if err != nil {
		t.Fatalf("got error: %+v", err)
	}
	if v != 1 {
		t.Logf("got v: %v, shared: %v", v, shared)
	}

	v, err, shared = g.Do(key, func() (interface{}, error) {
		n++
		return n, nil
	})
	if err != nil {
		t.Fatalf("got error: %+v", err)
	}
	if v != 1 {
		t.Logf("got v: %v, shared: %v", v, shared)
	}

	g.Forget(key)
	v, err, shared = g.Do(key, func() (interface{}, error) {
		n++
		return n, nil
	})
	if err != nil {
		t.Fatalf("got error: %+v", err)
	}
	if v != 2 {
		t.Logf("got v: %v, shared: %v", v, shared)
	}
}
