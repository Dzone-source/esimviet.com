# Cài đặt lại từ đầu – eSIM Viet trên aaPanel Docker

Hướng dẫn cài sạch project **esimviet.com** bằng Docker Compose trên aaPanel.

---

## Kiến trúc

```
Internet → aaPanel Nginx (HTTPS) → Docker Nginx :8080
                                        ├── /       → frontend (Next.js)
                                        ├── /api    → backend (Express)
                                        └── /uploads → backend
                                              ↓
                                         mariadb (Docker)
```

---

## PHẦN 1 – Xóa cài đặt cũ

### 1.1 Dừng và xóa container cũ

```bash
cd /www/wwwroot/esimviet 2>/dev/null && docker compose down -v
docker rm -f esim-frontend esim-backend esim-mariadb esim-nginx 2>/dev/null
docker volume rm esimviet_mariadb_data esimviet_backend_uploads esimviet_backend_logs 2>/dev/null
```

> `-v` xóa luôn database cũ. Bỏ `-v` nếu muốn giữ data.

### 1.2 Xóa thư mục cũ

```bash
rm -rf /www/wwwroot/esimviet
rm -rf /www/server/panel/data/compose/esimviet
```

### 1.3 Xóa project trong aaPanel Docker (nếu có)

**aaPanel → Docker → Compose → esimviet → Delete**

---

## PHẦN 2 – Cài Docker trên aaPanel

1. **aaPanel → App Store**
2. Cài **Docker** (và **Docker Compose** nếu có)
3. Terminal kiểm tra:

```bash
docker --version
docker compose version
```

---

## PHẦN 3 – Tải source code

```bash
cd /www/wwwroot

git clone -b cursor/esim-website-1575 \
  https://github.com/Dzone-source/esimviet.com.git esimviet

cd esimviet
ls -la docker-compose.yml frontend/src/lib/api.ts
```

Phải thấy cả 2 file.

---

## PHẦN 4 – Cấu hình `.env`

```bash
cd /www/wwwroot/esimviet
cp .env.docker.example .env
nano .env
```

### Các biến BẮT BUỘC sửa:

```env
# Database
MYSQL_ROOT_PASSWORD=MatKhauRootManh123!
MYSQL_DATABASE=esimviet
MYSQL_USER=esimviet
MYSQL_PASSWORD=MatKhauDBManh123!

DB_HOST=mariadb
DB_PORT=3306
SEED_DATABASE=true

# JWT – tạo chuỗi ngẫu nhiên dài
JWT_SECRET=chuoi_bi_mat_ngau_nhien_dai_32_ky_tu

# Domain – PHẢI có https://
FRONTEND_URL=https://esimviet.com
NEXT_PUBLIC_API_URL=https://esimviet.com
NEXT_PUBLIC_SITE_URL=https://esimviet.com
NEXT_PUBLIC_SITE_NAME=eSIM Viet
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id

# PayPal
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox

# Email – password Gmail phải có ngoặc kép
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS="your gmail app password"
EMAIL_FROM=noreply@esimviet.com
EMAIL_FROM_NAME=eSIM VietNam

# Port Docker Nginx (aaPanel proxy vào đây)
NGINX_HTTP_PORT=8080
```

Lưu file: `Ctrl+O` → Enter → `Ctrl+X`

---

## PHẦN 5 – Build & chạy Docker

### Cách A – Terminal (khuyến nghị)

```bash
cd /www/wwwroot/esimviet

docker compose up -d --build
```

Lần đầu mất **5–15 phút**. Theo dõi log:

```bash
docker compose logs -f
```

Đợi thấy:
- `✅ Database is ready`
- `🌱 Seeding database...`
- `✅ Seed completed`
- `🚀 Server running on port 4000`

Nhấn `Ctrl+C` thoát log.

Kiểm tra:

```bash
docker compose ps
```

Tất cả phải **Up (healthy)**.

Test nội bộ:

```bash
curl http://127.0.0.1:8080/health
curl -X POST http://127.0.0.1:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Phải thấy `"success":true`.

### Cách B – aaPanel Docker GUI

1. **Docker → Compose → Add**
2. **Project name:** `esimviet`
3. **Compose file path:** `/www/wwwroot/esimviet/docker-compose.yml`
4. **Env file:** `/www/wwwroot/esimviet/.env`
5. **Deploy / Build**

---

## PHẦN 6 – Kết nối domain aaPanel

### 6.1 Tạo website

1. **Website → Add site**
2. Domain: `esimviet.com` (+ `www.esimviet.com` nếu cần)
3. Root: `/www/wwwroot/esimviet` (tùy chọn, không quan trọng vì dùng proxy)
4. PHP: **Pure static** / không cần PHP

### 6.2 Reverse Proxy

**Website → esimviet.com → Reverse Proxy → Add**

| Mục | Giá trị |
|-----|---------|
| Proxy name | `esim-docker` |
| Target URL | `http://127.0.0.1:8080` |
| Send domain | ✅ Bật |
| Cache | ❌ Tắt |

Hoặc sửa **Config file** Nginx:

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
    proxy_set_header Authorization $http_authorization;
    proxy_cache_bypass $http_upgrade;
    client_max_body_size 10M;
}
```

Reload Nginx.

### 6.3 SSL Let's Encrypt

**Website → SSL → Let's Encrypt → Apply → Force HTTPS**

Test qua domain:

```bash
curl -X POST https://esimviet.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Phải `"success":true`.

---

## PHẦN 7 – Đăng nhập Admin

1. Mở **Incognito:** `https://esimviet.com/admin/login`
2. Login:
   - **Username:** `admin`
   - **Password:** `admin123`
3. **Đổi mật khẩu ngay** sau khi vào
4. Cấu hình PayPal + SMTP: **Admin → Settings**

Reset admin nếu cần:

```bash
cd /www/wwwroot/esimviet
docker compose exec backend npm run reset-admin
# hoặc đặt pass mới:
docker compose exec backend npm run reset-admin -- MatKhauMoi123
```

---

## PHẦN 8 – Firewall aaPanel

**Security → Firewall** – mở:

| Port | Mục đích |
|------|----------|
| 80 | HTTP |
| 443 | HTTPS |

**Không** cần mở 3000, 4000, 3306, 8080 ra internet.

---

## Checklist hoàn tất

- [ ] `docker compose ps` – 4 container Up (healthy)
- [ ] `curl http://127.0.0.1:8080/health` → OK
- [ ] `curl https://esimviet.com/api/auth/login` → success:true
- [ ] Browser Network: `https://esimviet.com/api/auth/login` (KHÔNG localhost:4000)
- [ ] Admin login OK
- [ ] SSL bật
- [ ] Đổi password admin

---

## Lệnh quản lý hàng ngày

```bash
cd /www/wwwroot/esimviet

docker compose ps              # trạng thái
docker compose logs -f backend   # xem log API
docker compose restart           # restart tất cả
docker compose down              # dừng
docker compose up -d --build     # cập nhật code + rebuild
```

---

## Xử lý lỗi thường gặp

### Login gọi `localhost:4000`

**Xóa cache trình duyệt KHÔNG giúp** — server đang phục vụ file JS cũ.

Kiểm tra nhanh trên VPS:

```bash
curl -sL https://esimviet.com/admin/login | grep -o 'admin/login/page-[^"]*\.js' | head -1
# Lấy tên chunk ở trên, rồi:
curl -sL "https://esimviet.com/_next/static/chunks/app/admin/login/page-XXXX.js" | grep localhost:4000
```

Nếu thấy `localhost:4000` → bắt buộc rebuild frontend (không phải lỗi cache):

```bash
cd /www/wwwroot/esimviet

# Xóa build cũ trên host (aaPanel đôi khi serve thẳng thư mục này)
rm -rf .next frontend/.next

# Cập nhật api.ts mới nhất
git pull origin cursor/esim-website-1575

# Rebuild + kiểm tra tự động
chmod +x docker/rebuild-frontend.sh
./docker/rebuild-frontend.sh
```

Sau rebuild, chunk login phải có `baseURL:"/api"` — **không** có `localhost:4000`.

Mở **Incognito** → F12 → Network → đăng nhập → request phải là:
`https://esimviet.com/api/auth/login`

### Vào Dashboard rồi bị đá về Login

→ Thường do API `/api/admin/stats` trả 401 (header `Authorization` bị mất qua proxy).

1. Thêm vào aaPanel Nginx proxy config:
   `proxy_set_header Authorization $http_authorization;`
2. Rebuild frontend + restart nginx:
   ```bash
   cd /www/wwwroot/esimviet
   git pull origin cursor/esim-website-1575
   docker compose build --no-cache frontend
   docker compose up -d frontend
   docker compose restart nginx
   nginx -t && nginx -s reload
   ```
3. F12 → Network → kiểm tra request `/api/admin/stats` có header `Authorization: Bearer ...`

### `git pull` không hoạt động

→ Phải clone bằng git từ đầu (PHẦN 3), không upload ZIP thiếu file.

### 502 Bad Gateway

```bash
docker compose ps
docker compose logs nginx backend
curl http://127.0.0.1:8080/health
```

### Email không gửi

→ `SMTP_PASS="password co dau cach"` phải có ngoặc kép trong `.env`

---

## Dùng MariaDB của aaPanel (tùy chọn)

Nếu không muốn MariaDB trong Docker:

1. Tạo DB trong **aaPanel → Database**
2. Sửa `.env`: `DB_HOST=host.docker.internal`
3. Chạy:

```bash
docker compose -f docker-compose.aapanel-db.yml up -d --build
```

Xem thêm: `docs/docker-aapanel.md`
