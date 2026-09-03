#!/usr/bin/env bash
# Restrict ports 80/443 to Cloudflare IP ranges only (blocks direct IP access).
# Run on VPS as root: sudo bash scripts/setup-cloudflare-firewall.sh
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "Run as root: sudo bash $0"
  exit 1
fi

echo "Fetching Cloudflare IP ranges..."
V4=$(curl -fsSL https://www.cloudflare.com/ips-v4)
V6=$(curl -fsSL https://www.cloudflare.com/ips-v6)

if ! command -v ufw >/dev/null 2>&1; then
  echo "Installing ufw..."
  apt-get update -qq
  apt-get install -y ufw
fi

echo "Resetting HTTP/HTTPS UFW rules..."
# Remove generic Nginx rules if present
ufw delete allow 'Nginx Full' 2>/dev/null || true
ufw delete allow 'Nginx HTTP' 2>/dev/null || true
ufw delete allow 'Nginx HTTPS' 2>/dev/null || true
ufw delete allow 80/tcp 2>/dev/null || true
ufw delete allow 443/tcp 2>/dev/null || true

echo "Allowing SSH..."
ufw allow OpenSSH

echo "Allowing Cloudflare IPv4 on 80/443..."
while IFS= read -r cidr; do
  [ -z "$cidr" ] && continue
  ufw allow from "$cidr" to any port 80 proto tcp comment 'Cloudflare HTTP' >/dev/null
  ufw allow from "$cidr" to any port 443 proto tcp comment 'Cloudflare HTTPS' >/dev/null
done <<< "$V4"

echo "Allowing Cloudflare IPv6 on 80/443..."
while IFS= read -r cidr; do
  [ -z "$cidr" ] && continue
  ufw allow from "$cidr" to any port 80 proto tcp comment 'Cloudflare HTTP v6' >/dev/null
  ufw allow from "$cidr" to any port 443 proto tcp comment 'Cloudflare HTTPS v6' >/dev/null
done <<< "$V6"

echo "Enabling UFW (if not already)..."
ufw --force enable

echo ""
echo "Done. Only Cloudflare can reach ports 80/443."
echo "Direct IP access is blocked at the firewall."
echo ""
ufw status numbered | head -40
