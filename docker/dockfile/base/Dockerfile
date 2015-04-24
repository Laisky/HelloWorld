# build ubuntu essential
# denpend on https://github.com/dockerfile/ubuntu

FROM ubuntu:14.04
MAINTAINER "ppcelery@gmail.com"

# Install
RUN \
    sed -i 's/# \(.*multiverse$\)/\1/g' /etc/apt/sources.list && \
    mkdir -p /var/run/sshd && \
    mkdir -p /var/log/supervisor && \
    apt-get update && \
    apt-get -y upgrade && \
    apt-get install -y make gcc g++ automake autoconf libc6-dev build-essential libtool openssl libssl-dev libxslt-dev libxml2-dev && \
    apt-get install -y gfortran libopenblas-dev liblapack-dev python-dev libsqlite3-dev libbz2-dev supervisor && \
    apt-get install -y software-properties-common byobu curl git htop man unzip vim wget && \
    rm -rf /var/lib/apt/lists/*

# Add files.
ADD root/.bashrc /root/.bashrc
ADD root/.gitconfig /root/.gitconfig
ADD root/.scripts /root/.scripts

# Set environment variables.
ENV HOME /root

# Define working directory.
WORKDIR /root

# Define default command.
CMD ["bash"]

