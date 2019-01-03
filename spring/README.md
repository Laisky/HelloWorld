|![](https://s2.laisky.com/images/spring-cloud.png)|
|:---:|
| Configuration Oriented Programming |

References:

- [How to Integrate Any Webapp Into Spring Cloud Using Sidecar Applications](http://stytex.de/blog/2016/01/18/spring-cloud-sidecar-applications/)
- [Netflix-Skunkworks/zerotodocker](https://github.com/Netflix-Skunkworks/zerotodocker)

## Spring Cloud

Spring Cloud 器大活好，在服务交互中，主要涉及以下几个组件：

- Eureka：集群的核心，负责服务发现；
- Zuul：APIGateway，集群的出入口；
- Feign：HTTP 客户端；
- Ribbon：客户端负载均衡，依托于 eureka 提供服务；
- Hystrix：客户端断路器，对依赖调用进行封装；
- Sidecar：集成了 zuul & ribbon & hystrix & eureka client，用于将异构服务接入到 spring cloud 之中。

![](https://s3.laisky.com/images/sidecar.png)


### Sidecar

sidecar 其实就干了几件事情：

- 监控服务的 `/health` 接口，并且将健康状态提交给 eureka；
- 将服务注册到 eureka；
- 提供一个供服务实用的 zuul，服务请求 sidecar 时，sidecar 根据 eureka 将请求路由到指定的服务上；

不过 sidecar 是有代价的，每一个异构应用都需要捆绑一个 sidecar，这个 sidecar 的资源开销大概是：

- 200 MB 磁盘
- 200 MB 内存
- 启动时 CPU 占用率极高，运行时 CPU 极低。

所以如果你自行实现 eureka 相关的接口（注册、健康检查、吊销），然后在请求的时候自行从 eureka 获取服务列表，然后利用一些策略进行负载均衡，而且对每一个请求都做好断路和回退，那么就相当于完全取代了 sidecar。
