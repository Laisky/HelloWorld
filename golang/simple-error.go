// http://xhrwang.me/2014/12/30/golang-fundamentals-9-error-panic-recover.html
package main

import (
	"errors"
	"fmt"
)

// 定义一个 DivideError 结构
var DivideError = errors.New("Divide error")

// 定义 `int` 类型除法运算的函数
func Divide(varDividee int, varDivider int) (result int, err error) {
	if varDivider == 0 {
		return 0, DivideError
	} else {
		return varDividee / varDivider, nil
	}
}

func errorHandleWithDefer() {
	defer func() {
		if err := recover(); err != nil {
			fmt.Printf("deal with error: %v\n", err)
			// panic(err)  // 可以继续抛出异常
		}
	}()

	panic(DivideError)
}

type MyError struct {
	Message string
}

func (e *MyError) Error() string {
	return "my error"
}

// error & nil
// 这是一个错误的示例
// 返回值的 error 是一个 interface{Error() string}
// 所以你可以返回任何有 Error 方法的 interface
// 但是 interface 其实是一个 value、type 的二元组
// 将 interface 赋值为 nil，只会令 value 为 nil，而 interface 并不会等于 nil
// 在外部调用函数里的 if err != nil 的判断中就会出错
func mistakeError() error {
	var err *MyError = nil
	return err // will not equal to nil
}

func main() {
	var err error

	// 正常情况
	if result, err := Divide(100, 10); err == nil {
		fmt.Println("100/10 = ", result)
	}

	// 当被除数为零的时候会返回错误信息
	if _, err = Divide(100, 0); err != nil {
		fmt.Println("err is: ", err)
	}

	// error with defer
	errorHandleWithDefer()

	// error & nil
	err = mistakeError()
	if err != nil {
		fmt.Println("something wrong")
	}

}
