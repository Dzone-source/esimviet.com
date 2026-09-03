#!/usr/bin/env bash
# Install / refresh system cron: update Unsplash hero pool every 12 hours.
# Usage (on VPS): sudo bash scripts/install-hero-pool-cron.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
UPDATE="$ROOT/scripts/update-hero-pool.sh"
CRON_MARKER="esimviet-hero-pool-update"
LOG_DIR="/var/log/esimviet"

chmod +x "$UPDATE" "$ROOT/scripts/sync-unsplash-hero-pool.sh" "$ROOT/scripts/install-hero-pool-cron.sh"

mkdir -p "$LOG_DIR"
touch "$LOG_DIR/hero-pool-update.log"
# Prefer www-data ownership when available (nginx/node user)
if id www-data >/dev/null 2>&1; then
  chown www-data:www-data "$LOG_DIR/hero-pool-update.log" 2>/dev/null || true
fi

CRON_LINE="0 */12 * * * cd $ROOT && /bin/bash $UPDATE >> $LOG_DIR/hero-pool-update.log 2>&1 # $CRON_MARKER"

# Install into root crontab (needs network + write to frontend/public)
TMP="$(mktemp)"
crontab -l 2>/dev/null | grep -v "$CRON_MARKER" > "$TMP" || true
echo "$CRON_LINE" >> "$TMP"
crontab "$TMP"
rm -f "$TMP"

echo "Installed cron:"
echo "  $CRON_LINE"
echo
echo "Run once now:"
echo "  bash $UPDATE"
echo
echo "Optional: set UNSPLASH_ACCESS_KEY in frontend/.env.local for live Unsplash search."
echo "Without a key, the job rotates through scripts/unsplash-vietnam-ids.txt."
