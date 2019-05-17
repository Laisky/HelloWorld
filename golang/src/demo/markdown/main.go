package main

import (
	"fmt"

	"github.com/gomarkdown/markdown"
)

func main() {
	md := []byte(`
$$
c_i + 1 = 2
$$`)

	output := markdown.ToHTML(md, nil, nil)
	fmt.Println(string(output))
}
