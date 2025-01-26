import os
import subprocess
import signal
import socket

backend_process = None
frontend_process = None

def run_command(command, cwd=None):
    result = subprocess.run(command, shell=True, cwd=cwd)
    if result.returncode != 0:
        print(f"Command failed: {command}")
        exit(result.returncode)

def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('127.0.0.1', port)) == 0

def kill_process_on_port(port):
    result = subprocess.run(f"lsof -ti:{port} | xargs kill -9", shell=True)
    if result.returncode == 0:
        print(f"Process on port {port} terminated.")
    else:
        print(f"Failed to terminate process on port {port}.")

def setup_backend():
    global backend_process
    print("Setting up the backend...")
    backend_path = os.path.join(os.getcwd(), 'Backend-theTasksApp')
    run_command('dotnet restore', cwd=backend_path)
    run_command('dotnet ef database update', cwd=backend_path)
    run_command('dotnet build', cwd=backend_path)
    if is_port_in_use(5288):
        print("Port 5288 is already in use. Terminating the existing process...")
        kill_process_on_port(5288)
    backend_process = subprocess.Popen('dotnet run', shell=True, cwd=backend_path)

def setup_frontend():
    global frontend_process
    print("Setting up the frontend...")
    frontend_path = os.path.join(os.getcwd(), 'Frontend-theTasksApp')
    run_command('npm install', cwd=frontend_path)
    frontend_process = subprocess.Popen('ng serve', shell=True, cwd=frontend_path)

def stop_processes():
    if backend_process:
        backend_process.terminate()
        backend_process.wait()
        print("\033[91m\n ==> Backend process terminated.\033[0m")
    if frontend_process:
        frontend_process.terminate()
        frontend_process.wait()
        print("\033[91m ==> Frontend process terminated.\033[0m\n")

if __name__ == "__main__":
    try:
        setup_backend()
        setup_frontend()
        print("Backend is running at http://localhost:5288/swagger/index.html")
        print("Frontend is running at http://localhost:4200")
        print("\033[93m\n ==> Press Enter to stop backend and frontend processes...\n\033[0m")
        input()
    finally:
        stop_processes()