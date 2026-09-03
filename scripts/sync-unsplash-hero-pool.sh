#!/usr/bin/env bash
# One-shot download from the static ID catalog (no rotation).
# Prefer scripts/update-hero-pool.sh for cron refreshes.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IDS_FILE="$ROOT/scripts/unsplash-vietnam-ids.txt"
OUT="$ROOT/frontend/public/images/hero-pool"
TMP="${TMPDIR:-/tmp}/esimviet-unsplash-dl"
mkdir -p "$TMP" "$OUT"

if [ ! -f "$IDS_FILE" ]; then
  echo "Missing $IDS_FILE"
  exit 1
fi

while read -r id; do
  [ -z "$id" ] && continue
  [[ "$id" =~ ^# ]] && continue
  dest="$TMP/${id}.jpg"
  echo "Downloading $id ..."
  curl -fsSL --retry 3 -o "$dest" \
    "https://images.unsplash.com/${id}?auto=format&fit=crop&w=2560&h=1440&q=80" || {
      echo "  failed $id"; rm -f "$dest"; continue;
    }
done < "$IDS_FILE"

export HERO_POOL_STABLE_SLOTS=1
export HERO_POOL_FORCE_CLEAN=1
export HERO_POOL_SIZE="${HERO_POOL_SIZE:-40}"
node "$ROOT/scripts/build-unsplash-hero-pool.cjs"
