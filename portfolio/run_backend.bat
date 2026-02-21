@echo off
cd /d "%~dp0"
call powershell -ExecutionPolicy Bypass -File .\run_app.ps1 > backend.log 2>&1
pause
