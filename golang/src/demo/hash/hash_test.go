package main_test

import (
	"crypto/md5"
	"crypto/sha1"
	"math/rand"
	"testing"

	"github.com/Laisky/go-utils"
	"github.com/cespare/xxhash"
	"github.com/dgryski/go-metro"
	"github.com/spaolacci/murmur3"
)

func BenchmarkHash(b *testing.B) {
	data1k := []byte(utils.RandomStringWithLength(1024))
	data10k := []byte(utils.RandomStringWithLength(10240))

	b.Run("md5 1kb", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			md5.Sum(data1k)
		}
	})
	b.Run("md5 10kb", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			md5.Sum(data10k)
		}
	})

	b.Run("sha1 1kb", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			sha1.Sum(data1k)
		}
	})
	b.Run("sha1 10kb", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			sha1.Sum(data10k)
		}
	})

	b.Run("xxhash 1kb", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			xxhash.Sum64(data1k)
		}
	})
	b.Run("xxhash 10kb", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			xxhash.Sum64(data10k)
		}
	})

	b.Run("murmur3 1kb", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			murmur3.Sum64(data1k)
		}
	})
	b.Run("murmur3 10kb", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			murmur3.Sum64(data10k)
		}
	})

	seed := rand.Uint64()
	b.Run("metro 1kb", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			metro.Hash128(data1k, seed)
		}
	})
	b.Run("metro 10kb", func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			metro.Hash128(data10k, seed)
		}
	})

}
