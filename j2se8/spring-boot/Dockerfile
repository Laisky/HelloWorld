FROM openjdk:8u171-jre-alpine3.7 AS build
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh ca-certificates && \
    update-ca-certificates

RUN apk add --no-cache zip openjdk8

COPY . /usr/src/myapp
WORKDIR /usr/src/myapp
RUN ./gradlew build

FROM openjdk:8u171-jre-alpine3.7
COPY --from=gobin build/libs/gs-spring-boot-0.1.0.jar app.jar
COPY --from=gobin /etc/ssl/certs /etc/ssl/certs
CMD java -Djava.security.egd=file:/dev/./urandom -jar app.jar
