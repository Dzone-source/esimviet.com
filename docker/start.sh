#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [ ! -f .env ]; then
  echo "Creating .env from .env.docker.example..."
  cp .env.docker.example .env
  echo "Please edit .env with your credentials, then run this script again."
  exit 1
fi

set -a
# shellcheck disable=SC1091
source .env
set +a

echo "Building and starting containers..."
docker compose up -d --build

echo ""
echo "Waiting for services..."
sleep 5

if curl -sf "http://127.0.0.1:${NGINX_HTTP_PORT:-8080}/health" > /dev/null 2>&1; then
  echo "Backend health: OK"
else
  echo "Backend health: starting (check logs with: docker compose logs -f backend)"
fi

echo ""
echo "Done!"
echo "  App URL:  http://127.0.0.1:${NGINX_HTTP_PORT:-8080}"
echo "  Admin:    http://127.0.0.1:${NGINX_HTTP_PORT:-8080}/admin/login"
echo "  Default:  admin / admin123"
echo ""
echo "Logs:   docker compose logs -f"
echo "Stop:   docker compose down"
