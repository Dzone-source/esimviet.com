# eSIM Global – Production eSIM Selling Platform

A production-ready eSIM selling website built with Next.js 15, Express, and MariaDB.
Runs natively on your local machine with Node.js, npm and MariaDB — no Docker required.

## Features

- **Customer-facing storefront** with hero, country search, plan cards, checkout
- **PayPal payment** with server-side verification
- **Admin panel** for managing orders, countries, plans, and eSIM codes
- **Manual eSIM delivery** – admin uploads QR code, customer receives email
- **Email notifications** via Nodemailer (order confirmation + eSIM delivery)
- **SEO optimized** – sitemap, robots.txt, JSON-LD, OpenGraph
- **Responsive mobile-first** design with Framer Motion animations

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React, TailwindCSS, TypeScript, Framer Motion |
| Backend | Node.js, Express, Prisma ORM |
| Database | MariaDB |
| Auth | JWT + bcrypt |
| Payment | PayPal REST API |
| Email | Nodemailer |
| Deployment | Ubuntu, Nginx, PM2 |

## Project Structure

```
/
├── frontend/          # Next.js 15 app
│   └── src/
│       ├── app/       # App router pages
│       ├── components/# React components
│       ├── lib/       # API client
│       ├── types/     # TypeScript types
│       └── context/   # Auth context
├── backend/           # Express API
│   ├── src/
│   │   ├── routes/    # API routes
│   │   ├── services/  # Email, PayPal
│   │   ├── middleware/# Auth, upload
│   │   └── utils/     # Logger, Prisma
│   └── prisma/        # Schema & seed
├── database/          # init.sql (create DB + user)
├── docs/              # Deployment docs (PM2 + Nginx)
└── ecosystem.config.js# PM2 config (production)
```

## Requirements

Install these natively on your machine (no containers):

- **Node.js 20+** (LTS recommended) and **npm 10+**
- **MariaDB 10.11+** (or a compatible MySQL 8+)

Verify:

```bash
node -v      # v20.x or newer
npm -v       # 10.x or newer
mariadb --version
```

## 1. Clone & install

```bash
git clone <repo-url> esim
cd esim
```

## 2. Database setup

**MariaDB must be installed and running** before Prisma can connect. If you see
`P1001: Can't reach database server at localhost:3306`, the server is not started.

Install and start (Ubuntu/Debian example):

```bash
sudo apt install mariadb-server
sudo service mariadb start
mariadb -e "SELECT VERSION();"   # should print a version, not an error
```

Create the database and user:

```bash
chmod +x scripts/setup-local-db.sh
./scripts/setup-local-db.sh
```

Or apply the SQL directly:

```bash
sudo mariadb < database/init.sql
```

Or run the SQL manually:

```sql
CREATE DATABASE esim_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'esim_user'@'localhost' IDENTIFIED BY 'change_this_password';
GRANT ALL PRIVILEGES ON esim_db.* TO 'esim_user'@'localhost';
FLUSH PRIVILEGES;
```

## 3. Environment configuration

The project loads two env files. Copy the examples and fill in real values:

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.local.example frontend/.env.local
```

Update `backend/.env` → `DATABASE_URL` to match the DB/user/password you created,
e.g. `mysql://esim_user:change_this_password@localhost:3306/esim_db`.

> A consolidated reference of every variable lives in the root `.env.example`.

## 4. Backend setup & run

```bash
cd backend
npm install
npx prisma generate
npx prisma db push      # create tables from the Prisma schema
npm run seed            # seed admin user + demo data
npm run dev             # starts on http://localhost:4000
```

## 5. Frontend setup & run

In a second terminal:

```bash
cd frontend
npm install
npm run dev             # starts on http://localhost:3000
```

## 6. Access

- Frontend: http://localhost:3000
- Admin panel: http://localhost:3000/admin/login
  - Username: `admin`
  - Password: `admin123`  *(change it after first login)*
- Backend API: http://localhost:4000

In development the frontend proxies `/api/*` to `NEXT_PUBLIC_API_URL`
(default `http://localhost:4000`), so no CORS setup is needed.

## Order Workflow

```
Customer buys eSIM plan
→ PayPal checkout (server-side capture)
→ Order status: WaitingUpload
→ Admin Dashboard → Orders → Upload eSIM
→ Upload QR image + activation code
→ Customer receives email with QR code
→ Order status: Completed
```

## Production build

Build both apps for production:

```bash
# Backend – compile TypeScript to dist/
cd backend
npm run build           # outputs dist/
npm start               # runs node dist/index.js

# Frontend – build the Next.js app
cd ../frontend
npm run build           # outputs .next/
npm start               # runs next start on port 3000
```

For a full server deployment with **PM2 + Nginx** (Ubuntu), see
[docs/deployment.md](docs/deployment.md). A sample PM2 config is provided in
`ecosystem.config.js` and a sample Nginx site in `docs/nginx.conf`.

## Available npm scripts

### Backend (`backend/`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start API in watch mode (ts-node-dev) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled server (`dist/index.js`) |
| `npm run seed` | Seed admin user + demo data |
| `npm run reset-admin` | Reset the admin password |
| `npm run prisma:push` | Push Prisma schema to the database |
| `npm run prisma:studio` | Open Prisma Studio |

### Frontend (`frontend/`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | API port (default `4000`) |
| `DATABASE_URL` | MariaDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `PAYPAL_CLIENT_ID` | PayPal REST API client ID |
| `PAYPAL_CLIENT_SECRET` | PayPal REST API secret |
| `PAYPAL_MODE` | `sandbox` or `live` |
| `SMTP_HOST` | SMTP server host |
| `SMTP_USER` | SMTP username/email |
| `SMTP_PASS` | SMTP password |
| `FRONTEND_URL` | Frontend URL for CORS |
| `UPLOAD_DIR` | Directory for uploaded files |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | PayPal client ID |
| `NEXT_PUBLIC_SITE_URL` | Public site URL for SEO |
| `NEXT_PUBLIC_SITE_NAME` | Site name |
| `NEXT_PUBLIC_FB_MESSENGER` | Facebook page ID (optional) |
