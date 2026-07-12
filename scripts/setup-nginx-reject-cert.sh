#!/usr/bin/env bash
# Self-signed cert for nginx default_server (reject direct IP HTTPS).
# Required because Ubuntu may not ship ssl-cert-snakeoil.pem.
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "Run as root: sudo bash $0"
  exit 1
fi

SSL_DIR="/etc/nginx/ssl"
CRT="$SSL_DIR/default-reject.crt"
KEY="$SSL_DIR/default-reject.key"

mkdir -p "$SSL_DIR"
chmod 755 "$SSL_DIR"

if [ -f "$CRT" ] && [ -f "$KEY" ]; then
  echo "Reject cert already exists: $CRT"
  exit 0
fi

openssl req -x509 -nodes -newkey rsa:2048 -days 3650 \
  -keyout "$KEY" \
  -out "$CRT" \
  -subj "/CN=invalid.local/O=Reject Direct IP/C=XX"

chmod 644 "$CRT"
chmod 600 "$KEY"

echo "Created default reject certificate:"
echo "  $CRT"
echo "  $KEY"
