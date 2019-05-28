package bug

import "fmt"

func foo(v []byte) (err error) {
	if len(v) > 0 && v[0] == 'a' {
		panic("yo")
	}

	return fmt.Errorf("can not be empty")
}
