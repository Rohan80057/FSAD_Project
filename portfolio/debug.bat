@echo off
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.16.8-hotspot
set Path=%JAVA_HOME%\bin;%Path%
echo Active Java version:
java -version
echo.
echo Running Maven...
mvn clean spring-boot:run
