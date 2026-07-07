# eSIM Global – Production eSIM Selling Platform

A production-ready eSIM selling website built with Next.js 15, Express, and MariaDB.

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
├── docs/              # Deployment docs
└── ecosystem.config.js# PM2 config
```

## Quick Start

### Prerequisites

- Node.js 20+
- MariaDB 10.11+

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npx prisma generate
npx prisma db push
npm run seed
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local
npm run dev
```

### 3. Access

- Frontend: http://localhost:3000
- Admin panel: http://localhost:3000/admin/login
  - Username: `admin`
  - Password: `admin123`
- Backend API: http://localhost:4000

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

## Deployment

See [docs/deployment.md](docs/deployment.md) for full deployment instructions.

## Environment Variables

### Backend

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | MariaDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `PAYPAL_CLIENT_ID` | PayPal REST API client ID |
| `PAYPAL_CLIENT_SECRET` | PayPal REST API secret |
| `PAYPAL_MODE` | `sandbox` or `live` |
| `SMTP_HOST` | SMTP server host |
| `SMTP_USER` | SMTP username/email |
| `SMTP_PASS` | SMTP password |
| `FRONTEND_URL` | Frontend URL for CORS |

### Frontend

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | PayPal client ID |
| `NEXT_PUBLIC_SITE_URL` | Public site URL for SEO |
