package main_test

import (
	"sync"
	"testing"
	"time"

	utils "github.com/Laisky/go-utils"

	"github.com/patrickmn/go-cache"
)

/*
go test . -race -bench "K" -benchtime=10s -benchmem
goos: darwin
goarch: amd64
pkg: github.com/Laisky/HelloWorld/golang/src/demo/gocache-demo

BenchmarkKVS/go-cache_insert-4            500000             26164 ns/op             341 B/op          5 allocs/op
BenchmarkKVS/go-cache_get-4              1000000             12395 ns/op              64 B/op          2 allocs/op
BenchmarkKVS/sync.map_insert-4            500000             25238 ns/op             321 B/op          9 allocs/op
BenchmarkKVS/sync.map_get-4              1000000             12881 ns/op              64 B/op          2 allocs/op
*/
func BenchmarkKVS(b *testing.B) {
	goCache := cache.New(5*time.Minute, 10*time.Minute)
	b.Run("go-cache insert", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			goCache.Set(utils.RandomStringWithLength(10), utils.RandomStringWithLength(10), cache.DefaultExpiration)
		}
	})
	b.Run("go-cache get", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			goCache.Get(utils.RandomStringWithLength(10))
		}
	})

	syncMap := sync.Map{}
	b.Run("sync.map insert", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			syncMap.Store(utils.RandomStringWithLength(10), utils.RandomStringWithLength(10))
		}
	})
	b.Run("sync.map get", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			syncMap.Load(utils.RandomStringWithLength(10))
		}
	})

}
