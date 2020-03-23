package test

import (
	"fmt"
	"testing"
	"unsafe"
)

func Test_ByteString(t *testing.T) {
	var x = []byte("Hello World!")
	var y = *(*string)(unsafe.Pointer(&x))
	var z = string(x)

	if y != z {
		t.Fail()
	}
}

func Benchmark_Normal(b *testing.B) {
	var x = []byte("Hello World!")
	for i := 0; i < b.N; i++ {
		_ = string(x)
	}
}

func Benchmark_ByteString(b *testing.B) {
	var x = []byte("Hello World!")
	for i := 0; i < b.N; i++ {
		_ = *(*string)(unsafe.Pointer(&x))
	}
}

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

func ExampleUnsafe() {
	// 分配空间，创建新对象
	var v *V = new(V)

	// 将 v 的指针转换为 int32 的指针
	var i *int32 = (*int32)(unsafe.Pointer(v))
	// 赋值，相当于给 V.i 赋值
	*i = int32(98)

	// 获取 V.j 的指针
	// 方法是 i 的指针加上一个 int32 的长度，因为结构体内的内存是连续的
	var j *int64 = (*int64)(unsafe.Pointer(uintptr(unsafe.Pointer(v)) + uintptr(unsafe.Sizeof(int32(0)))))
	*j = int64(763)

	// 输出，会发现私有变量的值都被改变了
	v.PutI()
	v.PutJ()
}
