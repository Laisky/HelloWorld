package main

import (
	"fmt"
	"reflect"
)

func StructTest() {
	type T struct {
		A int
		B string
	}
	t := T{23, "skidoo"}
	s := reflect.ValueOf(&t).Elem()
	typeOfT := s.Type()
	for i := 0; i < s.NumField(); i++ {
		f := s.Field(i)
		fmt.Printf("%d: %s %s = %v\n", i,
			typeOfT.Field(i).Name, f.Type(), f.Interface())
	}
}

func main() {
	var vx interface{}
	vx = 3.4
	fmt.Println("type:", reflect.TypeOf(vx))
	fmt.Println("value:", reflect.ValueOf(vx))

	fmt.Println("----------------------------------------")
	v := reflect.ValueOf(vx)

	fmt.Println("value:", v)
	fmt.Println("type:", v.Type())         // float64
	fmt.Println("kind:", v.Kind())         // float64
	fmt.Println("float value:", v.Float()) // 3.4
	fmt.Println(v.Interface())
	fmt.Printf("value is %5.2e\n", v.Interface())
	y := v.Interface().(float64)
	fmt.Println(y)

	fmt.Println("----------------------------------------")
	StructTest()
}
