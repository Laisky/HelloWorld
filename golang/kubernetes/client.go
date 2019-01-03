/*
 * Kubernetes HTTP API 测试
 * http://kubernetes.io/docs/api-reference/v1/operations/
 *
 */
package main

import (
	"fmt"
	"log"

	"github.com/kubernetes/kubernetes/pkg/api"
	client "github.com/kubernetes/kubernetes/pkg/client/unversioned"
)

func main() {

	config := client.Config{
		Host: "http://my-kube-api-server.me:8080",
	}
	c, err := client.New(&config)
	if err != nil {
		log.Fatalln("Can't connect to Kubernetes API:", err)
	}

	s, err := c.Services(api.NamespaceDefault).Get("some-service-name")
	if err != nil {
		log.Fatalln("Can't get service:", err)
	}
	fmt.Println("Name:", s.Name)
	for p, _ := range s.Spec.Ports {
		fmt.Println("Port:", s.Spec.Ports[p].Port)
		fmt.Println("NodePort:", s.Spec.Ports[p].NodePort)
	}
}
