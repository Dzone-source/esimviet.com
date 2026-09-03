#!/usr/bin/env bash
# Bootstrap local MariaDB for development (Ubuntu/Debian friendly).
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
INIT_SQL="$ROOT_DIR/database/init.sql"

if ! command -v mariadb >/dev/null 2>&1 && ! command -v mysql >/dev/null 2>&1; then
  echo "❌ MariaDB client not found."
  echo "   Install: sudo apt install mariadb-server && sudo service mariadb start"
  exit 1
fi

DB_CLIENT="$(command -v mariadb || command -v mysql)"

run_db() {
  if "$DB_CLIENT" "$@" 2>/dev/null; then
    return 0
  fi
  if sudo "$DB_CLIENT" "$@" 2>/dev/null; then
    return 0
  fi
  return 1
}

apply_sql() {
  if "$DB_CLIENT" < "$INIT_SQL" 2>/dev/null; then
    return 0
  fi
  sudo "$DB_CLIENT" < "$INIT_SQL"
}

echo "==> Ensuring MariaDB is running..."
if command -v service >/dev/null 2>&1; then
  sudo service mariadb start >/dev/null 2>&1 || true
fi

echo "==> Waiting for MariaDB on localhost:3306..."
TRIES=0
MAX_TRIES=15
until run_db -e "SELECT 1" >/dev/null; do
  TRIES=$((TRIES + 1))
  if [ "$TRIES" -ge "$MAX_TRIES" ]; then
    echo "❌ MariaDB is not reachable after ${MAX_TRIES} attempts."
    echo "   Try: sudo service mariadb start"
    exit 1
  fi
  sleep 1
done

echo "==> Applying $INIT_SQL"
apply_sql

if ! mariadb -u esim_user -pchange_this_password -e "USE esim_db; SELECT 1" >/dev/null 2>&1; then
  echo "❌ Created database but esim_user login failed."
  echo "   Check database/init.sql credentials match backend/.env DATABASE_URL."
  exit 1
fi

echo ""
echo "✅ Database ready: esim_db"
echo "   User: esim_user"
echo "   Password: change_this_password"
echo ""
echo "Next:"
echo "  cd backend"
echo "  cp .env.example .env"
echo "  npx prisma db push"
echo "  npm run seed"
