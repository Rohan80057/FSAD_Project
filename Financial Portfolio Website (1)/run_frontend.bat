@echo off
cd /d "%~dp0"
call npm.cmd install > frontend.log 2>&1
call npm.cmd run dev >> frontend.log 2>&1
pause
