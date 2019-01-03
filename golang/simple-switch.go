package main

import (
	"fmt"
)

func main() {
	a := 2

	switch a {
	case 1:
		fmt.Println("case 1")
		fallthrough
	case 2:
		fmt.Println("case 2")
		fallthrough
	case 3:
		fmt.Println("case 2")
		fallthrough
	default:
		fmt.Println("default")
	}

	// 判断类型
	var ia interface{} // 只能判断 interface 的类型
	ia = a

	switch ia.(type) {
	case int:
		fmt.Println("int")
	case float32:
		fmt.Println("float")
	case string:
		fmt.Println("string")
	case bool:
		fmt.Println("bool")
	default:
		fmt.Println("default")
	}

	fmt.Println("switch interface >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
	var im = map[string]interface{}{"a": "b"}
	switch im["a"].(type) {
	case string:
		fmt.Println("type: string")
	case []byte:
		fmt.Println("type: []byte")
	default:
		fmt.Println("unknown type")
	}

	fmt.Println("switch nil type >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
	im = map[string]interface{}{"a": "b"}
	switch im["c"].(type) {
	case string:
		fmt.Println("type: string")
	case []byte:
		fmt.Println("type: []byte")
	case nil:
		fmt.Println("type: nil")
	default:
		fmt.Println("unknown type")
	}
}
