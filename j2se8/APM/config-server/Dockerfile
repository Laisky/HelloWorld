FROM openjdk:8u171-jdk-alpine3.7

RUN apk update && apk upgrade && \
    apk add --no-cache bash git ca-certificates && \
    update-ca-certificates

RUN git config --global http.sslVerify false

