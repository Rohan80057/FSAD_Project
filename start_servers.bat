@echo off
echo Starting FSAD Project...

echo 1. Starting Java Spring Boot Backend...
echo ----------------------------------------
cd /d "%~dp0\portfolio"
start "FSAD Spring Boot Backend" cmd /c "set MAVEN_OPTS=--add-opens=jdk.compiler/com.sun.tools.javac.code=ALL-UNNAMED --add-opens=jdk.compiler/com.sun.tools.javac.comp=ALL-UNNAMED --add-opens=jdk.compiler/com.sun.tools.javac.file=ALL-UNNAMED --add-opens=jdk.compiler/com.sun.tools.javac.main=ALL-UNNAMED --add-opens=jdk.compiler/com.sun.tools.javac.model=ALL-UNNAMED --add-opens=jdk.compiler/com.sun.tools.javac.parser=ALL-UNNAMED --add-opens=jdk.compiler/com.sun.tools.javac.processing=ALL-UNNAMED --add-opens=jdk.compiler/com.sun.tools.javac.tree=ALL-UNNAMED --add-opens=jdk.compiler/com.sun.tools.javac.util=ALL-UNNAMED --add-opens=jdk.compiler/com.sun.tools.javac.jvm=ALL-UNNAMED && mvn clean spring-boot:run"

echo 2. Starting React Vite Frontend...
echo ----------------------------------------
cd /d "%~dp0\Financial Portfolio Website (1)"
start "FSAD Vite Frontend" cmd /c "npm run dev"

echo.
echo Both servers are starting in separate windows.
echo - Backend will be available at: http://localhost:8088 
echo - Frontend will be available at: http://localhost:5173
echo.
pause
