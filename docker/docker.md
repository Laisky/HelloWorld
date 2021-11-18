Docker
===

- [Install](#install)
- [Deploy](#deploy)
- [Run](#run)


## Install

确认版本为 `1.6.0`，太老的版本连不上 registry2.0
```sh
$ docker -v
Docker version 1.6.0, build 4749651
```

### Ubuntu

```sh
$ sudo apt-get update
$ sudo apt-get install linux-image-generic-lts-raring linux-headers-generic-lts-raring apt-transport-https
$ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 36A1D7869245C8950F966E92D8576A8BA88D21E9
$ sudo bash -c "echo deb https://get.docker.io/ubuntu docker main > /etc/apt/sources.list.d/docker.list"
$ sudo apt-get update
$ sudo apt-get install lxc-docker
```

### OSX

```sh
$ brew install boot2docker
$ boot2docker init
$ boot2docker start
$ boot2docker shellinit
$ boot2docker ssh "echo $'EXTRA_ARGS=\"--insecure-registry 1.1.1.1:5000\"' | sudo tee -a /var/lib/boot2docker/profile && sudo /etc/init.d/docker restart"
```
在 .*shrc 中添加 `eval "$(boot2docker shellinit)”`


## Deploy

### 配置本地镜像仓库

在 `/etc/default/docker` 中添加 `DOCKER_OPTS="$DOCKER_OPTS --insecure-registry 1.1.1.1:5000"`

### 配置用户组，免得老是打 sudo

```sh
$ sudo groupadd docker
$ sudo gpasswd -a laisky docker
$ sudo service docker restart
```

### 配置一些方便的轮子

在 *shrc 中 `source` 这个 utils
[docker-utils](https://gist.github.com/d7e4d20ae30af306b82e)

就可以添加两个轮子
```sh
$ docker-enter <id>
$ docker-pid <id>
```


## Run

### pull & run

```
$ sudo docker pull 1.1.1.1:5000/qb
$ sudo docker run -i -t -d --name qb 1.1.1.1:5000/qb:latest /bin/bash
$ sudo docker attach qb   # 按几下回车
```

detach 用 `ctrl+p ctrl+q`

### push

push 前要先改 tag

```
$ sudo docker tag <your_docker_image> 1.1.1.1:5000/<repo_name>:<tag_name>
$ sudo docker push 1.1.1.1:5000/<repo_name>:<tag_name>
```

### 常用命令

 - ps
    - `docker ps [-a]`
 - run
    - `docker run -i -t [-d] <image> /bin/bash`
 - stop
    - `docker stop <id>`
 - rm
    - `docker rm <id>`  # 删除容器
 - rmi
    - `docker rmi <image_id>`  # 删除镜像
 - import
    - `cat <path/to/tar> | sudo docker import - <image_name>`   # 导入镜像 tar 包
 - export
    - `docker export <container_id> > <path/to/tar>`            # 导出容器 tar 包
