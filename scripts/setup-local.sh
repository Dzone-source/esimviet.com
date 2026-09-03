#!/usr/bin/env bash
# One-command local setup from the repository root.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "==> [1/4] Database"
"$ROOT_DIR/scripts/setup-local-db.sh"

echo ""
echo "==> [2/4] Backend env"
if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
  echo "    Created backend/.env"
else
  echo "    backend/.env already exists"
fi

echo ""
echo "==> [3/4] Prisma schema + seed"
(
  cd backend
  npm install
  npx prisma generate
  npx prisma db push
  npm run seed
)

echo ""
echo "==> [4/4] Frontend env (optional)"
if [ ! -f frontend/.env.local ]; then
  cp frontend/.env.local.example frontend/.env.local
  echo "    Created frontend/.env.local"
else
  echo "    frontend/.env.local already exists"
fi

echo ""
echo "✅ Local setup complete."
echo ""
echo "Start development (two terminals):"
echo "  cd backend && npm run dev    # http://localhost:4000"
echo "  cd frontend && npm install && npm run dev   # http://localhost:3000"
echo ""
echo "Admin: http://localhost:3000/admin/login  (admin / admin123)"
