FROM gradle:4.6-jdk8-alpine AS jbuilder

USER root
WORKDIR /
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh ca-certificates && \
    update-ca-certificates

ADD ./jvm-service .
RUN gradle wrapper

# -----------------------------------------------------------------------------

FROM ewolff/docker-java
COPY --from=jbuilder ./build/libs/simple1-1.0-SNAPSHOT.jar .
COPY --from=gobin /etc/ssl/certs /etc/ssl/certs

CMD /usr/bin/java -Xmx400m -Xms400m -jar simple1-1.0-SNAPSHOT.jar
EXPOSE 8080
