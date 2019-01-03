package main

import (
	"context"
	"fmt"
	"time"
)

func goro1(ctx context.Context, taskName string) {
	for {
		select {
		case <-ctx.Done():
			fmt.Printf("[%v]context canceled\n", taskName)
			return
		default:
			time.Sleep(time.Second * 1)
			fmt.Printf("[%v]do some routine works...\n", taskName)
		}
	}
}

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	go goro1(ctx, "1")
	go goro1(ctx, "2")
	go goro1(ctx, "3")

	time.Sleep(time.Second * 5)
	cancel()
	time.Sleep(time.Second * 1)
	fmt.Println("All done")
}
