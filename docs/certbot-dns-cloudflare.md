# Certbot DNS Challenge (Cloudflare) — Auto SSL for esimviet.com

Use this when the VPS blocks direct IP access and only allows Cloudflare traffic.  
HTTP-01 (`certbot --nginx`) **will not work** — DNS challenge adds a TXT record via Cloudflare API instead.

## Prerequisites

- Domain **esimviet.com** on Cloudflare (orange cloud / proxied DNS)
- Nginx already configured (`docs/nginx-esimviet.conf`)
- SSL paths in nginx point to Let's Encrypt:

```nginx
ssl_certificate /etc/letsencrypt/live/esimviet.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/esimviet.com/privkey.pem;
```

## Step 1 — Create Cloudflare API Token

1. Open [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. **Create Token** → use template **Edit zone DNS**
3. Zone Resources: **Include** → **Specific zone** → `esimviet.com`
4. Create and copy the token (shown once)

Required permissions:
- `Zone` → `DNS` → **Edit**
- `Zone` → `Zone` → **Read**

## Step 2 — Run setup script on VPS

```bash
cd /var/www/esimviet.com
git pull

CLOUDFLARE_API_TOKEN=your_token_here \
CERTBOT_EMAIL=support@esimviet.com \
sudo -E bash scripts/setup-certbot-dns-cloudflare.sh
```

The script will:
1. Install `certbot` + `python3-certbot-dns-cloudflare`
2. Save credentials to `/etc/letsencrypt/cloudflare.ini` (chmod 600)
3. Issue certificate for `esimviet.com` + `www.esimviet.com`
4. Reload nginx
5. Run `certbot renew --dry-run` to verify auto-renewal

### Add 5gtrip.com (second domain)

**Prerequisite:** `5gtrip.com` must be added to Cloudflare (same account as the API token) and nameservers must point to Cloudflare.

Verify before certbot:

```bash
CLOUDFLARE_API_TOKEN=your_token bash scripts/verify-cloudflare-zone.sh 5gtrip.com
```

Token must include **5gtrip.com** zone (create a separate token if esimviet token is zone-scoped):

```bash
CLOUDFLARE_API_TOKEN=your_token_here \
CERTBOT_EMAIL=support@esimviet.com \
sudo -E bash scripts/setup-certbot-5gtrip.sh
```

Then deploy nginx config from repo (includes both domains):

```bash
sudo cp docs/nginx-esimviet-common.conf /etc/nginx/snippets/esimviet-common.conf
sudo cp docs/nginx-esimviet.conf /etc/nginx/sites-available/esimviet.com
sudo nginx -t && sudo systemctl reload nginx
```

## Step 3 — Verify

```bash
# Certificate files
ls -la /etc/letsencrypt/live/esimviet.com/

# HTTPS via Cloudflare
curl -I https://esimviet.com
curl -I https://5gtrip.com

# Auto-renew timer
systemctl status certbot.timer
systemctl list-timers | grep certbot
```

## Manual commands (if needed)

Issue / re-issue certificate:

```bash
certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /etc/letsencrypt/cloudflare.ini \
  --dns-cloudflare-propagation-seconds 30 \
  -d esimviet.com \
  -d www.esimviet.com \
  --email support@esimviet.com \
  --agree-tos
```

Test renewal:

```bash
certbot renew --dry-run
```

Force renewal:

```bash
certbot renew --force-renewal
systemctl reload nginx
```

## Credentials file format

See `docs/cloudflare.ini.example`. On VPS:

```ini
dns_cloudflare_api_token = YOUR_TOKEN
```

```bash
chmod 600 /etc/letsencrypt/cloudflare.ini
```

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `cannot load certificate ssl-cert-snakeoil.pem` | Run `sudo bash scripts/setup-nginx-reject-cert.sh` and update nginx config from repo |
| `nginx plugin is not working` on renew | Renewal still uses old nginx authenticator — run `sudo bash scripts/fix-certbot-renewal.sh` |
| `Invalid API Token` / `6003 Invalid request headers` | Token wrong or copy-paste error — recreate token; test with `bash scripts/verify-cloudflare-zone.sh <domain>` |
| `Unable to determine zone_id for 5gtrip.com` | Add **5gtrip.com** to Cloudflare first, or create token scoped to zone **5gtrip.com** (not only esimviet.com) |
| `Timeout during propagation` | Increase wait: `DNS_PROPAGATION_SECONDS=60` |
| Nginx SSL error after issue | Run `setup-nginx-reject-cert.sh`, then `nginx -t && systemctl reload nginx` |
| Renewal fails | Check token not revoked; `certbot renew --dry-run -v` |

## Cloudflare SSL mode

After Let's Encrypt is on origin, set Cloudflare **SSL/TLS → Full (strict)**.

## Security

- Never commit API token to git
- Rotate token if leaked
- Use zone-scoped token (not Global API Key)
