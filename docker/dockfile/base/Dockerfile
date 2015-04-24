FROM ubuntu:12.04
MAINTAINER ppcelery@gmail.com

RUN mkdir -p /var/run/sshd
RUN mkdir -p /var/log/supervisor

RUN apt-get update
RUN apt-get -y upgrade
RUN apt-get install -y make gcc g++ automake autoconf libc6-dev build-essential libtool openssl libssl-dev
RUN apt-get install -y software-properties-common byobu curl git htop man unzip vim wget
RUN apt-get install -y gfortran libopenblas-dev liblapack-dev python-dev libsqlite3-dev libbz2-dev supervisor

# Set environment variables.
ENV HOME /root

# Define working directory.
WORKDIR /root

# Define default command.
CMD ["bash"]

