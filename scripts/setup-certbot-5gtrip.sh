#!/usr/bin/env bash
# Issue / renew Let's Encrypt cert for 5gtrip.com (Cloudflare DNS challenge)
#
# Usage (on VPS as root):
#   CLOUDFLARE_API_TOKEN=your_token CERTBOT_EMAIL=you@example.com \
#     bash scripts/setup-certbot-5gtrip.sh
#
# Cloudflare token must include Zone DNS edit for 5gtrip.com.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

DOMAIN=5gtrip.com WWW_DOMAIN=www.5gtrip.com \
  bash "$SCRIPT_DIR/setup-certbot-dns-cloudflare.sh"
