#!/usr/bin/env bash
# Create the local MariaDB database and user for development.
# Requires MariaDB installed and running on localhost:3306.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
INIT_SQL="$ROOT_DIR/database/init.sql"

if ! command -v mariadb >/dev/null 2>&1 && ! command -v mysql >/dev/null 2>&1; then
  echo "❌ MariaDB client not found."
  echo "   Install MariaDB 10.11+ and start the server, then run this script again."
  echo "   Ubuntu/Debian: sudo apt install mariadb-server && sudo service mariadb start"
  exit 1
fi

DB_CLIENT="$(command -v mariadb || command -v mysql)"

if ! "$DB_CLIENT" -e "SELECT 1" >/dev/null 2>&1; then
  echo "❌ Cannot connect to MariaDB on localhost."
  echo "   Start the server first, e.g.: sudo service mariadb start"
  exit 1
fi

echo "==> Applying $INIT_SQL"
"$DB_CLIENT" < "$INIT_SQL"

echo ""
echo "✅ Database ready: esim_db (user: esim_user / password: change_this_password)"
echo ""
echo "Next steps:"
echo "  cd backend"
echo "  cp .env.example .env   # if you have not already"
echo "  npx prisma db push"
echo "  npm run seed"
