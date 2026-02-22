@echo off
cd /d "%~dp0"
python run_app.py
if errorlevel 1 (
  echo.
  echo Falha ao iniciar a aplicacao.
  pause
)
