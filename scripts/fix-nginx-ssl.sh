#!/usr/bin/env bash
# One-shot fix: snakeoil cert missing → use /etc/nginx/ssl/default-reject.*
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "Run as root: sudo bash $0"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "=== Step 1: Create reject SSL certificate ==="
bash "$SCRIPT_DIR/setup-nginx-reject-cert.sh"

echo ""
echo "=== Step 2: Replace snakeoil paths in all nginx configs ==="
FIXED=0
while IFS= read -r -d '' file; do
  if grep -q 'ssl-cert-snakeoil' "$file" 2>/dev/null; then
    sed -i \
      's|/etc/ssl/certs/ssl-cert-snakeoil.pem|/etc/nginx/ssl/default-reject.crt|g; s|/etc/ssl/private/ssl-cert-snakeoil.pem|/etc/nginx/ssl/default-reject.key|g' \
      "$file"
    echo "  Patched: $file"
    FIXED=$((FIXED + 1))
  fi
done < <(find /etc/nginx -type f \( -name '*.conf' -o -name '*esimviet*' \) -print0 2>/dev/null)

if [ "$FIXED" -eq 0 ]; then
  echo "  No snakeoil references found (may already be fixed)."
fi

echo ""
echo "=== Step 3: Update site config from repo (if available) ==="
if [ -f "$REPO_ROOT/docs/nginx-esimviet.conf" ]; then
  cp "$REPO_ROOT/docs/nginx-esimviet.conf" /etc/nginx/sites-available/esimviet.com
  ln -sf /etc/nginx/sites-available/esimviet.com /etc/nginx/sites-enabled/esimviet.com 2>/dev/null || true
  rm -f /etc/nginx/sites-enabled/default
  echo "  Copied docs/nginx-esimviet.conf → /etc/nginx/sites-available/esimviet.com"
fi

if [ -f "$REPO_ROOT/docs/nginx-cloudflare-allow.conf" ]; then
  mkdir -p /etc/nginx/snippets
  cp "$REPO_ROOT/docs/nginx-cloudflare-allow.conf" /etc/nginx/snippets/cloudflare-allow.conf
  cp "$REPO_ROOT/docs/nginx-cloudflare-realip.conf" /etc/nginx/snippets/cloudflare-realip.conf
  echo "  Updated Cloudflare nginx snippets"
fi

echo ""
echo "=== Step 4: Test nginx ==="
nginx -t

echo ""
echo "=== Step 5: Reload nginx ==="
systemctl reload nginx

echo ""
echo "Done. nginx is OK."
echo "Next: sudo bash scripts/fix-certbot-renewal.sh"
