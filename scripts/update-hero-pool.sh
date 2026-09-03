#!/usr/bin/env bash
# Refresh Unsplash Vietnam hero wallpapers every 12h.
# Overwrites stable slots hero-01.webp … hero-NN.webp and rebuilds manifest.json.
# Safe for cron: no Next.js rebuild required (API reads public manifest at runtime).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IDS_CATALOG="$ROOT/scripts/unsplash-vietnam-ids.txt"
ACTIVE_IDS="$ROOT/scripts/.unsplash-active-ids.txt"
OUT="$ROOT/frontend/public/images/hero-pool"
TMP="${TMPDIR:-/tmp}/esimviet-unsplash-dl"
LOG_DIR="${HERO_POOL_LOG_DIR:-/var/log/esimviet}"
POOL_SIZE="${HERO_POOL_SIZE:-40}"
INTERVAL_SEC=$((12 * 60 * 60))

mkdir -p "$TMP" "$OUT"
mkdir -p "$LOG_DIR" 2>/dev/null || LOG_DIR="${TMPDIR:-/tmp}"
LOG_FILE="$LOG_DIR/hero-pool-update.log"

log() {
  echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*" | tee -a "$LOG_FILE"
}

need_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    log "ERROR: missing command: $1"
    exit 1
  }
}

need_cmd curl
need_cmd node

if [ ! -f "$IDS_CATALOG" ]; then
  log "ERROR: missing catalog $IDS_CATALOG"
  exit 1
fi

# Load optional Unsplash key from frontend env files (non-fatal if missing)
load_env_key() {
  local f
  for f in "$ROOT/frontend/.env.local" "$ROOT/frontend/.env.production" "$ROOT/.env"; do
    if [ -f "$f" ]; then
      # shellcheck disable=SC1090
      set -a
      # Only export UNSPLASH_* lines
      while IFS= read -r line || [ -n "$line" ]; do
        case "$line" in
          UNSPLASH_ACCESS_KEY=*|UNSPLASH_APPLICATION_ID=*) export "$line" ;;
        esac
      done < "$f"
      set +a
    fi
  done
}
load_env_key

select_ids_from_api() {
  local key="${UNSPLASH_ACCESS_KEY:-}"
  if [ -z "$key" ]; then
    return 1
  fi

  local page=$(( ( $(date +%s) / INTERVAL_SEC ) % 10 + 1 ))
  local url="https://api.unsplash.com/search/photos?query=vietnam&orientation=landscape&per_page=${POOL_SIZE}&page=${page}&order_by=relevant"
  log "Fetching Unsplash API page=${page} per_page=${POOL_SIZE}"

  local json
  if ! json="$(curl -fsSL -H "Authorization: Client-ID ${key}" -H "Accept-Version: v1" "$url")"; then
    log "WARN: Unsplash API request failed; falling back to catalog rotation"
    return 1
  fi

  # Extract photo-* CDN ids from urls.raw / urls.full
  printf '%s' "$json" | node -e '
    const fs = require("fs");
    const data = JSON.parse(fs.readFileSync(0, "utf8"));
    const results = data.results || [];
    const ids = [];
    for (const r of results) {
      const raw = (r.urls && (r.urls.raw || r.urls.full || r.urls.regular)) || "";
      const m = String(raw).match(/images\.unsplash\.com\/(photo-[a-zA-Z0-9_-]+)/);
      if (m) ids.push(m[1]);
      else if (r.id) {
        // Fallback: Unsplash API id is not the CDN photo-… slug; skip if no CDN path
      }
    }
    if (!ids.length) process.exit(2);
    process.stdout.write(ids.join("\n") + "\n");
  ' > "$ACTIVE_IDS" || return 1

  local n
  n="$(grep -c '^photo-' "$ACTIVE_IDS" || true)"
  if [ "${n:-0}" -lt 10 ]; then
    log "WARN: API returned too few usable IDs ($n); falling back to catalog"
    return 1
  fi
  log "Selected $n IDs from Unsplash API"
  return 0
}

select_ids_from_catalog() {
  local catalog_tmp
  catalog_tmp="$(mktemp)"
  grep -E '^photo-' "$IDS_CATALOG" | awk '!seen[$0]++' > "$catalog_tmp"
  local total
  total="$(wc -l < "$catalog_tmp" | tr -d ' ')"
  if [ "$total" -lt 1 ]; then
    rm -f "$catalog_tmp"
    log "ERROR: empty catalog"
    exit 1
  fi

  local epoch=$(( $(date +%s) / INTERVAL_SEC ))
  local start=$(( (epoch * POOL_SIZE) % total ))
  log "Catalog rotation: total=$total pool=$POOL_SIZE epoch=$epoch start=$start"

  # Avoid SIGPIPE under `set -o pipefail` (tail|head wrap)
  : > "$ACTIVE_IDS"
  local i idx
  mapfile -t _CATALOG_IDS < "$catalog_tmp"
  for ((i = 0; i < POOL_SIZE; i++)); do
    idx=$(( (start + i) % total ))
    printf '%s\n' "${_CATALOG_IDS[$idx]}" >> "$ACTIVE_IDS"
  done

  rm -f "$catalog_tmp"
  local n
  n="$(wc -l < "$ACTIVE_IDS" | tr -d ' ')"
  log "Selected $n IDs from catalog"
}

if ! select_ids_from_api; then
  select_ids_from_catalog
fi

# Force re-download (overwrite tmp JPGs) then rebuild WebP slots
log "Downloading $(wc -l < "$ACTIVE_IDS" | tr -d ' ') JPEGs…"
while read -r id; do
  [ -z "$id" ] && continue
  [[ "$id" =~ ^# ]] && continue
  dest="$TMP/${id}.jpg"
  rm -f "$dest"
  if ! curl -fsSL --retry 3 --retry-delay 2 -o "$dest" \
    "https://images.unsplash.com/${id}?auto=format&fit=crop&w=2560&h=1440&q=80"; then
    log "WARN: download failed $id"
    rm -f "$dest"
    continue
  fi
  # Reject tiny/error bodies
  if [ ! -s "$dest" ] || [ "$(wc -c < "$dest" | tr -d ' ')" -lt 20000 ]; then
    log "WARN: bad download $id"
    rm -f "$dest"
  fi
done < "$ACTIVE_IDS"

export HERO_POOL_IDS_FILE="$ACTIVE_IDS"
export HERO_POOL_SIZE="$POOL_SIZE"
export HERO_POOL_STABLE_SLOTS=1
export HERO_POOL_FORCE_CLEAN=1
export HERO_POOL_SKIP_SRC_COPY=1

log "Building WebP pool (overwrite slots)…"
node "$ROOT/scripts/build-unsplash-hero-pool.cjs"

log "Hero pool update complete"
