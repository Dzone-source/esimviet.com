#!/usr/bin/env bash
# Fix admin login on production server
set -euo pipefail

cd "$(dirname "$0")/.."
echo "=== eSIM Admin Login Fix ==="
echo "Working directory: $(pwd)"
echo ""

echo "[1/4] Reset admin password in database..."
docker compose exec -T backend node -e '
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
bcrypt.hash("admin123", 12).then(h =>
  p.user.upsert({
    where: { username: "admin" },
    update: { password: h, role: "admin" },
    create: { username: "admin", password: h, role: "admin" }
  })
).then(() => { console.log("OK admin/admin123"); return p.$disconnect(); })
.catch(e => { console.error("FAIL:", e.message); process.exit(1); });
'

echo ""
echo "[2/4] Test API via Docker Nginx (port 8080)..."
HTTP_CODE=$(curl -s -o /tmp/login-test.json -w "%{http_code}" \
  -X POST http://127.0.0.1:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}')

echo "HTTP $HTTP_CODE"
cat /tmp/login-test.json
echo ""

if [ "$HTTP_CODE" != "200" ]; then
  echo "❌ API login failed on port 8080"
  exit 1
fi

echo ""
echo "[3/4] Rebuild frontend + backend (required for browser login fix)..."
docker compose up -d --build frontend backend

echo ""
echo "[4/4] Wait for containers..."
sleep 15
docker compose ps

echo ""
echo "=== DONE ==="
echo "Login: admin / admin123"
echo "URL:   http://YOUR-IP:8080/admin/login"
echo ""
echo "IMPORTANT: Hard refresh browser with Ctrl+Shift+R"
echo "If using domain via aaPanel, test:"
echo "  curl -X POST https://YOUR-DOMAIN.com/api/auth/login \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"username\":\"admin\",\"password\":\"admin123\"}'"
