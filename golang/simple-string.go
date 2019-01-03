package main

import (
	"fmt"

	"golang.org/x/text/unicode/norm"
)

func PrintDemo() {
	const sample = "\xbd\xb2\x3d\xbc\x20\xe2\x8c\x98"

	fmt.Println("Println:")
	fmt.Println(sample)

	// bd b2 3d bc 20 e2 8c 98
	fmt.Println("Byte loop:")
	for i := 0; i < len(sample); i++ {
		fmt.Printf("%x ", sample[i])
	}
	fmt.Printf("\n")

	fmt.Println("Printf with %x:")
	fmt.Printf("%x\n", sample) // bdb23dbc20e28c98

	fmt.Println("Printf with % x:")
	fmt.Printf("% x\n", sample) // bd b2 3d bc 20 e2 8c 98

	fmt.Println("Printf with %q:")
	fmt.Printf("%q\n", sample) // "\xbd\xb2=\xbc ⌘"

	fmt.Println("Printf with %+q:")
	fmt.Printf("%+q\n", sample) // "\xbd\xb2=\xbc \u2318"
}

func RuneDemo() {
	var s = "中文字符串"
	for index, runeValue := range s {
		fmt.Printf("%#U starts at byte position %d\n", runeValue, index)
	}
}

func NormDemo() {
	var (
		s         = "e◌́"
		index     int
		runeValue byte
	)
	for index, runeValue = range s {
		fmt.Printf("%#U starts at byte position %d\n", runeValue, index)
	}

	// normalize
	for index, runeValue = range norm.NFC.Bytes([]byte(s)) {
		fmt.Printf("%#U starts at byte position %d\n", runeValue, index)
	}

}

func main() {
	const nihongo = "日本語"
	for index, runeValue := range nihongo {
		fmt.Println(index, runeValue)
		fmt.Printf("%#U starts at byte position %d\n", runeValue, index)
	}

	fmt.Println("---------------------")
	PrintDemo()

	fmt.Println("---------------------")
	RuneDemo()

	fmt.Println("---------------------")
	NormDemo()

}
