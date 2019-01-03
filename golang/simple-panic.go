// http://xhrwang.me/2014/12/30/golang-fundamentals-9-error-panic-recover.html
package main

import (
	"fmt"
)

// 最简单的例子
func SimplePanicRecover() {
	defer func() {
		if err := recover(); err != nil {
			fmt.Println("Panic info is: ", err)
		}
	}()
	panic("SimplePanicRecover function panic-ed!")
}

// 当 defer 中也调用了 panic 函数时，最后被调用的 panic 函数的参数会被后面的 recover 函数获取到
// 一个函数中可以定义多个 defer 函数，按照 FILO 的规则执行
func MultiPanicRecover() {
	defer func() {
		if err := recover(); err != nil {
			fmt.Println("Panic info is: ", err)
		}
	}()
	defer func() {
		panic("MultiPanicRecover defer inner panic")
	}()
	defer func() {
		if err := recover(); err != nil {
			fmt.Println("Panic info is: ", err)
		}
	}()
	panic("MultiPanicRecover function panic-ed!")
}

// recover 函数只有在 defer 函数中被直接调用的时候才可以获取 panic 的参数
func RecoverPlaceTest() {
	// 下面一行代码中 recover 函数会返回 nil，但也不影响程序运行
	defer recover()
	// recover 函数返回 nil
	defer fmt.Println("recover() is: ", recover())
	defer func() {
		func() {
			// 由于不是在 defer 调用函数中直接调用 recover 函数，recover 函数会返回 nil
			if err := recover(); err != nil {
				fmt.Println("Panic info is: ", err)
			}
		}()

	}()
	defer func() {
		if err := recover(); err != nil {
			fmt.Println("Panic info is: ", err)
		}
	}()
	panic("RecoverPlaceTest function panic-ed!")
}

// 如果函数没有 panic，调用 recover 函数不会获取到任何信息，也不会影响当前进程。
func NoPanicButHasRecover() {
	if err := recover(); err != nil {
		fmt.Println("NoPanicButHasRecover Panic info is: ", err)
	} else {
		fmt.Println("NoPanicButHasRecover Panic info is: ", err)
	}
}

// 定义一个调用 recover 函数的函数
func CallRecover() {
	if err := recover(); err != nil {
		fmt.Println("Panic info is: ", err)
	}
}

// 定义个函数，在其中 defer 另一个调用了 recover 函数的函数
func RecoverInOutterFunc() {
	defer CallRecover()
	panic("RecoverInOutterFunc function panic-ed!")
}

func MultiDefer() {
	defer func() { fmt.Println("1") }()
	defer func() { fmt.Println("2") }()
	defer func() { fmt.Println("3") }()
	defer func() { fmt.Println("4") }()
}

func DealError() (val int) {
	defer func() {
		if err := recover(); err != nil {
			val = 10
		}
	}()

	val = 5
	panic(10)
	return
}

func ChangeReturn() (val int) {
	defer func() {
		val = 10
	}()
	val = 5
	return
}

func main() {
	SimplePanicRecover()
	MultiPanicRecover()
	RecoverPlaceTest()
	NoPanicButHasRecover()
	RecoverInOutterFunc()

	fmt.Println("------------------")
	MultiDefer()
	fmt.Println("------------------")
	v := DealError()
	fmt.Println(">> v", v)

	fmt.Println("------------------")
	v = ChangeReturn()
	fmt.Println(">> v", v)
}
