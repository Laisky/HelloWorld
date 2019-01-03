package main

import (
	"fmt"
	"regexp"
	"time"
)

func testTime() {
	r := regexp.MustCompile("^(\\d{8})\\.log\\.gz$")
	s := "20180416.log.gz"
	fmt.Println(r.FindStringSubmatch(s))
	t, _ := time.Parse("20060102-0700", r.FindStringSubmatch(s)[1]+"+0800")
	fmt.Println("now", time.Now())
	fmt.Println("t", t)
	fmt.Println("since", time.Since(t).Hours(), "hours")
}

func textStrpTime() {
	fmt.Println(time.Parse("20060102-0700", "20160101+0800"))
}

func main() {
	r := regexp.MustCompile("(.*) .*")
	s := "djij oko"
	for _, v := range r.FindStringSubmatch(s) {
		fmt.Println(v)
	}

	fmt.Println("------------------------------")
	testTime()

	fmt.Println("------------------------------")
	textStrpTime()
}
