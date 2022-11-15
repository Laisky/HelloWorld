# db . -t ppcelery/gramine:base-20221115
FROM python:3.8.15-buster

# install dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends g++ make gcc git build-essential ca-certificates curl \
    && update-ca-certificates \
    libunwind8 musl-tools autoconf bison gawk nasm ninja-build \
    wget libcurl4-openssl-dev libprotobuf-c-dev protobuf-c-compiler libprotobuf-c1

RUN set -x && curl -fsSLo /usr/share/keyrings/gramine-keyring.gpg https://packages.gramineproject.io/gramine-keyring.gpg \
    && echo 'deb [arch=amd64 signed-by=/usr/share/keyrings/gramine-keyring.gpg] https://packages.gramineproject.io/ 1.3 main' | tee /etc/apt/sources.list.d/gramine.list \
    && apt-get update \
    && apt-get install -y gramine

# /usr/bin/python3 is fucking 3.7, should rewrite to 3.8
#
# gramine debian depends on python3, which is link to 3.7.
# if you want to use different version(3.8) of python,
# you need manually relink /usr/bin/python3 -> /usr/local/bin/python3.8,
# then copy all gramine's python packages to 3.8's PYTHONPATH.
RUN cp -rf /usr/lib/python3/dist-packages/* /usr/local/lib/python3.8/site-packages/. \
    # && apt remove -y python3.7 \
    # && apt autoremove -y \
    && ln -snf /usr/local/bin/python3.8 /usr/bin/python3 \
    && python3 -m pip install protobuf~=3.20 click jinja2 cryptography cffi pyelftools toml pytest hypothesis

# RUN wget https://bootstrap.pypa.io/get-pip.py \
#     && python3.7 get-pip.py \
#     && python3.7 -m pip install protobuf~=3.20 click jinja2 cryptography \
#     && python3 -m pip install protobuf~=3.20 click jinja2 cryptography

# preinstall some infras
RUN python3 -m pip install pandas==1.4.2 pillow numpy scipy matplotlib

# manual check whether gramine could run
# gramine-sgx-gen-private-key private.pem
