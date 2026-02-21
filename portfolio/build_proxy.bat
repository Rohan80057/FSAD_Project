@echo off
cd /d "%~dp0"
call mvn clean compile > build_output.txt 2>&1
