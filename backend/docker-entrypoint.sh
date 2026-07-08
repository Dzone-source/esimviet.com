#!/bin/sh
set -e

DB_HOST="${DB_HOST:-mariadb}"
DB_PORT="${DB_PORT:-3306}"
SEED_DATABASE="${SEED_DATABASE:-true}"

echo "⏳ Waiting for database at ${DB_HOST}:${DB_PORT}..."

TRIES=0
MAX_TRIES=30

until node -e "
  const net = require('net');
  const socket = net.createConnection({ host: process.env.DB_HOST || '${DB_HOST}', port: Number(process.env.DB_PORT || ${DB_PORT}) });
  socket.on('connect', () => { socket.end(); process.exit(0); });
  socket.on('error', () => process.exit(1));
" 2>/dev/null; do
  TRIES=$((TRIES + 1))
  if [ "$TRIES" -ge "$MAX_TRIES" ]; then
    echo "❌ Database not reachable after ${MAX_TRIES} attempts"
    exit 1
  fi
  echo "   Database not ready yet (${TRIES}/${MAX_TRIES})..."
  sleep 2
done

echo "✅ Database is ready"

echo "🔄 Running Prisma db push..."
npx prisma db push --skip-generate

if [ "$SEED_DATABASE" = "true" ]; then
  echo "🌱 Seeding database..."
  npx ts-node prisma/seed.ts || echo "⚠️  Seed skipped or already applied"
fi

echo "🚀 Starting backend..."
exec "$@"
