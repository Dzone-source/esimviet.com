#!/usr/bin/env bash
# Fix 403 Forbidden caused by cloudflare-allow.conf + realip on port 443
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "Run as root: sudo bash $0"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "Updating nginx config (fix 403)..."
cp "$REPO_ROOT/docs/nginx-cloudflare-geo.conf" /etc/nginx/snippets/cloudflare-geo.conf
cp "$REPO_ROOT/docs/nginx-esimviet.conf" /etc/nginx/sites-available/esimviet.com

# Remove wrong allow include from 443 block if old config remains
sed -i '/listen 443 ssl http2/,/server_name esimviet.com/!b;//,/^}/s|include /etc/nginx/snippets/cloudflare-allow.conf;|# removed: breaks with realip|' \
  /etc/nginx/sites-available/esimviet.com 2>/dev/null || true

nginx -t
systemctl reload nginx

echo "Done. Site should load via https://esimviet.com again."
