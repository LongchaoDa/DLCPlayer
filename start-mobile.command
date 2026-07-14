#!/bin/sh
cd "$(dirname "$0")" || exit 1

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required to run 78DLC Player."
  echo "Install Node.js, then run this file again."
  read -r _unused
  exit 1
fi

export HOST="${HOST:-0.0.0.0}"
export PLAYER_HTTPS="${PLAYER_HTTPS:-1}"
export PLAYER_DRIVE_SYNC="${PLAYER_DRIVE_SYNC:-1}"
export PLAYER_DRIVE_FOLDER_ID="${PLAYER_DRIVE_FOLDER_ID:-1BafAOZrEUhHe2PwrG5n1KhEaS1pF6TOg}"

echo "Starting 78DLC Player for phone/PWA use..."
echo "HTTPS mode: ${PLAYER_HTTPS}"
echo "Google Drive sync folder: ${PLAYER_DRIVE_FOLDER_ID}"
node server.js
