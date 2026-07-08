# Hướng dẫn cài đặt eSIM Global bằng Docker trên aaPanel

Hướng dẫn triển khai toàn bộ stack (MariaDB + Backend + Frontend + Nginx) bằng Docker Compose, sau đó kết nối domain qua aaPanel.

---

## Kiến trúc Docker

```
Internet
   │
   ▼
aaPanel Nginx (SSL :443)
   │  reverse proxy
   ▼
Docker Nginx (:8080)
   ├── /          → frontend:3000  (Next.js)
   ├── /api       → backend:4000  (Express)
   └── /uploads   → backend:4000  (QR images)
                        │
                        ▼
                   mariadb:3306
```

| Container | Vai trò | Port nội bộ |
|-----------|---------|---------------|
| `esim-mariadb` | Database MariaDB | 3306 |
| `esim-backend` | API Express + Prisma | 4000 |
| `esim-frontend` | Website Next.js | 3000 |
| `esim-nginx` | Reverse proxy gộp | **8080** (host) |

---

## MariaDB: Docker hay aaPanel?

Có **2 cách** — chọn một, không dùng cả hai cùng lúc:

| | **Cách 1: MariaDB trong Docker** (mặc định) | **Cách 2: MariaDB của aaPanel** |
|---|---|---|
| File compose | `docker-compose.yml` | `docker-compose.aapanel-db.yml` |
| Quản lý DB | Terminal / phpMyAdmin container | **aaPanel → Database** (GUI) |
| Backup | `docker compose exec mariadb mysqldump...` | **aaPanel → Backup** |
| RAM | Tốn thêm ~200–400MB | Tiết kiệm RAM hơn |
| Phù hợp | VPS mới, chưa cài MariaDB aaPanel | **Đã có MariaDB trên aaPanel** ✅ |

### Cách 1 – MariaDB trong Docker (mặc định)

```bash
docker compose up -d --build
```

Không cần cài MariaDB trên aaPanel. Database chạy trong container `esim-mariadb`.

### Cách 2 – Dùng MariaDB sẵn có của aaPanel (khuyến nghị nếu đã cài aaPanel DB)

**Bước A – Tạo database trên aaPanel**

1. **Database → Add database**
2. Tên DB: `esim_db`
3. User: `esim_user` + mật khẩu mạnh
4. Ghi lại user/password

**Bước B – Cho phép Docker kết nối**

Trong aaPanel → Database → **root password** → phpMyAdmin hoặc terminal:

```sql
-- Cho phép user kết nối từ Docker
GRANT ALL PRIVILEGES ON esim_db.* TO 'esim_user'@'%' IDENTIFIED BY 'your_password';
FLUSH PRIVILEGES;
```

> Nếu aaPanel MariaDB chỉ bind `127.0.0.1`, Docker vẫn kết nối được qua `host.docker.internal` (IP máy host).

**Bước C – Sửa `.env`**

```env
DB_HOST=host.docker.internal
DB_PORT=3306
MYSQL_USER=esim_user
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=esim_db
```

**Bước D – Chạy (không có container MariaDB)**

```bash
docker compose -f docker-compose.aapanel-db.yml up -d --build
```

---

## Yêu cầu

- VPS Ubuntu 20.04+ / Debian
- **aaPanel** đã cài
- RAM tối thiểu **2GB** (khuyến nghị 4GB)
- Domain trỏ về IP VPS

---

## Bước 1: Cài Docker trên aaPanel

1. Đăng nhập **aaPanel**
2. Vào **App Store**
3. Tìm và cài **Docker** (hoặc **Docker Manager**)
4. Chờ cài xong, mở terminal SSH hoặc **Terminal** trong aaPanel

Kiểm tra:

```bash
docker --version
docker compose version
```

---

## Bước 2: Upload / clone project

```bash
cd /www/wwwroot
git clone https://github.com/Dzone-source/esimviet.com.git esim
cd esim
git checkout cursor/esim-website-1575
```

Hoặc upload ZIP qua **Files** trong aaPanel rồi giải nén vào `/www/wwwroot/esim`.

---

## Bước 3: Cấu hình biến môi trường

```bash
cd /www/wwwroot/esim
cp .env.docker.example .env
nano .env
```

**Các biến bắt buộc cần sửa:**

```env
# Database
MYSQL_ROOT_PASSWORD=MatKhauRootManh123!
MYSQL_PASSWORD=MatKhauDBManh123!

# JWT
JWT_SECRET=chuoi_bi_mat_dai_ngau_nhien

# Domain thật của bạn
FRONTEND_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# PayPal
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_MODE=sandbox

# Email SMTP
SMTP_HOST=smtp.gmail.com
SMTP_USER=your@gmail.com
SMTP_PASS=app_password_16_ky_tu

# Port Nginx Docker (aaPanel sẽ proxy vào port này)
NGINX_HTTP_PORT=8080
```

> **Quan trọng:** `NEXT_PUBLIC_*` được bake vào frontend lúc **build**. Mỗi khi đổi domain phải **build lại** container frontend.

---

## Bước 4: Build và chạy Docker

```bash
cd /www/wwwroot/esim
chmod +x docker/start.sh
./docker/start.sh
```

Hoặc thủ công:

```bash
docker compose up -d --build
```

Lần đầu build mất **5–15 phút** tùy cấu hình VPS.

Kiểm tra trạng thái:

```bash
docker compose ps
docker compose logs -f
```

Khi tất cả container `healthy`:

```bash
curl http://127.0.0.1:8080/health
# {"status":"ok",...}
```

Mở thử: `http://IP-VPS:8080`

**Admin mặc định sau seed:**
- URL: `/admin/login`
- User: `admin`
- Pass: `admin123` → **đổi ngay sau khi đăng nhập**

---

## Bước 5: Kết nối domain qua aaPanel (Reverse Proxy)

### 5.1 Tạo website

1. **Website → Add site**
2. Domain: `yourdomain.com`
3. Root directory: bất kỳ (không dùng trực tiếp, chỉ cần tạo site)
4. PHP: **Pure static** / không cần PHP

### 5.2 Cấu hình Reverse Proxy

**Website → yourdomain.com → Reverse proxy → Add reverse proxy**

| Mục | Giá trị |
|-----|---------|
| Proxy name | `esim-docker` |
| Target URL | `http://127.0.0.1:8080` |
| Send domain | Bật |
| Cache | Tắt |

Hoặc sửa **Config file** Nginx của site:

```nginx
location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    client_max_body_size 10M;
}
```

> Không cần cấu hình `/api` riêng trên aaPanel — Docker Nginx đã xử lý routing.

### 5.3 Bật SSL

**Website → SSL → Let's Encrypt → Apply**

Sau khi có HTTPS, cập nhật `.env`:

```env
FRONTEND_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

Rebuild frontend:

```bash
docker compose up -d --build frontend
```

---

## Bước 6: Mở firewall

**aaPanel → Security → Firewall**

| Port | Mục đích |
|------|----------|
| 80 | HTTP (aaPanel) |
| 443 | HTTPS (aaPanel) |
| 8080 | Chỉ mở nếu cần truy cập trực tiếp (tùy chọn) |

**Không** cần mở port 3000, 4000, 3306 ra internet.

---

## Quản lý hàng ngày

### Xem logs

```bash
cd /www/wwwroot/esim
docker compose logs -f              # tất cả
docker compose logs -f backend      # API
docker compose logs -f frontend     # website
docker compose logs -f mariadb      # database
```

### Restart

```bash
docker compose restart
docker compose restart backend      # restart 1 service
```

### Dừng / xóa

```bash
docker compose down                   # dừng, giữ data
docker compose down -v              # xóa cả volumes (MẤT DATA!)
```

### Cập nhật code

```bash
cd /www/wwwroot/esim
git pull
docker compose up -d --build
```

### Seed lại database

```bash
docker compose exec backend npx ts-node prisma/seed.ts
```

### Backup database

```bash
docker compose exec mariadb mysqldump -u esim_user -p esim_db > backup_$(date +%F).sql
```

### Restore database

```bash
docker compose exec -T mariadb mysql -u esim_user -p esim_db < backup.sql
```

---

## Cấu trúc file Docker

```
esim/
├── docker-compose.yml          # Orchestration chính
├── .env.docker.example         # Mẫu biến môi trường
├── .env                        # Biến môi trường thật (tạo từ example)
├── docker/
│   ├── nginx/default.conf      # Nginx routing trong Docker
│   └── start.sh                # Script khởi động nhanh
├── backend/
│   ├── Dockerfile
│   └── docker-entrypoint.sh    # Chờ DB + prisma push + seed
└── frontend/
    └── Dockerfile              # Next.js standalone build
```

---

## Xử lý lỗi thường gặp

### Admin login báo "Invalid credentials" / không đăng nhập được

**Nguyên nhân phổ biến nhất:** Database chưa kết nối hoặc chưa tạo user `admin` (seed chưa chạy).

**Bước 1 – Kiểm tra backend + database**

```bash
# Docker (MariaDB trong Docker)
docker compose logs backend | tail -30

# Docker (MariaDB aaPanel)
docker compose -f docker-compose.aapanel-db.yml logs backend | tail -30
```

Phải thấy: `✅ Database is ready` và `🌱 Seeding database...`

**Bước 2 – Reset tài khoản admin**

```bash
# Docker
docker compose exec backend npm run reset-admin

# Hoặc đặt password mới
docker compose exec backend npm run reset-admin -- matkhau_moi

# Không dùng Docker
cd backend && npm run reset-admin
```

**Bước 3 – Đăng nhập**

| Username | Password |
|----------|----------|
| `admin` | `admin123` (mặc định sau seed/reset) |

**Bước 4 – Test API trực tiếp**

```bash
curl -X POST http://127.0.0.1:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

- Trả về `"success":true` → OK, thử lại trình duyệt (xóa cache)
- Trả về `"Can't reach database"` → sửa `DATABASE_URL` / `DB_HOST` trong `.env`
- Trả về `401 Invalid credentials` → chạy lại `reset-admin`

---
### 502 Bad Gateway trên aaPanel

```bash
docker compose ps          # container có running/healthy không?
curl http://127.0.0.1:8080/health
docker compose logs backend
```

Nguyên nhân thường gặp:
- Container chưa start xong (đợi 1–2 phút)
- Port `8080` bị chiếm → đổi `NGINX_HTTP_PORT` trong `.env`

### Database connection failed

```bash
docker compose logs mariadb
docker compose exec backend npx prisma db push
```

### Frontend gọi API sai URL

- Kiểm tra `NEXT_PUBLIC_API_URL` trong `.env`
- Phải rebuild frontend: `docker compose up -d --build frontend`

### Upload QR bị lỗi

- Volume `backend_uploads` phải tồn tại
- `client_max_body_size 10M` đã có trong Docker Nginx

### Build frontend quá chậm / hết RAM

```bash
# Tạo swap 2GB
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

---

## Dùng aaPanel Docker Manager (GUI)

1. **Docker → Compose**
2. **Add** → chọn thư mục `/www/wwwroot/esim`
3. File: `docker-compose.yml`
4. Env file: `.env`
5. **Deploy**

Sau đó vẫn cần cấu hình Reverse Proxy aaPanel → `127.0.0.1:8080` như Bước 5.

---

## Checklist triển khai

- [ ] Docker cài trên aaPanel
- [ ] Clone project + tạo `.env`
- [ ] `docker compose up -d --build` thành công
- [ ] `curl http://127.0.0.1:8080/health` trả về OK
- [ ] aaPanel reverse proxy → port 8080
- [ ] SSL Let's Encrypt bật
- [ ] Cập nhật `NEXT_PUBLIC_*` + rebuild frontend
- [ ] Đăng nhập admin, đổi mật khẩu
- [ ] Cấu hình PayPal + SMTP trong Admin → Settings
- [ ] Test checkout + upload eSIM
