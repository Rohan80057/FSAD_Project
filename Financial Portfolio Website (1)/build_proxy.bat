@echo off
cd /d "%~dp0"
call npm.cmd run build > build_output.txt 2>&1
