FROM openjdk:8u171-jre-alpine3.7
VOLUME /tmp
ADD target/app.jar app.jar
RUN bash -c 'touch /app.jar'
EXPOSE 8080
#ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]
COPY ./startApp.sh /
RUN chmod 755 /startApp.sh
ENTRYPOINT ["/startApp.sh"]
