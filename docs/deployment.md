# eSIM Viet – Deployment Guide

> **Full step-by-step tutorial for Ubuntu 24.04 + esimviet.com:**  
> See **[deploy-esimviet-ubuntu24.md](./deploy-esimviet-ubuntu24.md)**

## Quick reference

| Component | Version |
|-----------|---------|
| OS | Ubuntu 24.04 LTS |
| Node.js | 20+ |
| MariaDB | 10.11+ |
| Process manager | PM2 |
| Reverse proxy | Nginx |
| SSL | Let's Encrypt (certbot) |
| Domain | https://esimviet.com |

## Stack overview

```
Nginx (443) → frontend :3000 (Next.js)
            → backend  :4000 (Express)
            → MariaDB  :3306
```

## Install order

1. DNS → VPS IP
2. Node.js 20 + MariaDB + Git
3. Clone to `/var/www/esimviet.com`
4. `backend/.env` + `npm ci` + `prisma db push` + `npm run build`
5. `frontend/.env.local` + `npm ci` + `npm run build`
6. `pm2 start ecosystem.config.js`
7. Nginx (`docs/nginx-esimviet.conf`)
8. `certbot --nginx -d esimviet.com -d www.esimviet.com`
9. UFW (22, 80, 443)

## Production env files

**backend/.env** — set `FRONTEND_URL=https://esimviet.com`, `PAYPAL_MODE=live`, SMTP, JWT, DATABASE_URL

**frontend/.env.local** — set all `NEXT_PUBLIC_*` to `https://esimviet.com`

## Update after git pull

```bash
cd /var/www/esimviet.com
git pull
cd backend && npm ci && npm run build && npx prisma db push
cd ../frontend && npm ci && npm run build
pm2 restart all
```
