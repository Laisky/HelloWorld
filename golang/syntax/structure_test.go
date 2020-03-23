package test

import (
	"reflect"
	"testing"
)

type Foo struct {
	A  string
	CS []string
}

func TestStruct(t *testing.T) {
	a := &Foo{
		A:  "yo",
		CS: []string{"a"},
	}
	b := &Foo{
		A:  "yo",
		CS: []string{"a"},
	}

	if a == b {
		t.Error("should not equal")
	}

	if !reflect.DeepEqual(a, b) {
		t.Error("should equal")
	}
}
