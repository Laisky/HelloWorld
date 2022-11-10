# db . -t ppcelery/gramine:base-20221110
FROM python:3.8.15-buster

# install dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends g++ make gcc git build-essential ca-certificates curl \
    && update-ca-certificates

# install gramine
RUN apt install -y autoconf bison gawk nasm ninja-build \
    wget libcurl4-openssl-dev libprotobuf-c-dev protobuf-c-compiler \
    && pip3 install --upgrade protobuf~=3.20 click jinja2 cryptography pip protobuf

RUN curl -fsSLo /usr/share/keyrings/gramine-keyring.gpg https://packages.gramineproject.io/gramine-keyring.gpg \
    && echo 'deb [arch=amd64 signed-by=/usr/share/keyrings/gramine-keyring.gpg] https://packages.gramineproject.io/ stable main' | tee /etc/apt/sources.list.d/gramine.list \
    && apt-get update \
    && apt-get install -y gramine

# preinstall some infras
RUN pip3 install pandas==1.4.2 scikit-learn==1.0.2 xgboost==1.7.1 pillow numpy scipy matplotlib
