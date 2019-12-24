/*
 ✗ go build -gcflags="-m -m" escape.go

# command-line-arguments
./escape.go:8:6: can inline foo as: func(*P) { p = new(P); p.X = 1; p.Y = 2 }
./escape.go:8:10: foo p does not escape
./escape.go:9:9: foo new(P) does not escape
*/

package test

type P struct {
	X, Y int
}

func foo(p *P) {
	p = new(P)
	p.X = 1
	p.Y = 2
}
