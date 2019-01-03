# Eureka


> - [Eureka简介](https://www.cnblogs.com/wangdaijun/p/6851027.html)

服务发现工具，任何微服务都可以注册到 eureka，并且定期（30s）发送一次心跳，确保存活。eureka 还可以主动做健康检查，及时更新服务的状态。

分为 eureka server 和 eureka client，server 是核心组件（可以多节点互为备份），client 相当于是 SDK，方便和 server 进行交互。server 提供 RESTful 接口。

> - [Eureka REST operations](https://github.com/Netflix/eureka/wiki/Eureka-REST-operations)

使用 docker 运行：

> - [Laisky/HelloWorld](https://github.com/Laisky/HelloWorld/tree/master/spring/eureka)

```sh
docker build . -f Dockerfile.v1 -t ppcelery/eureka:test
docker-compose up -d
```
