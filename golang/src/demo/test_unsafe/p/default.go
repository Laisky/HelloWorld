package p

import (
	"fmt"
)

type V struct {
	i int32
	j int64
}

func (this V) PutI() {
	fmt.Printf("i=%d\n", this.i)
}

func (this V) PutJ() {
	fmt.Printf("j=%d\n", this.j)
}
