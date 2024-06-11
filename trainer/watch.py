from watchgod import run_process
import subprocess
import os
import sys
import psutil
import time

process = None
port = 8000


def kill_processes_on_port(port):
    for proc in psutil.process_iter(["pid", "name"]):
        try:
            for conn in proc.connections(kind="inet"):
                if conn.laddr.port == port:
                    proc.terminate()
                    proc.wait()
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue


def run_daphne():
    global process
    # Terminate any existing processes on the port
    kill_processes_on_port(port)

    cmd = [
        sys.executable,
        "-m",
        "daphne",
        "-b",
        "0.0.0.0",
        "-p",
        str(port),
        "trainer.asgi:application",
    ]
    process = subprocess.Popen(cmd)


if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "trainer.settings")
    run_process(".", run_daphne)
