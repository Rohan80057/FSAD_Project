import subprocess
import time
import urllib.request
from urllib.error import URLError
import sys
import os

frontend_dir = r"d:\KLH\VAULTS SENSITIVE\2-2\S 24SDCS02-Full Stack Application Development\FSAD project\FSAD_Project\Financial Portfolio Website (1)"
backend_dir = r"d:\KLH\VAULTS SENSITIVE\2-2\S 24SDCS02-Full Stack Application Development\FSAD project\FSAD_Project\portfolio"

print("Starting servers...")

# Using creationflags=subprocess.CREATE_NEW_CONSOLE to detach processes and prevent them blocking the script
backend_proc = subprocess.Popen(
    ["powershell.exe", "-ExecutionPolicy", "Bypass", "-File", "run_app.ps1"],
    cwd=backend_dir,
    stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True
)

frontend_proc = subprocess.Popen(
    ["cmd.exe", "/c", "run_frontend.bat"],
    cwd=frontend_dir,
    stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True
)

backend_started = False
frontend_started = False

print("Waiting for servers to start (up to 60s)...")
for i in range(30):
    time.sleep(2)
    
    if not backend_started:
        try:
            resp = urllib.request.urlopen("http://localhost:8080/api/health", timeout=1) # Or whatever the base URL is.
            if resp.getcode() in [200, 401, 403, 404]: # if the server responds at all, it's up
                backend_started = True
                print("Backend responding on port 8080.")
        except URLError:
            pass

    if not frontend_started:
        try:
            resp = urllib.request.urlopen("http://localhost:5173", timeout=1) # Vite default port
            if resp.getcode() == 200:
                frontend_started = True
                print("Frontend responding on port 5173.")
        except URLError:
            try:
                # Fallback to port 3000
                resp = urllib.request.urlopen("http://localhost:3000", timeout=1)
                if resp.getcode() == 200:
                    frontend_started = True
                    print("Frontend responding on port 3000.")
            except URLError:
                pass

    if backend_started and frontend_started:
        print("SUCCESS: Both servers are functional and responding!")
        backend_proc.terminate()
        frontend_proc.terminate()
        sys.exit(0)

print(f"TIMEOUT. Backend started: {backend_started}, Frontend started: {frontend_started}")
print("Fetching logs...")
# We can't really pull stdout stream easily since it's blocking if not full, but we can do communicate
backend_proc.terminate()
frontend_proc.terminate()
sys.exit(1)
