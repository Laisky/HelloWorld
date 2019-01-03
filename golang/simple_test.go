package main

import (
	"fmt"
	"os"
	"testing"
)

func Fib(n int) int {
	if n < 2 {
		return n
	}
	return Fib(n-1) + Fib(n-2)
}

// from fib_test.go
func BenchmarkFib10(b *testing.B) {
	// run the Fib function b.N times
	for n := 0; n < b.N; n++ {
		Fib(10)
	}
}

func TestMain(m *testing.M) {
	// mySetupFunction()
	retCode := m.Run()
	// myTeardownFunction()
	os.Exit(retCode)
}

func TestFib(t *testing.T) {
	type TestCase struct {
		name string
		arg  int
		want int
	}

	assertCorrectMessage := func(t *testing.T, got, want int) {
		t.Helper()
		if got != want {
			t.Errorf("got '%v' want '%v'", got, want)
		}
	}

	cases := []*TestCase{
		&TestCase{"input: 0", 0, 0},
		&TestCase{"input: 10", 10, 10},
		&TestCase{"input: 10", 10, 55},
	}

	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			assertCorrectMessage(t, Fib(c.arg), c.want)
		})
	}
}

func main() {
	fmt.Println("main...")
}
