# Docker fluentd log test

Fluentd 相关的内容可以参考：[https://blog.laisky.com/p/fluentd/](https://blog.laisky.com/p/fluentd/)

Docker 的 log-driver 会默认按照换行符来拆分日志，将一条完整的多行日志拆分为数条独立的 json 发送给远端 fluentd 服务器。

可以采用 `concat` 插件来解决这一问题。

文件说明：

* Dockerfile：持续输出日志的应用容器；
* Dockerfile-fluentd：fluentd 服务器容器；
* log_generator.py：输出日志的应用代码；
* fluent.conf：fluentd 的配置文件。

---
## 示例说明

比如原来的应用输出了一些多行日志：

![null](https://s3.laisky.com/images/error_trace.jpg)

然后如果你是通过指定 `--log-driver=fluentd` 启动的 docker 容器，会导致日志被拆分，
看上去是这样的：

![null](https://s3.laisky.com/images/docker_error_trace.jpg)

通过在 fluentd 里配置 `concat` 后，多行日志可以被合并到一行：

![null](https://s3.laisky.com/images/docker_multiline_log.jpg)

---
## 插件说明

References：

- [Docker Logging](https://www.fluentd.org/guides/recipes/docker-logging)
- [fluent-plugin-concat](https://github.com/fluent-plugins-nursery/fluent-plugin-concat)


```
<filter **>
  @type concat
  key log
  stream_identity_key container_id
  # 在 demo 里，每一行标准日志都以这段文字开头：[2018-01-02 - DEBUG - WEB]
  # multiline_start_regexp 指定“匹配日志开头”的正则
  # 不符合匹配的，会被合并进上一行之中
  multiline_start_regexp /^\[\d{4}-\d{2}-\d{2} - DEBUG - WEB\]/
</filter>
```

---
## Demo

```
# build app image
docker build . -f Dockerfile

# build fluentd image
docker build . -f Dockerfile-fluentd

# start fluentd container
docker run -itd --name fluentd -p 24225:24224 <fluentd_image_id>

# start app container
docker run -itd --log-driver=fluentd --log-opt="fluentd-address=localhost:24225" <app_image_id>

# check fluentd log
docker logs -f <fluentd_container_id>
```




