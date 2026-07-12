# Cloudflare-only access for esimviet.com

Block all direct access to the VPS IP. Only traffic proxied through Cloudflare (orange cloud) can reach the site.

## Cloudflare dashboard (required)

1. Add domain **esimviet.com** to Cloudflare.
2. Point DNS **A** record `@` → your VPS IP (proxied / orange cloud ON).
3. Point DNS **A** or **CNAME** `www` → same (proxied ON).
4. **SSL/TLS** → set mode to **Full (strict)**.
5. Install SSL on origin using one of:
   - **Cloudflare Origin Certificate** (recommended) — SSL/TLS → Origin Server → Create Certificate, install on nginx, or
   - **Let's Encrypt DNS challenge** — HTTP-01 renewal will fail once the firewall blocks non-Cloudflare IPs.

## VPS setup

```bash
cd /var/www/esimviet.com
git pull

# Copy nginx snippets + site config
cp docs/nginx-cloudflare-allow.conf /etc/nginx/snippets/cloudflare-allow.conf
cp docs/nginx-cloudflare-realip.conf /etc/nginx/snippets/cloudflare-realip.conf
cp docs/nginx-esimviet.conf /etc/nginx/sites-available/esimviet.com
ln -sf /etc/nginx/sites-available/esimviet.com /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

nginx -t && systemctl reload nginx

# Firewall: only Cloudflare IPs on 80/443
bash scripts/setup-cloudflare-firewall.sh
```

## What this does

| Layer | Behavior |
|-------|----------|
| **UFW firewall** | Ports 80/443 accept connections only from Cloudflare IP ranges |
| **Nginx default server** | Direct IP requests → connection closed (`444`) |
| **Nginx allow list** | Non-Cloudflare IPs denied even if they reach nginx |
| **Host header** | Requests with IP as Host → blocked |

## Update Cloudflare IP list (periodic)

Cloudflare occasionally adds IP ranges:

```bash
bash scripts/update-cloudflare-ips.sh
cp docs/nginx-cloudflare-*.conf /etc/nginx/snippets/
nginx -t && systemctl reload nginx
bash scripts/setup-cloudflare-firewall.sh
```

## Verify

```bash
# Should work (via Cloudflare)
curl -I https://esimviet.com

# Should fail / timeout (direct IP — from external machine)
curl -I http://YOUR_VPS_IP
curl -I -k https://YOUR_VPS_IP
```

## SSL with Cloudflare Origin Certificate

If using Origin Certificate instead of Let's Encrypt, update paths in `nginx-esimviet.conf`:

```nginx
ssl_certificate /etc/ssl/cloudflare/esimviet.com.pem;
ssl_certificate_key /etc/ssl/cloudflare/esimviet.com.key;
```

Store the key with `chmod 600`.

## Important notes

- Keep **Cloudflare proxy enabled** (orange cloud) on DNS records.
- Do not expose ports **3000**, **4000**, or **3306** publicly.
- Admin and app health checks from the VPS itself: use `curl http://127.0.0.1:4000/health` (localhost, not public IP).
