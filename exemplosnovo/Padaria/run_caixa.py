from __future__ import annotations

import json
import os
import socket
import sys
import threading
import time
import urllib.request
import webbrowser
from pathlib import Path
import tkinter as tk
from tkinter import ttk

import uvicorn

BIND_HOST = "0.0.0.0"
LOCAL_HOST = "127.0.0.1"
PORT = 8000
CAIXA_URL = f"http://{LOCAL_HOST}:{PORT}/caixa"
HEALTH_URL = f"http://{LOCAL_HOST}:{PORT}/health"
DB_HEALTH_URL = f"http://{LOCAL_HOST}:{PORT}/health/db"


def _is_private_ipv4(ip: str) -> bool:
    try:
        first, second, *_ = [int(part) for part in ip.split(".")]
    except Exception:
        return False
    if first == 10:
        return True
    if first == 192 and second == 168:
        return True
    return first == 172 and 16 <= second <= 31


def get_lan_ipv4_addresses() -> list[str]:
    found: set[str] = set()

    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as probe:
            probe.connect(("1.1.1.1", 80))
            ip = probe.getsockname()[0]
            if _is_private_ipv4(ip):
                found.add(ip)
    except Exception:
        pass

    try:
        infos = socket.getaddrinfo(
            socket.gethostname(),
            None,
            family=socket.AF_INET,
        )
        for info in infos:
            ip = info[4][0]
            if _is_private_ipv4(ip):
                found.add(ip)
    except Exception:
        pass

    return sorted(found)


def get_runtime_dir() -> Path:
    if getattr(sys, "frozen", False):
        return Path(sys.executable).resolve().parent
    return Path(__file__).resolve().parent


def prepare_runtime_environment() -> Path:
    runtime_dir = get_runtime_dir()
    os.chdir(str(runtime_dir))

    db_path = runtime_dir / "padaria.db"
    if "DATABASE_URL" not in os.environ:
        os.environ["DATABASE_URL"] = f"sqlite:///{db_path.as_posix()}"

    return runtime_dir


def health_ok(timeout: float = 1.5) -> bool:
    try:
        with urllib.request.urlopen(HEALTH_URL, timeout=timeout) as response:
            return response.status == 200
    except Exception:
        return False


def db_connected(timeout: float = 1.5) -> bool:
    try:
        with urllib.request.urlopen(DB_HEALTH_URL, timeout=timeout) as response:
            if response.status != 200:
                return False
            payload = json.loads(response.read().decode("utf-8"))
        return (
            isinstance(payload, dict)
            and payload.get("status") == "ok"
            and payload.get("database") == "connected"
        )
    except Exception:
        return False


class CaixaLauncher:
    def __init__(self, root: tk.Tk) -> None:
        self.root = root
        self.root.title("PadariaERP Caixa")
        self.root.geometry("460x220")
        self.root.resizable(False, False)
        self.root.protocol("WM_DELETE_WINDOW", self.on_close)

        self._server: uvicorn.Server | None = None
        self._server_thread: threading.Thread | None = None
        self._external_server = False
        self._browser_opened = False
        self._closing = False
        self._start_deadline = 0.0
        self._server_error: str | None = None
        self._monitor_after_id: str | None = None

        self._build_ui()
        self.start()

    def _build_ui(self) -> None:
        frame = ttk.Frame(self.root, padding=16)
        frame.pack(fill="both", expand=True)

        ttk.Label(
            frame,
            text="PadariaERP Launcher (Caixa)",
            font=("Segoe UI", 12, "bold"),
        ).pack(anchor="w")

        ttk.Label(
            frame,
            text="URL: " + CAIXA_URL,
            foreground="#444444",
        ).pack(anchor="w", pady=(6, 2))
        self.mobile_url_var = tk.StringVar(value="Mobile na rede: detectando...")
        ttk.Label(
            frame,
            textvariable=self.mobile_url_var,
            foreground="#444444",
            wraplength=420,
        ).pack(anchor="w", pady=(2, 2))

        self.status_var = tk.StringVar(value="Iniciando servidor...")
        self.status_label = ttk.Label(
            frame,
            textvariable=self.status_var,
            wraplength=420,
        )
        self.status_label.pack(anchor="w", pady=(8, 14))

        self.server_indicator = tk.Label(
            frame,
            anchor="w",
            font=("Segoe UI", 9, "bold"),
        )
        self.server_indicator.pack(fill="x")
        self.db_indicator = tk.Label(
            frame,
            anchor="w",
            font=("Segoe UI", 9, "bold"),
        )
        self.db_indicator.pack(fill="x", pady=(2, 8))
        self._set_indicator(self.server_indicator, "Servidor", None)
        self._set_indicator(self.db_indicator, "Banco", None)

        actions = ttk.Frame(frame)
        actions.pack(fill="x", side="bottom")

        self.open_btn = ttk.Button(
            actions,
            text="Abrir Caixa",
            command=self.open_caixa,
            state="disabled",
        )
        self.open_btn.pack(side="left")

        self.close_btn = ttk.Button(
            actions,
            text="Fechar App",
            command=self.on_close,
        )
        self.close_btn.pack(side="right")

    def _set_indicator(
        self,
        label: tk.Label,
        title: str,
        ok: bool | None,
    ) -> None:
        if ok is True:
            label.configure(text=f"[OK] {title}: ativo", fg="#1b7f43")
            return
        if ok is False:
            label.configure(text=f"[X] {title}: inativo", fg="#a22d2d")
            return
        label.configure(text=f"[...] {title}: verificando", fg="#7b651d")

    def _refresh_mobile_url(self) -> None:
        ips = get_lan_ipv4_addresses()
        if not ips:
            self.mobile_url_var.set(
                "Mobile na rede: configure com o IP desta maquina (porta 8000)."
            )
            return
        urls = ", ".join([f"http://{ip}:{PORT}/mobile" for ip in ips[:3]])
        self.mobile_url_var.set(f"Mobile na rede: {urls}")

    def _start_monitoring(self) -> None:
        self._stop_monitoring()
        self._refresh_mobile_url()
        self._refresh_indicators()

    def _stop_monitoring(self) -> None:
        if self._monitor_after_id:
            self.root.after_cancel(self._monitor_after_id)
            self._monitor_after_id = None

    def _refresh_indicators(self) -> None:
        if self._closing:
            return
        server_up = health_ok(timeout=0.8)
        self._set_indicator(self.server_indicator, "Servidor", server_up)
        if server_up:
            self._set_indicator(self.db_indicator, "Banco", db_connected(timeout=0.8))
        else:
            self._set_indicator(self.db_indicator, "Banco", False)
        self._monitor_after_id = self.root.after(1800, self._refresh_indicators)

    def start(self) -> None:
        if health_ok():
            self._external_server = True
            self.status_var.set("Servidor ja estava ativo. Caixa pronta.")
            self.open_btn.configure(state="normal")
            self._start_monitoring()
            self.open_caixa()
            return

        try:
            from app.main import app as fastapi_app
        except Exception as exc:  # pragma: no cover - erro de ambiente local
            self.status_var.set(
                "Falha ao carregar aplicacao. Veja o arquivo "
                "'caixa_launcher.log' na pasta do executavel."
            )
            self._write_log(f"Erro ao importar app.main: {exc!r}")
            return

        config = uvicorn.Config(
            app=fastapi_app,
            host=BIND_HOST,
            port=PORT,
            log_level="warning",
            access_log=False,
        )
        self._server = uvicorn.Server(config)
        self._server.install_signal_handlers = lambda: None
        self._server_thread = threading.Thread(
            target=self._run_server,
            daemon=True,
        )
        self._server_thread.start()

        self._start_deadline = time.time() + 30.0
        self.root.after(250, self._poll_startup)

    def _run_server(self) -> None:
        try:
            if self._server:
                self._server.run()
        except Exception as exc:  # pragma: no cover - erro de runtime
            self._server_error = f"{type(exc).__name__}: {exc}"
            self._write_log(f"Erro ao iniciar servidor: {self._server_error}")

    def _write_log(self, message: str) -> None:
        try:
            log_path = get_runtime_dir() / "caixa_launcher.log"
            timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
            with log_path.open("a", encoding="utf-8") as file:
                file.write(f"[{timestamp}] {message}\n")
        except Exception:
            pass

    def _poll_startup(self) -> None:
        if self._closing:
            return
        if self._server_error:
            self.status_var.set(
                "Falha ao iniciar servidor. Veja 'caixa_launcher.log' "
                "na pasta do executavel."
            )
            self._set_indicator(self.server_indicator, "Servidor", False)
            self._set_indicator(self.db_indicator, "Banco", False)
            return
        if health_ok():
            self.status_var.set("Servidor iniciado. Caixa pronta para uso.")
            self.open_btn.configure(state="normal")
            self._start_monitoring()
            self.open_caixa()
            return
        if time.time() > self._start_deadline:
            self.status_var.set(
                "Falha ao iniciar servidor na porta 8000. "
                "Feche outro processo usando a porta e abra novamente."
            )
            self._set_indicator(self.server_indicator, "Servidor", False)
            self._set_indicator(self.db_indicator, "Banco", False)
            return
        self.root.after(350, self._poll_startup)

    def open_caixa(self) -> None:
        webbrowser.open(CAIXA_URL)
        if not self._browser_opened:
            self._browser_opened = True
            self.status_var.set(
                "Caixa aberta no navegador. O servidor ficara ativo "
                "enquanto este app estiver aberto."
            )

    def on_close(self) -> None:
        if self._closing:
            return
        self._closing = True
        self._stop_monitoring()
        self.open_btn.configure(state="disabled")
        self.close_btn.configure(state="disabled")
        self.status_var.set("Encerrando...")

        if self._server and not self._external_server:
            self._server.should_exit = True
            self.root.after(200, self._wait_server_stop)
            return
        self.root.destroy()

    def _wait_server_stop(self) -> None:
        thread = self._server_thread
        if not thread:
            self.root.destroy()
            return
        if thread.is_alive():
            self.root.after(200, self._wait_server_stop)
            return
        self.root.destroy()


def main() -> int:
    prepare_runtime_environment()
    root = tk.Tk()
    ttk.Style().theme_use("clam")
    CaixaLauncher(root)
    root.mainloop()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())



