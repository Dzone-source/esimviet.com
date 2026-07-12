# Deploy eSIM Viet on Ubuntu 24.04 VPS — esimviet.com

Complete guide to deploy this project on a fresh **Ubuntu 24.04** VPS with domain **https://esimviet.com**.

**Stack:** Node.js 20 · MariaDB · Nginx · PM2 · Let's Encrypt SSL  
**No Docker required.**

---

## Architecture

```
Internet (HTTPS)
      │
      ▼
  Nginx :443  (esimviet.com)
      ├── /           → Next.js  :3000  (frontend)
      ├── /api        → Express  :4000  (backend)
      ├── /uploads    → Express  :4000
      └── /health     → Express  :4000
                           │
                           ▼
                      MariaDB :3306
```

---

## Prerequisites

| Item | Requirement |
|------|-------------|
| VPS | Ubuntu **24.04** LTS, 2 GB RAM minimum (4 GB recommended) |
| Domain | `esimviet.com` DNS A record → your VPS public IP |
| Access | SSH as root or sudo user |
| Accounts | PayPal Developer (live keys), SMTP email |

---

## Step 1 — Point DNS to your VPS

In your domain registrar (Cloudflare, Namecheap, etc.):

| Type | Name | Value |
|------|------|-------|
| A | `@` | `YOUR_VPS_IP` |
| A | `www` | `YOUR_VPS_IP` |

Wait 5–30 minutes, then verify:

```bash
dig +short esimviet.com
dig +short www.esimviet.com
```

Both should return your VPS IP.

---

## Step 2 — Connect and update the server

```bash
ssh root@YOUR_VPS_IP

apt update && apt upgrade -y
apt install -y git curl ufw
timedatectl set-timezone Asia/Ho_Chi_Minh   # optional
```

---

## Step 3 — Install Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

node -v    # v20.x
npm -v     # 10.x
```

---

## Step 4 — Install MariaDB

```bash
apt install -y mariadb-server
systemctl enable mariadb
systemctl start mariadb
```

Create database and user:

```bash
mariadb
```

```sql
CREATE DATABASE esim_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'esim_user'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON esim_db.* TO 'esim_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Replace `STRONG_PASSWORD_HERE` with a real password and save it.

---

## Step 5 — Clone the project

```bash
mkdir -p /var/www
cd /var/www

git clone https://github.com/Dzone-source/esimviet.com.git esimviet.com
cd esimviet.com

# Use the branch with the latest code (adjust if merged to main)
git checkout cursor/remove-docker-aapanel-local-dev-feff
```

---

## Step 6 — Backend setup

```bash
cd /var/www/esimviet.com/backend
npm ci
cp .env.example .env
nano .env
```

**Production `backend/.env` example:**

```env
PORT=4000
NODE_ENV=production

DATABASE_URL="mysql://esim_user:STRONG_PASSWORD_HERE@localhost:3306/esim_db"

JWT_SECRET=generate_a_long_random_string_at_least_32_chars
JWT_EXPIRES_IN=7d

PAYPAL_CLIENT_ID=your_paypal_live_client_id
PAYPAL_CLIENT_SECRET=your_paypal_live_secret
PAYPAL_MODE=live

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_gmail_app_password
EMAIL_FROM=noreply@esimviet.com
EMAIL_FROM_NAME=eSIM Viet

FRONTEND_URL=https://esimviet.com

UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

Generate JWT secret:

```bash
openssl rand -base64 48
```

Build database and app:

```bash
npx prisma generate
npx prisma db push
npm run seed
npm run build

mkdir -p uploads/qrcodes uploads/covers logs
```

Test backend locally:

```bash
node dist/index.js &
curl http://127.0.0.1:4000/health
kill %1
```

Expected: `{"status":"ok",...}`

---

## Step 7 — Frontend setup

```bash
cd /var/www/esimviet.com/frontend
npm ci
cp .env.local.example .env.local
nano .env.local
```

**Production `frontend/.env.local`:**

```env
NEXT_PUBLIC_API_URL=https://esimviet.com
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_live_client_id
NEXT_PUBLIC_SITE_NAME=eSIM Viet
NEXT_PUBLIC_SITE_URL=https://esimviet.com
NEXT_PUBLIC_FB_MESSENGER=your_facebook_page_id
```

Build:

```bash
npm run build
```

---

## Step 8 — Install PM2 and start apps

```bash
npm install -g pm2
mkdir -p /var/log/pm2

cd /var/www/esimviet.com
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Run the command `pm2 startup` prints (copy/paste it), then:

```bash
pm2 status
```

Both `esim-backend` and `esim-frontend` should be **online**.

Check:

```bash
curl http://127.0.0.1:4000/health
curl -I http://127.0.0.1:3000
```

---

## Step 9 — Install and configure Nginx (Cloudflare-only)

See full guide: [docs/cloudflare-only-access.md](cloudflare-only-access.md)

```bash
apt install -y nginx
```

Copy Cloudflare snippets and site config:

```bash
cp /var/www/esimviet.com/docs/nginx-cloudflare-allow.conf /etc/nginx/snippets/cloudflare-allow.conf
cp /var/www/esimviet.com/docs/nginx-cloudflare-realip.conf /etc/nginx/snippets/cloudflare-realip.conf
cp /var/www/esimviet.com/docs/nginx-esimviet.conf /etc/nginx/sites-available/esimviet.com
ln -sf /etc/nginx/sites-available/esimviet.com /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl reload nginx
```

At this stage the site works on **HTTP** only (via Cloudflare proxy).

---

## Step 10 — SSL

**Recommended with Cloudflare:** use a **Cloudflare Origin Certificate** (SSL/TLS → Origin Server in Cloudflare dashboard). Update certificate paths in nginx if not using Let's Encrypt.

Alternative — Let's Encrypt with DNS challenge (HTTP-01 will fail after Cloudflare-only firewall):

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d esimviet.com -d www.esimviet.com
```

---

## Step 11 — Firewall (Cloudflare IPs only)

Replace open `Nginx Full` with Cloudflare-only rules:

```bash
bash /var/www/esimviet.com/scripts/setup-cloudflare-firewall.sh
```

This blocks **all direct IP access** on ports 80/443. Only Cloudflare edge servers can connect.

Verify:

```bash
ufw status
```

Do **not** expose ports 3000, 4000, or 3306 publicly — Nginx handles public traffic.

---

## Step 12 — Verify deployment

```bash
# Backend health via domain
curl https://esimviet.com/health

# Admin login API
curl -X POST https://esimviet.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Browser checks:

| URL | Expected |
|-----|----------|
| https://esimviet.com | Homepage loads |
| https://esimviet.com/countries/vietnam | Vietnam plans |
| https://esimviet.com/admin/login | Admin login |
| https://esimviet.com/health | `{"status":"ok"}` |

**First login:** `admin` / `admin123` — change password immediately in admin panel.

Configure PayPal + SMTP in **Admin → Settings**.

---

## Updating the app (after code changes)

```bash
cd /var/www/esimviet.com
git pull

cd backend
npm ci
npm run build
npx prisma db push

cd ../frontend
npm ci
npm run build

cd ..
pm2 restart all
```

---

## Useful PM2 commands

```bash
pm2 status
pm2 logs
pm2 logs esim-backend
pm2 logs esim-frontend
pm2 restart all
pm2 monit
```

---

## Troubleshooting

### 502 Bad Gateway

```bash
pm2 status                    # apps running?
curl http://127.0.0.1:4000/health
curl -I http://127.0.0.1:3000
nginx -t
tail -f /var/log/nginx/error.log
```

### Database connection failed

```bash
systemctl status mariadb
mariadb -u esim_user -p esim_db -e "SELECT 1"
# Check DATABASE_URL in backend/.env
pm2 restart esim-backend
```

### Admin login fails

```bash
cd /var/www/esimviet.com/backend
npm run reset-admin
# Default: admin / admin123
```

### PayPal checkout errors

- Confirm `PAYPAL_MODE=live` and live credentials in backend `.env`
- Confirm `NEXT_PUBLIC_PAYPAL_CLIENT_ID` matches live client ID
- Rebuild frontend after changing `NEXT_PUBLIC_*` vars

### Email not sending

- Gmail: use an **App Password**, not your normal password
- If password has spaces, wrap in quotes in `.env`: `SMTP_PASS="abcd efgh ijkl"`

### Out of memory during frontend build

Add swap:

```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

---

## Security checklist

- [ ] Changed default admin password
- [ ] Strong `JWT_SECRET` and DB password
- [ ] `PAYPAL_MODE=live` only when ready
- [ ] UFW enabled (22, 80, 443 only)
- [ ] SSL certificate active
- [ ] MariaDB not exposed to internet
- [ ] Regular `apt upgrade` and `certbot renew`

---

## File locations summary

| Path | Purpose |
|------|---------|
| `/var/www/esimviet.com` | Project root |
| `/var/www/esimviet.com/backend/.env` | Backend secrets |
| `/var/www/esimviet.com/frontend/.env.local` | Frontend public env |
| `/etc/nginx/sites-available/esimviet.com` | Nginx config |
| `/var/log/pm2/` | PM2 logs |
| `/var/www/esimviet.com/backend/uploads/` | QR code uploads |
