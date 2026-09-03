#!/usr/bin/env bash
# Let's Encrypt via Cloudflare DNS challenge (works with Cloudflare-only firewall)
#
# Usage (on VPS as root):
#   CLOUDFLARE_API_TOKEN=your_token CERTBOT_EMAIL=you@example.com \
#     bash scripts/setup-certbot-dns-cloudflare.sh
#
# Optional env:
#   DOMAIN=esimviet.com
#   WWW_DOMAIN=www.esimviet.com
#   CERTBOT_EMAIL=support@esimviet.com
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "Run as root: sudo bash $0"
  exit 1
fi

DOMAIN="${DOMAIN:-esimviet.com}"
WWW_DOMAIN="${WWW_DOMAIN:-www.esimviet.com}"
CERTBOT_EMAIL="${CERTBOT_EMAIL:-support@esimviet.com}"
CREDENTIALS_FILE="/etc/letsencrypt/cloudflare.ini"
PROPAGATION_SECONDS="${DNS_PROPAGATION_SECONDS:-30}"

if [ -z "${CLOUDFLARE_API_TOKEN:-}" ]; then
  echo "ERROR: Set CLOUDFLARE_API_TOKEN environment variable."
  echo ""
  echo "Create token at: https://dash.cloudflare.com/profile/api-tokens"
  echo "  Template: Edit zone DNS"
  echo "  Zone: Include → ${DOMAIN}"
  echo ""
  echo "Example:"
  echo "  CLOUDFLARE_API_TOKEN=xxx CERTBOT_EMAIL=you@mail.com bash scripts/setup-certbot-dns-cloudflare.sh"
  exit 1
fi

# Trim accidental whitespace / quotes from copy-paste
CLOUDFLARE_API_TOKEN="$(printf '%s' "$CLOUDFLARE_API_TOKEN" | tr -d '\r\n' | sed -e 's/^[[:space:]"'\'']*//' -e 's/[[:space:]"'\'']*$//')"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=== Pre-check: Cloudflare zone access ==="
if ! CLOUDFLARE_API_TOKEN="$CLOUDFLARE_API_TOKEN" bash "$SCRIPT_DIR/verify-cloudflare-zone.sh" "$DOMAIN"; then
  echo ""
  echo "Aborting certbot — fix Cloudflare setup first, then re-run this script."
  exit 1
fi
echo ""

echo "Installing certbot + Cloudflare DNS plugin..."
apt-get update -qq
apt-get install -y certbot python3-certbot-dns-cloudflare openssl

bash "$SCRIPT_DIR/setup-nginx-reject-cert.sh"

mkdir -p /etc/letsencrypt/renewal-hooks/deploy

cat > "$CREDENTIALS_FILE" <<EOF
dns_cloudflare_api_token = ${CLOUDFLARE_API_TOKEN}
EOF
chmod 600 "$CREDENTIALS_FILE"

cat > /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh <<'HOOK'
#!/bin/bash
systemctl reload nginx
HOOK
chmod +x /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh

echo "Requesting certificate for ${DOMAIN} and ${WWW_DOMAIN}..."
certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials "$CREDENTIALS_FILE" \
  --dns-cloudflare-propagation-seconds "$PROPAGATION_SECONDS" \
  -d "$DOMAIN" \
  -d "$WWW_DOMAIN" \
  --cert-name "$DOMAIN" \
  --email "$CERTBOT_EMAIL" \
  --agree-tos \
  --non-interactive \
  --preferred-challenges dns

echo ""
echo "Certificate installed:"
echo "  /etc/letsencrypt/live/${DOMAIN}/fullchain.pem"
echo "  /etc/letsencrypt/live/${DOMAIN}/privkey.pem"
echo ""

if [ -f /etc/nginx/sites-available/esimviet.com ]; then
  echo "Testing nginx config..."
  nginx -t
  systemctl reload nginx
  echo "Nginx reloaded."
fi

echo ""
echo "Testing auto-renewal (dry run)..."
certbot renew --dry-run

echo ""
echo "Done. Certbot will auto-renew via systemd timer."
echo "Check: systemctl status certbot.timer"
echo "Logs:  journalctl -u certbot.service"
