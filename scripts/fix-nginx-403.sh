#!/usr/bin/env bash
# Fix 403 Forbidden / geo directive errors
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "Run as root: sudo bash $0"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "=== Install Cloudflare geo (http context) ==="
cp "$REPO_ROOT/docs/nginx-cloudflare-geo.conf" /etc/nginx/conf.d/cloudflare-geo.conf
rm -f /etc/nginx/snippets/cloudflare-geo.conf

echo "=== Update site config ==="
cp "$REPO_ROOT/docs/nginx-esimviet.conf" /etc/nginx/sites-available/esimviet.com

if [ -f "$REPO_ROOT/docs/nginx-esimviet-common.conf" ]; then
  cp "$REPO_ROOT/docs/nginx-esimviet-common.conf" /etc/nginx/snippets/esimviet-common.conf
fi

if [ -f "$REPO_ROOT/docs/nginx-cloudflare-allow.conf" ]; then
  cp "$REPO_ROOT/docs/nginx-cloudflare-allow.conf" /etc/nginx/snippets/cloudflare-allow.conf
fi
if [ -f "$REPO_ROOT/docs/nginx-cloudflare-realip.conf" ]; then
  cp "$REPO_ROOT/docs/nginx-cloudflare-realip.conf" /etc/nginx/snippets/cloudflare-realip.conf
fi

echo "=== Test & reload nginx ==="
nginx -t
systemctl reload nginx

echo "Done. Test: curl -I https://esimviet.com"
