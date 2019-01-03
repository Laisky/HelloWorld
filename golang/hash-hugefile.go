package main

import (
	"crypto/md5"
	"fmt"
	"io"
	"log"
	"os"
	"runtime/pprof"
)

func main() {
	// Open file for reading
	file, err := os.Open("hugefile")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	// Create new hasher, which is a writer interface
	hasher := md5.New()
	_, err = io.Copy(hasher, file)
	if err != nil {
		log.Fatal(err)
	}

	// pprof
	f, err := os.Create("memory.pprof")
	if err != nil {
		panic(err)
	}
	defer f.Close()
	pprof.WriteHeapProfile(f)

	// Hash and print. Pass nil since
	// the data is not coming in as a slice argument
	// but is coming through the writer interface
	sum := hasher.Sum(nil)
	fmt.Printf("Md5 checksum: %x\n", sum)
}
