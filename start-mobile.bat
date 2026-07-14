@echo off
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required to run 78DLC Player.
  echo Install Node.js, then run this file again.
  pause
  exit /b 1
)

if "%HOST%"=="" set HOST=0.0.0.0
if "%PLAYER_HTTPS%"=="" set PLAYER_HTTPS=1
if "%PLAYER_DRIVE_SYNC%"=="" set PLAYER_DRIVE_SYNC=1
if "%PLAYER_DRIVE_FOLDER_ID%"=="" set PLAYER_DRIVE_FOLDER_ID=1BafAOZrEUhHe2PwrG5n1KhEaS1pF6TOg

echo Starting 78DLC Player for phone/PWA use...
echo HTTPS mode: %PLAYER_HTTPS%
echo Google Drive sync folder: %PLAYER_DRIVE_FOLDER_ID%
node server.js
