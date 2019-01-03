package main

import (
	"fmt"
	"unsafe"
)

// http://www.tapirgames.com/blog/golang-has-no-reference-values

func changeArrayNormal(arr [3]int) {
	// 尝试传递 array 会导致整个 array 的所有元素被复制
	arr[1] = 2
}

func changeArrayPointer(arr *[3]int) {
	arr[1] = 2
}

func changeSliceNormal(sli []int) {
	sli[1] = 2
	// type Slice struct {
	// 	Array
	// 	Capacity uint64
	// }
	// append 很可能会导致 slice 重新分配内存
	// 所以可能会得到一个新的 pointer 值，所以 append 只能返回一个新的 head
	sli = append(sli, 3) // 这句话不一定会对原始 slice 生效
}

func changeByUnsafe() {
	type V struct {
		i int32
		j int64
	}

	var v *V = new(V)                          // 创建新对象
	var i *int32 = (*int32)(unsafe.Pointer(v)) // 取得 v 的地址，转换为 int32 指针
	*i = int32(98)                             // 赋值
	fmt.Printf("%+v\n", v)                     // {i:98, j:0}

	// 结构体在内存中是连续存放的，
	// 所以可以取到第二个值的内存地址
	var j *int64 = (*int64)(unsafe.Pointer(uintptr(unsafe.Pointer(v)) + uintptr(unsafe.Sizeof(int32(0)))))
	*j = int64(763)
}

func main() {
	// unsage
	changeByUnsafe()

	// arr
	fmt.Println("test for arr")
	arr := [3]int{1, 1, 1}
	changeArrayNormal(arr)
	fmt.Println(arr)
	changeArrayPointer(&arr)
	fmt.Println(arr)
	arr2 := arr // copy a new arr
	arr2[1] = 3
	fmt.Printf("arr:arr2 pointer %p:%p\n", &arr, &arr2) // 指针不同

	// slice
	fmt.Println("test for slice")
	sli := []int{1, 1, 1}
	changeSliceNormal(sli)
	fmt.Println(sli)

}
