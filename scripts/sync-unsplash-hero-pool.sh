#!/usr/bin/env bash
# Rebuild hero-pool from Unsplash CDN IDs listed in scripts/unsplash-vietnam-ids.txt
# Source search: https://unsplash.com/s/photos/vietnam
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
  if [ ! -s "$dest" ]; then
    echo "Downloading $id ..."
    curl -fsSL -o "$dest" \
      "https://images.unsplash.com/${id}?auto=format&fit=crop&w=2560&h=1440&q=80" || {
        echo "  failed $id"; rm -f "$dest"; continue;
      }
  fi
done < "$IDS_FILE"

echo "Run: node scripts/build-unsplash-hero-pool.cjs"
