#!/usr/bin/env bash
# Fix certbot renewal to use DNS-Cloudflare (not nginx plugin).
# Run after nginx reject cert is in place.
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "Run as root: sudo bash $0"
  exit 1
fi

DOMAIN="${DOMAIN:-esimviet.com}"
WWW_DOMAIN="${WWW_DOMAIN:-www.esimviet.com}"
CREDENTIALS_FILE="/etc/letsencrypt/cloudflare.ini"
RENEWAL_FILE="/etc/letsencrypt/renewal/${DOMAIN}.conf"

if [ ! -f "$CREDENTIALS_FILE" ]; then
  echo "ERROR: Missing $CREDENTIALS_FILE"
  echo "Run setup-certbot-dns-cloudflare.sh first, or create the credentials file."
  exit 1
fi

if ! command -v certbot >/dev/null 2>&1; then
  apt-get update -qq
  apt-get install -y certbot python3-certbot-dns-cloudflare
fi

echo "Ensuring nginx reject cert exists..."
bash "$(dirname "$0")/setup-nginx-reject-cert.sh"

echo "Re-configuring certbot renewal for DNS-Cloudflare..."
certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials "$CREDENTIALS_FILE" \
  --dns-cloudflare-propagation-seconds "${DNS_PROPAGATION_SECONDS:-30}" \
  -d "$DOMAIN" \
  -d "$WWW_DOMAIN" \
  --cert-name "$DOMAIN" \
  --keep-until-expiring \
  --non-interactive

if [ -f "$RENEWAL_FILE" ]; then
  echo ""
  echo "Renewal config:"
  grep -E '^(authenticator|installer|dns_cloudflare)' "$RENEWAL_FILE" || true
fi

echo ""
echo "Testing nginx..."
nginx -t
systemctl reload nginx

echo ""
echo "Testing certbot renew (dry run)..."
certbot renew --dry-run

echo ""
echo "Done. Renewal should use dns-cloudflare, not nginx plugin."
