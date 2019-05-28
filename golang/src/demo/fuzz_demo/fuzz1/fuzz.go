//+build gofuzz

package bug

func Fuzz(input []byte) int {
	foo(input)
	return 1
}
