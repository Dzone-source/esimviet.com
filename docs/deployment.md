# eSIM Global – Deployment Guide

## Requirements

- Ubuntu 22.04 LTS
- Node.js 20+
- MariaDB 10.11+
- Nginx
- PM2

---

## 1. Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## 2. Install MariaDB

```bash
sudo apt install -y mariadb-server
sudo mysql_secure_installation
```

### Create database and user:

```sql
CREATE DATABASE esim_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'esim_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON esim_db.* TO 'esim_user'@'localhost';
FLUSH PRIVILEGES;
```

## 3. Install PM2

```bash
sudo npm install -g pm2
```

## 4. Clone Repository

```bash
cd /var/www
git clone <repo-url> esim
cd esim
```

## 5. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials, JWT secret, PayPal keys, email settings
nano .env

# Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate deploy

# Seed initial data
npm run seed

# Build
npm run build
```

## 6. Setup Frontend

```bash
cd ../frontend
npm install
cp .env.local.example .env.local
# Edit .env.local
nano .env.local

# Build for production
npm run build
```

## 7. Configure PM2

Create `/var/www/esim/ecosystem.config.js`:

```js
module.exports = {
  apps: [
    {
      name: 'esim-backend',
      script: './backend/dist/index.js',
      cwd: '/var/www/esim',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
    },
    {
      name: 'esim-frontend',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/var/www/esim/frontend',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
```

Start with PM2:
```bash
cd /var/www/esim
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 8. Configure Nginx

Create `/etc/nginx/sites-available/esim`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Strict-Transport-Security "max-age=31536000" always;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }

    # Static uploads
    location /uploads {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        expires 7d;
        add_header Cache-Control "public, no-transform";
    }

    # Next.js static files
    location /_next/static {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable and test:
```bash
sudo ln -s /etc/nginx/sites-available/esim /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 9. SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## 10. Firewall

```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

---

## Environment Variables

### Backend (.env)

```
PORT=4000
NODE_ENV=production
DATABASE_URL="mysql://esim_user:password@localhost:3306/esim_db"
JWT_SECRET=<strong-random-secret>
JWT_EXPIRES_IN=7d
PAYPAL_CLIENT_ID=<your-paypal-client-id>
PAYPAL_CLIENT_SECRET=<your-paypal-secret>
PAYPAL_MODE=live
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=eSIM Global
FRONTEND_URL=https://yourdomain.com
UPLOAD_DIR=./uploads
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=https://yourdomain.com
NEXT_PUBLIC_PAYPAL_CLIENT_ID=<your-paypal-client-id>
NEXT_PUBLIC_SITE_NAME=eSIM Global
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

## Updating the App

```bash
cd /var/www/esim
git pull

# Backend
cd backend && npm install && npm run build
npx prisma migrate deploy

# Frontend
cd ../frontend && npm install && npm run build

# Restart
pm2 restart all
```
