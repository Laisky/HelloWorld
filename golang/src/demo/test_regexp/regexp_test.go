package main_test

import (
	"regexp"
	"testing"
)

/*
BenchmarkRegexp/normal_matched-4         	 1000000	      1189 ns/op	       0 B/op	       0 allocs/op
BenchmarkRegexp/normal_unmatched-4       	 5000000	       316 ns/op	       0 B/op	       0 allocs/op
BenchmarkRegexp/with_+_matched-4         	 1000000	      1399 ns/op	       0 B/op	       0 allocs/op
BenchmarkRegexp/with_+_unmatched-4       	 1000000	      1430 ns/op	       0 B/op	       0 allocs/op
*/
func BenchmarkRegexp(b *testing.B) {
	regexp1 := regexp.MustCompile(`^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}).*`)
	regexp2 := regexp.MustCompile(`^((\d{1,3})+\.(\d{1,3})+\.(\d{1,3})+\.(\d{1,3})+).*`)
	text1 := `107.21.20.1 - - [07/Dec/2012:18:55:53 -0500] "GET /" 200 2144`
	text2 := `9.21.2015 non matching text that kind of matches`
	b.Run("normal matched", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			regexp1.MatchString(text1)
		}
	})
	b.Run("normal unmatched", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			regexp1.MatchString(text2)
		}
	})
	b.Run("with + matched", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			regexp2.MatchString(text1)
		}
	})
	b.Run("with + unmatched", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			regexp2.MatchString(text1)
		}
	})
}
