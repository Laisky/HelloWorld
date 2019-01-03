FROM maven:3.5-jdk-8 AS jbuilder

WORKDIR /
RUN apt-get update && apt-get upgrade -y && \
        apt-get install -y bash git openssh-server

ADD ./sidecar ./sidecar
RUN cd sidecar && \
        mvn clean install


# -----------------------------------------------------------
FROM java:8-alpine

COPY --from=jbuilder  /sidecar/target/sidecar-0.0.1-SNAPSHOT.jar app.jar

# entrypoint to the image on run
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]
