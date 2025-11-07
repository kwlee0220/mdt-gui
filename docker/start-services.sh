#!/bin/bash

set -euo pipefail

BACKEND_DIR="/mdt/mdt-gui/dtbackend-main"
FRONTEND_DIR="/mdt/mdt-gui/dtfront-main"

cleanup() {
  trap - INT TERM

  if [[ -n "${FRONTEND_PID:-}" ]] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
    kill -TERM "$FRONTEND_PID" 2>/dev/null || true
    wait "$FRONTEND_PID" 2>/dev/null || true
  fi

  if [[ -n "${BACKEND_PID:-}" ]] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    kill -TERM "$BACKEND_PID" 2>/dev/null || true
    wait "$BACKEND_PID" 2>/dev/null || true
  fi
}

trap cleanup INT TERM

cd "$BACKEND_DIR"
yarn start &
BACKEND_PID=$!

# 백엔드 기동 여유 시간
sleep 3

cd "$FRONTEND_DIR"
yarn start &
FRONTEND_PID=$!

wait "$FRONTEND_PID"
FRONTEND_STATUS=$?

cleanup

exit "$FRONTEND_STATUS"

