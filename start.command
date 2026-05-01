#!/bin/sh
cd "$(dirname "$0")" || exit 1

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required to run 78DLC Player."
  echo "Install Node.js, then run this file again."
  read -r _unused
  exit 1
fi

open "http://localhost:${PORT:-4318}" >/dev/null 2>&1 &
node server.js
