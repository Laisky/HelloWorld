package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"strings"
)

func sayHelloHandle(w http.ResponseWriter, r *http.Request) {
	r.ParseForm() //解析参数，默认是不会解析的
	fmt.Println("-------- new req --------")
	fmt.Println("form", r.Form) //这些信息是输出到服务器端的打印信息
	fmt.Println("path", r.URL.Path)
	fmt.Println("cookie", r.Cookies())
	fmt.Println("scheme", r.URL.Scheme)
	fmt.Println("url_long", r.Form["url_long"])
	for k, v := range r.Form {
		fmt.Println("key:", k)
		fmt.Println("val:", strings.Join(v, ""))
	}
	fmt.Fprintf(w, "Hello World!") //这个写入到w的是输出到客户端的
}

func loginHandle(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		t, _ := template.ParseFiles("templates/simple-login.html")
		t.Execute(w, nil)
	} else {
		r.ParseForm()

		username := r.Form.Get("username")
		password := r.Form.Get("password")
		//请求的是登陆数据，那么执行登陆的逻辑判断
		fmt.Println("username:", username)
		fmt.Println("password:", password)
		// 设置 cookie
		cookie := http.Cookie{Name: "username", Value: password}
		http.SetCookie(w, &cookie)
	}
}

func showHandle(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, r.Cookies())
}

func main() {
	http.HandleFunc("/", sayHelloHandle) //设置访问的路由
	http.HandleFunc("/login", loginHandle)
	http.HandleFunc("/show", showHandle)
	err := http.ListenAndServe("localhost:4000", nil) //设置监听的端口
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
