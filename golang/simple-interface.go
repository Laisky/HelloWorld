package main

import (
	"fmt"
	"reflect"
)

type Polygon struct {
	height int
	width  int
}

func (this *Polygon) GetPerimeter() int {
	return (this.height + this.width) * 2
}

type PolygonA struct {
	Polygon
}

type PolygonB struct {
	Polygon
}

// 定义接口
type graph interface {
	GetPerimeter() int // 对象必须实现 GetPerimeter 方法
}

func main() {
	pa := PolygonA{Polygon{height: 10, width: 10}}
	fmt.Println("pa height %v", pa.height)
	var g graph
	g = &pa
	fmt.Println("pa GetPerimeter %v", g.GetPerimeter())
	// fmt.Println("pa height %v", g.height)

	pb := PolygonB{Polygon{height: 20, width: 20}}
	l := []graph{&pa, &pb}
	for index, element := range l {
		fmt.Println(index)
		fmt.Println(element)
		fmt.Println(element.GetPerimeter())
		fmt.Println(element.(graph))
		fmt.Println("------------------------------------------")
		if value, ok := element.(*Polygon); ok {
			fmt.Println("%v is Ploygon", value)
		}
	}

	// 判断类型
	fmt.Println("------------------------------------------")
	var va interface{} // 定义 va 为 interface
	va = &pa

	if t, ok := va.(*PolygonA); ok {
		fmt.Println("The type is: %T", t)
	} else if t, ok := va.(*PolygonB); ok {
		fmt.Println("The type is: %T", t)
	}

	// 反射
	fmt.Println("------------------------------------------")
	fmt.Println(">> reflect")
	fmt.Println("type is %T", reflect.TypeOf(va))   // type is %T *main.PolygonA
	fmt.Println("value is %T", reflect.ValueOf(va)) // value is %T &{{10 10}}

	v := reflect.ValueOf(va)
	fmt.Println("value Type", v.Type()) // *main.PolygonA
	fmt.Println("value Kind", v.Kind()) // ptr

	t := reflect.TypeOf(va)
	fmt.Println("type Type", t.Elem()) // main.PolygonA
	fmt.Println("type Kind", t.Kind()) // ptr

	fmt.Println("将 reflect.Value 转换为 interface")
	fmt.Println(v.Interface())             // 转换为 interface
	fmt.Println(v.Interface().(*PolygonA)) // 将 interface 转换为具体的数据类型

	fmt.Println("reflect.Value 可写性检查")
	v3 := "value"
	var i3 interface{} = v3
	rv3 := reflect.ValueOf(i3)
	fmt.Println(rv3.CanSet()) // false

	// SetValue 会检查传给 ValueOf 是否能够触达原始值，
	// 所以只有当传递的是一个指针的时候，才能调用 SetValue 对原值进行修改
	rv4 := reflect.ValueOf(&v3)
	fmt.Println(rv4.CanSet())        // False
	fmt.Println(rv4.Elem().CanSet()) // True
	fmt.Println(v3)                  // "value"
	rv4.Elem().SetString("new string")
	fmt.Println(v3) // "new string"

}
