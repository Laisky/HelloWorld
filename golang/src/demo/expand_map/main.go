package main

import (
	"encoding/json"
	"fmt"
)

func FlattenMap(data map[string]interface{}) {
	for k, vi := range data {
		if v2i, ok := vi.(map[string]interface{}); ok {
			FlattenMap(v2i)
			for k3, v3i := range v2i {
				data[k+"."+k3] = v3i
			}
			delete(data, k)
		}
	}
}

func main() {
	data := map[string]interface{}{}
	js := []byte(`{"a": "b", "b": {"c": 1, "d": {"e": 123}}, "e": 2}`)
	fmt.Println(string(js))
	if err := json.Unmarshal(js, &data); err != nil {
		panic(err)
	}

	FlattenMap(data)
	fmt.Println(data)
}
