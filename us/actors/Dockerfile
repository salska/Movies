FROM openjdk:8-alpine3.9
WORKDIR /
ADD /var/lib/jenkins/.m2/repository/com/salkabay/movies-actors/1.0/movies-actors-1.0.jar actors.jar
EXPOSE 8048
CMD java -jar actors.jar
