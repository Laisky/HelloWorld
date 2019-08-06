/*
BenchmarkKVS/go-cache_insert-4           1000000             25018 ns/op             343 B/op          5 allocs/op
BenchmarkKVS/go-cache_get-4              2000000              8069 ns/op              64 B/op          2 allocs/op
BenchmarkKVS/go-cache_count-4           50000000               302 ns/op               0 B/op          0 allocs/op
BenchmarkKVS/sync.map_insert-4           1000000             17755 ns/op             322 B/op          9 allocs/op
BenchmarkKVS/sync.map_get-4              2000000              9097 ns/op              64 B/op          2 allocs/op
BenchmarkKVS/sync.map_count-4                 50         552671238 ns/op             172 B/op          5 allocs/op

BenchmarkInt64KVS/go-cache_insert-4      1000000             19597 ns/op              84 B/op          4 allocs/op
BenchmarkInt64KVS/go-cache_get-4        10000000              1848 ns/op               0 B/op          0 allocs/op
BenchmarkInt64KVS/go-cache_count-4      30000000               384 ns/op               0 B/op          0 allocs/op
BenchmarkInt64KVS/sync.map_insert-4      1000000             14937 ns/op             250 B/op          7 allocs/op
BenchmarkInt64KVS/sync.map_get-4        10000000              1135 ns/op               0 B/op          0 allocs/op
BenchmarkInt64KVS/sync.map_count-4            50         330416714 ns/op             103 B/op          3 allocs/op
*/

package main_test

import (
	"math/rand"
	"sync"
	"testing"
	"time"

	utils "github.com/Laisky/go-utils"

	"github.com/patrickmn/go-cache"
)

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
	b.Run("go-cache count", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			goCache.ItemCount()
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
	b.Run("sync.map count", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			syncMap.Range(func(k, v interface{}) bool {
				return true
			})
		}
	})
}

func BenchmarkInt64KVS(b *testing.B) {
	goCache := cache.New(5*time.Minute, 10*time.Minute)
	b.Run("go-cache insert", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			goCache.Set(string(rand.Int63()), utils.RandomStringWithLength(10), cache.DefaultExpiration)
		}
	})
	b.Run("go-cache get", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			goCache.Get(string(rand.Int63()))
		}
	})
	b.Run("go-cache count", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			goCache.ItemCount()
		}
	})

	syncMap := sync.Map{}
	b.Run("sync.map insert", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			syncMap.Store(rand.Int63(), utils.RandomStringWithLength(10))
		}
	})
	b.Run("sync.map get", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			syncMap.Load(rand.Int63())
		}
	})
	b.Run("sync.map count", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			syncMap.Range(func(k, v interface{}) bool {
				return true
			})
		}
	})
}
