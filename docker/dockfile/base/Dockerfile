# build ubuntu essential
# denpend on https://github.com/dockerfile/ubuntu

FROM ubuntu:14.04
MAINTAINER "ppcelery@gmail.com"

# Install
RUN \
    # set bash
    rm /bin/sh && ln -s /bin/bash /bin/sh && \

    # install
    sed -i 's/# \(.*multiverse$\)/\1/g' /etc/apt/sources.list && \
    mkdir -p /var/run/sshd && \
    apt-get update && \
    apt-get -y upgrade && \
    apt-get install -y make gcc g++ automake autoconf libc6-dev build-essential libtool openssl libssl-dev libxslt-dev libxml2-dev && \
    apt-get install -y gfortran libopenblas-dev liblapack-dev python-dev libsqlite3-dev libbz2-dev supervisor && \
    apt-get install -y software-properties-common byobu curl git htop man unzip vim wget && \
    rm -rf /var/lib/apt/lists/*

# Add files.
ADD .bashrc /root/.bashrc
ADD .gitconfig /root/.gitconfig
ADD .scripts /root/.scripts

# Set environment variables.
ENV HOME /root
ENV LC_ALL en_US.UTF-8
ENV LANG en_US.UTF-8

# Define working directory.
WORKDIR /root

# Define default command.
CMD ["bash"]

