FROM 3.8.15-buster

# install dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends g++ make gcc git build-essential ca-certificates curl \
    && update-ca-certificates

# install gramine
RUN apt install -y autoconf bison gawk nasm ninja-build \
    && python3-click python3-jinja2 wget \
    && libcurl4-openssl-dev libprotobuf-c-dev \
    && protobuf-c-compiler python3-cryptography python3-pip python3-protobuf \
    && pip3 install --upgrade protobuf~=3.20

RUN curl -fsSLo /usr/share/keyrings/gramine-keyring.gpg https://packages.gramineproject.io/gramine-keyring.gpg \
    && echo 'deb [arch=amd64 signed-by=/usr/share/keyrings/gramine-keyring.gpg] https://packages.gramineproject.io/ stable main' | sudo tee /etc/apt/sources.list.d/gramine.list \
    && apt-get update \
    && apt-get install gramine
