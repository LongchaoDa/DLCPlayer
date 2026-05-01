@echo off
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required to run 78DLC Player.
  echo Install Node.js, then run this file again.
  pause
  exit /b 1
)

if "%PORT%"=="" (
  start "" "http://localhost:4318"
) else (
  start "" "http://localhost:%PORT%"
)
node server.js
