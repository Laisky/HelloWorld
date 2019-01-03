FROM maven:3.5-jdk-8 AS jbuilder

WORKDIR /
RUN apt-get update && apt-get upgrade -y && \
        apt-get install -y bash git openssh-server

RUN git clone https://github.com/sasikumar-sugumar/eureka-server.git && \
        cd eureka-server && \
        mvn clean install


FROM frolvlad/alpine-oraclejdk8:slim

# install

# label for the image
LABEL Description="Eureka Server" Version="0.0.1"

# the version of the archive
ARG VERSION=0.0.1

# mount the temp volume
VOLUME /tmp

# Add the service as app.jar
COPY --from=jbuilder  /eureka-server/target/eureka-server-${VERSION}-SNAPSHOT.jar app.jar

# touch the archive for timestamp
RUN sh -c 'touch /app.jar'

# entrypoint to the image on run
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]
