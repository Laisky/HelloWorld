FROM ubuntu:14.04
MAINTAINER ppcelery@gmail.com

# Install
RUN \
    sed -i 's/# \(.*multiverse$\)/\1/g' /etc/apt/sources.list && \
    mkdir -p /var/run/sshd && \
    mkdir -p /var/log/supervisor && \
    apt-get update && \
    apt-get -y upgrade && \
    apt-get install -y make gcc g++ automake autoconf libc6-dev build-essential libtool openssl libssl-dev && \
    apt-get install -y software-properties-common byobu curl git htop man unzip vim wget && \
    apt-get install -y gfortran libopenblas-dev liblapack-dev python-dev libsqlite3-dev libbz2-dev supervisor python3 && \
    rm -rf /var/lib/apt/lists/*

# Set environment variables.
ENV HOME /root

# Define working directory.
WORKDIR /root

# Define default command.
CMD ["bash"]

