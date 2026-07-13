#!/usr/bin/env bash
# Verify Cloudflare API token can access a zone (before certbot DNS challenge).
#
# Usage:
#   CLOUDFLARE_API_TOKEN=xxx bash scripts/verify-cloudflare-zone.sh 5gtrip.com
#   CLOUDFLARE_API_TOKEN=xxx bash scripts/verify-cloudflare-zone.sh esimviet.com
set -euo pipefail

DOMAIN="${1:-}"
TOKEN="${CLOUDFLARE_API_TOKEN:-}"

if [ -z "$DOMAIN" ]; then
  echo "Usage: CLOUDFLARE_API_TOKEN=xxx bash $0 <domain>"
  echo "Example: CLOUDFLARE_API_TOKEN=xxx bash $0 5gtrip.com"
  exit 1
fi

if [ -z "$TOKEN" ]; then
  echo "ERROR: Set CLOUDFLARE_API_TOKEN environment variable."
  exit 1
fi

# Trim accidental whitespace / quotes from copy-paste
TOKEN="$(printf '%s' "$TOKEN" | tr -d '\r\n' | sed -e 's/^[[:space:]"'\'']*//' -e 's/[[:space:]"'\'']*$//')"

echo "Checking Cloudflare access for zone: ${DOMAIN}"
echo ""

# 1) Token valid?
VERIFY=$(curl -sS -w "\n%{http_code}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  "https://api.cloudflare.com/client/v4/user/tokens/verify")

HTTP_CODE=$(echo "$VERIFY" | tail -n1)
BODY=$(echo "$VERIFY" | sed '$d')

if [ "$HTTP_CODE" != "200" ]; then
  echo "FAIL: Token verification HTTP ${HTTP_CODE}"
  echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
  echo ""
  echo "Fix: create a new API token at https://dash.cloudflare.com/profile/api-tokens"
  echo "  Template: Edit zone DNS"
  echo "  Zone Resources: Include → Specific zone → ${DOMAIN}"
  exit 1
fi

SUCCESS=$(echo "$BODY" | python3 -c "import sys,json; print(json.load(sys.stdin).get('success', False))" 2>/dev/null || echo "false")
if [ "$SUCCESS" != "True" ]; then
  echo "FAIL: Token is not valid."
  echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
  exit 1
fi

echo "OK: API token is valid."

# 2) Zone exists in this Cloudflare account?
ZONE_RESP=$(curl -sS -w "\n%{http_code}" \
  -G \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  --data-urlencode "name=${DOMAIN}" \
  "https://api.cloudflare.com/client/v4/zones")

ZONE_HTTP=$(echo "$ZONE_RESP" | tail -n1)
ZONE_BODY=$(echo "$ZONE_RESP" | sed '$d')

if [ "$ZONE_HTTP" != "200" ]; then
  echo "FAIL: Zone lookup HTTP ${ZONE_HTTP}"
  echo "$ZONE_BODY" | python3 -m json.tool 2>/dev/null || echo "$ZONE_BODY"
  exit 1
fi

ZONE_COUNT=$(echo "$ZONE_BODY" | python3 -c "import sys,json; print(len(json.load(sys.stdin).get('result', [])))" 2>/dev/null || echo "0")

if [ "$ZONE_COUNT" = "0" ]; then
  echo ""
  echo "FAIL: Zone '${DOMAIN}' not found in this Cloudflare account."
  echo ""
  echo "Common causes:"
  echo "  1. Domain not added to Cloudflare yet (Dashboard → Add site → ${DOMAIN})"
  echo "  2. Domain is in a different Cloudflare account than this token"
  echo "  3. API token scoped to another zone only (e.g. esimviet.com but not ${DOMAIN})"
  echo ""
  echo "Fix:"
  echo "  A) Add ${DOMAIN} to Cloudflare and complete nameserver setup, OR"
  echo "  B) Create token with Zone Resources → Include → Specific zone → ${DOMAIN}"
  echo "     Permissions: Zone DNS Edit + Zone Read"
  echo ""
  echo "List zones visible to this token:"
  curl -sS \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    "https://api.cloudflare.com/client/v4/zones?per_page=50" \
    | python3 -c "
import sys, json
data = json.load(sys.stdin)
for z in data.get('result', []):
    print(f\"  - {z.get('name')} (status: {z.get('status')})\")
" 2>/dev/null || true
  exit 1
fi

ZONE_ID=$(echo "$ZONE_BODY" | python3 -c "import sys,json; print(json.load(sys.stdin)['result'][0]['id'])" 2>/dev/null)
ZONE_STATUS=$(echo "$ZONE_BODY" | python3 -c "import sys,json; print(json.load(sys.stdin)['result'][0].get('status','unknown'))" 2>/dev/null)

echo "OK: Zone found — id=${ZONE_ID}, status=${ZONE_STATUS}"
echo ""
echo "Ready for certbot DNS challenge:"
echo "  DOMAIN=${DOMAIN} CLOUDFLARE_API_TOKEN=xxx sudo -E bash scripts/setup-certbot-dns-cloudflare.sh"
