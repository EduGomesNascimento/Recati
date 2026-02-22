import subprocess
import sys
import time
import urllib.request
import webbrowser
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
APP_URL = "http://localhost:8100/mobile"
HEALTH_URL = "http://127.0.0.1:8100/health"


def wait_for_server(timeout_seconds: int = 25) -> bool:
    start = time.time()
    while time.time() - start < timeout_seconds:
        try:
            with urllib.request.urlopen(HEALTH_URL, timeout=2) as response:
                if response.status == 200:
                    return True
        except Exception:
            time.sleep(0.5)
    return False


def main() -> int:
    cmd = [
        sys.executable,
        "-m",
        "uvicorn",
        "app.main:app",
        "--host",
        "0.0.0.0",
        "--port",
        "8100",
    ]
    process = subprocess.Popen(cmd, cwd=str(BASE_DIR))

    try:
        if not wait_for_server():
            print("Nao foi possivel iniciar a aplicacao.")
            process.terminate()
            return 1

        print("Aplicacao iniciada em:", APP_URL)
        webbrowser.open(APP_URL)
        process.wait()
        return process.returncode or 0
    except KeyboardInterrupt:
        print("\nEncerrando aplicacao...")
        return 0
    finally:
        if process.poll() is None:
            process.terminate()
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()


if __name__ == "__main__":
    raise SystemExit(main())

