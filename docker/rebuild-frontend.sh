#!/usr/bin/env bash
# Rebuild frontend and verify production JS does NOT contain localhost:4000
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> Pull latest frontend api.ts (optional safety)"
if command -v git >/dev/null 2>&1 && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git pull --ff-only origin "$(git branch --show-current)" 2>/dev/null || true
fi

echo "==> Remove stale host .next (aaPanel sometimes serves these)"
rm -rf "$ROOT/.next" "$ROOT/frontend/.next" 2>/dev/null || true

echo "==> Rebuild frontend image (no cache)"
docker compose build --no-cache frontend

echo "==> Restart frontend + nginx"
docker compose up -d frontend
docker compose restart nginx

echo "==> Wait for frontend..."
sleep 8

SITE="${NEXT_PUBLIC_SITE_URL:-https://esimviet.com}"
SITE="${SITE%/}"

echo "==> Fetch admin login page"
HTML="$(curl -fsSL "$SITE/admin/login")"

CHUNK="$(echo "$HTML" | grep -o 'admin/login/page-[^"]*\.js' | head -1 || true)"
if [[ -z "$CHUNK" ]]; then
  echo "WARN: Could not find login page chunk in HTML"
else
  echo "==> Check chunk: $CHUNK"
  JS="$(curl -fsSL "$SITE/_next/static/chunks/$CHUNK")"
  if echo "$JS" | grep -q 'localhost:4000'; then
    echo ""
    echo "FAIL: JS still contains localhost:4000"
    echo "      Browser cache is NOT the issue — server is serving old build."
    echo "      Run from: $ROOT"
    echo "      Ensure frontend/src/lib/api.ts uses baseURL: '/api'"
    exit 1
  fi
  echo "OK: No localhost:4000 in login chunk"
fi

echo "==> Test API login"
HTTP="$(curl -s -o /tmp/login.json -w '%{http_code}' -X POST "$SITE/api/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"admin123"}')"
echo "API login HTTP: $HTTP"
cat /tmp/login.json
echo ""

if [[ "$HTTP" != "200" ]]; then
  echo "WARN: API login failed — run: docker compose exec backend node scripts/reset-admin.cjs"
  exit 1
fi

echo ""
echo "Done. Open $SITE/admin/login in Incognito and login: admin / admin123"
