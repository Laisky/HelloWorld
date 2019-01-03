package main

import "fmt"

type Demo struct {
	X, Y int
}

func (d *Demo) Sum() int {
	return d.X + d.Y
}

type Demo2 struct{}

func (d *Demo2) Write() {
	fmt.Println("Write...")
}

type Demo3 struct {
	d *Demo2
}

type Demo4 struct {
	*Demo2
}

func main() {
	d := Demo{4, 4}
	fmt.Println(d.Sum())

	// demo3
	d3 := Demo3{d: &Demo2{}}
	d3.d.Write()

	// demo4
	d4 := Demo4{&Demo2{}}
	d4.Write()
}
