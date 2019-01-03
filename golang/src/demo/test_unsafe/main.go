package main

import (
	"test_unsafe/p"
	"unsafe"
)

func main() {
	// 分配空间，创建新对象
	var v *p.V = new(p.V)

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
