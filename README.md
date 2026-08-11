# photographer-album
Some Like App Pilihin.app
# Photographer Photo Selection System

Aplikasi web untuk fotografer dan klien yang digunakan untuk mengelola album foto, membagikan album melalui public link, memilih foto sesuai kuota, dan memproses status pekerjaan foto.

## 1. Fitur Utama

### Photographer / Admin

* Login photographer.
* Dashboard photographer.
* Membuat album foto.
* Menentukan kuota pilihan foto.
* Membuat public album link.
* Integrasi Google Drive.
* Sinkronisasi foto dari Google Drive.
* Melihat jumlah foto dalam album.
* Melihat foto yang dipilih client.
* Melihat status pekerjaan:

  * `DRAFT`
  * `SUBMITTED`
  * `EDITING`
  * `PRINTING`
  * `DONE`

### Client

* Mengakses album menggunakan public token.
* Melihat gallery foto.
* Lightbox foto.
* Swipe foto pada perangkat mobile.
* Memilih foto sesuai quota.
* Menyimpan pilihan foto.
* Mengirim final selection.
* Setelah submit, pilihan terkunci.
* Melihat progress pekerjaan.

---

# 2. Tech Stack

| Component        | Technology                         |
| ---------------- | ---------------------------------- |
| Frontend         | Next.js                            |
| Language         | TypeScript                         |
| UI               | Tailwind CSS                       |
| Backend          | Next.js App Router / Route Handler |
| Database         | Supabase PostgreSQL                |
| Authentication   | Supabase Auth                      |
| Storage / Source | Google Drive                       |
| Public Album     | Token-based access                 |
| Deployment       | Ubuntu Server                      |
| Process Manager  | PM2                                |
| Reverse Proxy    | Nginx                              |
| SSL              | Let's Encrypt / Certbot            |

---

# 3. System Architecture

```text
                    ┌─────────────────────┐
                    │       CLIENT        │
                    │                     │
                    │ Browser / Mobile    │
                    └──────────┬──────────┘
                               │
                               │ HTTPS
                               ▼
                    ┌─────────────────────┐
                    │       NGINX         │
                    │                     │
                    │ Reverse Proxy       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      NEXT.JS        │
                    │                     │
                    │ App Router          │
                    │ API Routes          │
                    │ Photographer UI     │
                    │ Public Album         │
                    └──────┬──────┬───────┘
                           │      │
             ┌─────────────┘      └─────────────┐
             ▼                                  ▼
    ┌─────────────────┐                ┌─────────────────┐
    │    SUPABASE     │                │   GOOGLE DRIVE  │
    │                 │                │                 │
    │ PostgreSQL      │                │ Album Photos    │
    │ Auth            │                │                 │
    │ RLS             │                │ Google API      │
    └─────────────────┘                └─────────────────┘
```

---

# 4. Requirements Server

Recommended server:

```text
Ubuntu 22.04 LTS / Ubuntu 24.04 LTS atau vercel
```

Minimum:

```text
CPU     : 1-2 Core
RAM     : 2 GB
Storage : 20 GB+
```

Recommended untuk production:

```text
CPU     : 2-4 Core
RAM     : 4 GB+
Storage : 40 GB+
```

Server harus memiliki:

```text
Node.js
npm
Git
Nginx
PM2
Certbot
```

Database tidak perlu di-install di server apabila menggunakan Supabase Cloud.

---

# 5. Install Node.js

Gunakan Node.js LTS.

Cek:

```bash
node -v
npm -v
```

Recommended:

```text
Node.js 20 LTS
atau
Node.js 22 LTS
```

Jika menggunakan NVM:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

Reload shell:

```bash
source ~/.bashrc
```

Install Node.js:

```bash
nvm install 22
nvm use 22
nvm alias default 22
```

Cek:

```bash
node -v
npm -v
```

---

# 6. Install Git

```bash
sudo apt update
sudo apt install git -y
```

Cek:

```bash
git --version
```

---

# 7. Clone Project

Masuk ke directory aplikasi:

```bash
cd /var/www
```

Clone repository:

```bash
sudo git clone https://github.com/hanissiddiq/photographer-album.git photographer-album
```

Masuk:

```bash
cd /var/www/photographer-album
```

Atur ownership:

```bash
sudo chown -R $USER:$USER /var/www/photographer-album
```

---

# 8. Install Dependencies

```bash
npm install
```

Untuk production:

```bash
npm ci
```

Jika menggunakan package lock, gunakan:

```bash
npm ci
```

---

# 9. Supabase Configuration

Project menggunakan:

* Supabase Auth
* PostgreSQL
* Row Level Security
* Supabase Admin Client

Buat project pada Supabase.

Setelah project dibuat, buka:

```text
Supabase Dashboard
→ Project Settings
→ API
```

Ambil:

```text
Project URL
Publishable / Anon Key
Secret / Service Role Key
```

> Jangan pernah memasukkan Secret / Service Role Key ke client-side code.

---

# 10. Jalankan Database Migration

Seluruh migration SQL harus dijalankan pada Supabase.

Buka:

```text
Supabase Dashboard
→ SQL Editor
```

Jalankan migration sesuai urutan fase project.

Contoh:

```text
seluruh migration ada pada file Database-supabase.txt
```

Pastikan migration berhasil sebelum menjalankan aplikasi.

---

# 11. Supabase Auth

Buka:

```text
Supabase Dashboard
→ Authentication
→ URL Configuration
```

Set:

```text
Site URL

https://photographer-album.com
```

Tambahkan Redirect URL:

```text
https://photographer-album.com/**
```

Untuk development:

```text
http://localhost:3000/**
```

Jika menggunakan custom domain, gunakan domain production sebenarnya.

---

# 12. Environment Variables

Buat file:

```text
.env.local
```

Untuk production, file ini harus berada di root project:

```text
/var/www/photographer-album/.env.local
```

Contoh:

```env
# =========================================================
# NEXT.JS
# =========================================================

NEXT_PUBLIC_APP_URL=https://photographer-album.com


# =========================================================
# SUPABASE
# =========================================================

NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxxxxxxxxx

SUPABASE_SERVICE_ROLE_KEY=xxxxxxxxxxxxxxxxxxxxxxxx


# =========================================================
# GOOGLE DRIVE
# =========================================================

GOOGLE_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com

GOOGLE_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

GOOGLE_REDIRECT_URI=https://photos.example.com/api/google/callback


# =========================================================
# GOOGLE DRIVE
# =========================================================

GOOGLE_DRIVE_ROOT_FOLDER_ID=xxxxxxxxxxxxxxxxxxxxxxxx


# =========================================================
# PHOTOGRAPHER
# =========================================================

PHOTOGRAPHER_WHATSAPP_NUMBER=628xxxxxxxxxx


# =========================================================
# SECURITY
# =========================================================

APP_SECRET_KEY=GENERATE_RANDOM_SECRET


# =========================================================
# NODE
# =========================================================

NODE_ENV=production
```

---

# 13. Jangan Commit `.env.local`

Tambahkan ke `.gitignore`:

```gitignore
.env
.env.local
.env.production
.env.development
.env*.local

node_modules/
.next/
```

Cek:

```bash
git status
```

Pastikan `.env.local` tidak muncul sebagai file yang akan di-commit.

---

# 14. Public vs Private Environment Variables

Variabel yang diawali:

```text
NEXT_PUBLIC_
```

dapat digunakan oleh browser.

Contoh:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_APP_URL=...
```

Sedangkan secret harus TANPA:

```text
NEXT_PUBLIC_
```

Contoh:

```env
SUPABASE_SERVICE_ROLE_KEY=...
GOOGLE_CLIENT_SECRET=...
APP_SECRET_KEY=...
```

Jangan pernah membuat:

```env
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=...
```

atau:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=...
```

Ini akan mengekspos secret ke browser.

---

# 15. Generate APP_SECRET_KEY

Gunakan:

```bash
openssl rand -base64 48
```

Contoh hasil:

```text
K3h8xQ...random...secret
```

Masukkan:

```env
APP_SECRET_KEY=K3h8xQ...random...secret
```

Jangan menggunakan contoh secret dari dokumentasi ini.

---

# 16. Google Cloud Project

Google Drive integration menggunakan Google Drive API.

Buka Google Cloud Console dan buat project baru.

Contoh nama:

```text
Photographer Photo Selection
```

Kemudian pilih project tersebut.

---

# 17. Enable Google Drive API

Buka:

```text
Google Cloud Console
→ APIs & Services
→ Library
```

Cari:

```text
Google Drive API
```

Klik:

```text
Enable
```

Pastikan API sudah aktif.

---

# 18. Configure OAuth Consent Screen

Buka:

```text
APIs & Services
→ OAuth consent screen
```

Buat konfigurasi OAuth.

Contoh:

```text
App name:
Photographer Photo Selection

User support email:
email photographer

Developer contact:
email developer
```

Untuk penggunaan internal/terbatas, gunakan konfigurasi yang sesuai dengan kebutuhan Google Cloud project.

---

# 19. OAuth Scopes Google Drive

Aplikasi membutuhkan akses Google Drive untuk membaca album/foto.

Gunakan scope seminimal mungkin.

Contoh:

```text
https://www.googleapis.com/auth/drive.readonly
```

Jika aplikasi memang membutuhkan operasi tulis terhadap Drive, gunakan scope yang sesuai kebutuhan.

Jangan meminta:

```text
https://www.googleapis.com/auth/drive
```

jika aplikasi hanya membutuhkan read-only access.

---

# 20. Create OAuth Client

Buka:

```text
APIs & Services
→ Credentials
→ Create Credentials
→ OAuth client ID
```

Pilih:

```text
Web application
```

Contoh:

```text
Name:
Photographer Web Client
```

Authorized JavaScript origins:

```text
https://photographer-album.com
```

Untuk development:

```text
http://localhost:3000
```

Authorized redirect URIs:

```text
https://photographer-album.com/api/google/callback
```

Development:

```text
http://localhost:3000/api/google/callback
```

---

# 21. Simpan Google OAuth Credentials

Setelah client dibuat, Google memberikan:

```text
Client ID
Client Secret
```

Masukkan ke:

```env
GOOGLE_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com

GOOGLE_CLIENT_SECRET=xxxxxxxxxxxxxxxx
```

Redirect:

```env
GOOGLE_REDIRECT_URI=https://photographer-album.com/api/google/callback
```

Pastikan redirect URI di `.env` **persis sama** dengan yang terdaftar di Google Cloud.

---

# 22. Google Drive Folder

Photographer dapat membuat struktur:

```text
Google Drive
│
├── Wedding Andi Sarah
│   ├── DSC_0001.jpg
│   ├── DSC_0002.jpg
│   ├── DSC_0003.jpg
│   └── ...
│
├── Wedding Budi Citra
│   ├── DSC_1001.jpg
│   ├── DSC_1002.jpg
│   └── ...
│
└── Prewedding
```

Album di aplikasi akan memiliki:

```text
google_drive_folder_id
```

Contoh:

```env
GOOGLE_DRIVE_ROOT_FOLDER_ID=1AbCdEfGhIjKlMn
```

---

# 23. Google Drive Sharing

Untuk sistem OAuth, photographer harus memberikan izin Google Drive melalui akun Google yang digunakan saat OAuth.

Pastikan account Google yang melakukan authorization mempunyai akses terhadap folder foto.

Contoh:

```text
Photographer Google Account
        │
        ▼
Google Drive
        │
        ▼
Wedding Andi Sarah
        │
        ├── DSC_001.jpg
        ├── DSC_002.jpg
        └── DSC_003.jpg
```

Jika account OAuth tidak mempunyai akses folder:

```text
Google Drive API
        ↓
403 Forbidden
```

---

# 24. Google Service Account vs OAuth

Untuk project ini, **OAuth 2.0 lebih direkomendasikan** jika photographer menggunakan Google Drive miliknya sendiri.

Flow:

```text
Photographer
     ↓
Login aplikasi
     ↓
Connect Google Drive
     ↓
Google OAuth
     ↓
Allow access
     ↓
Authorization Code
     ↓
Access Token / Refresh Token
     ↓
Next.js
     ↓
Google Drive API
```

Jangan menyimpan access token di browser.

---

# 25. Refresh Token Google

Untuk production, aplikasi perlu menyimpan refresh token secara aman agar photographer tidak perlu login Google setiap kali melakukan sync.

Sebaiknya dibuat tabel:

```sql
create table public.google_drive_connections (
    id uuid primary key default gen_random_uuid(),

    photographer_id uuid not null
        references public.profiles(id)
        on delete cascade,

    google_email text,

    refresh_token text not null,

    created_at timestamptz not null default now(),

    updated_at timestamptz not null default now(),

    unique(photographer_id)
);
```

> Refresh token adalah credential sensitif. Jangan pernah dikirim ke browser atau dimasukkan ke `NEXT_PUBLIC_*`.

Untuk production, pertimbangkan enkripsi refresh token sebelum disimpan.

---

# 26. Google Drive API Flow

Flow sinkronisasi:

```text
Photographer Dashboard
        │
        │ Sync Drive
        ▼
POST /api/albums/{id}/sync-drive
        │
        ▼
Validate Photographer
        │
        ▼
Get Google OAuth credentials
        │
        ▼
Google Drive API
        │
        ▼
List files
        │
        ▼
Filter image/*
        │
        ▼
album_photos
        │
        ├── file_id
        ├── file_name
        ├── mime_type
        ├── file_size
        └── sort_order
```

---

# 27. Important: Jangan Download Semua Foto ke VPS

Aplikasi ini menggunakan Google Drive sebagai sumber foto.

Jangan melakukan:

```text
Google Drive
     ↓
Download seluruh foto
     ↓
/var/www/uploads
```

karena album wedding dapat berisi:

```text
500 foto
1.000 foto
2.000 foto
```

dan ukuran dapat mencapai puluhan GB.

Lebih baik:

```text
Google Drive
     ↓
API
     ↓
Photo endpoint
     ↓
Client
```

Database hanya menyimpan metadata foto.

Contoh:

```text
album_photos

id
album_id
google_drive_file_id
file_name
mime_type
file_size
sort_order
```

---

# 28. Production `.env.local`

Contoh final:

```env
NODE_ENV=production

NEXT_PUBLIC_APP_URL=https://photographer-album.com


# =========================================================
# SUPABASE
# =========================================================

NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxx

SUPABASE_SERVICE_ROLE_KEY=xxxxxxxx


# =========================================================
# GOOGLE OAUTH
# =========================================================

GOOGLE_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com

GOOGLE_CLIENT_SECRET=xxxxxxxx

GOOGLE_REDIRECT_URI=https://photographer-album.com/api/google/callback


# =========================================================
# GOOGLE DRIVE
# =========================================================

GOOGLE_DRIVE_ROOT_FOLDER_ID=xxxxxxxx


# =========================================================
# APPLICATION SECURITY
# =========================================================

APP_SECRET_KEY=xxxxxxxx


# =========================================================
# WHATSAPP
# =========================================================

PHOTOGRAPHER_WHATSAPP_NUMBER=628xxxxxxxxxx
```

---

# 29. Build Production

Set environment:

```bash
nano .env.local
```

Kemudian:

```bash
npm ci
```

Build:

```bash
npm run build
```

Jika berhasil:

```text
✓ Compiled successfully
✓ Generating static pages
✓ Finalizing page optimization
```

Jalankan test:

```bash
npm start
```

Default:

```text
http://localhost:3000
```

Test dari server:

```bash
curl http://localhost:3000
```

Jika mendapatkan response HTML, Next.js berjalan.

Hentikan:

```text
CTRL + C
```

---

# 30. Install PM2

```bash
sudo npm install -g pm2
```

Cek:

```bash
pm2 -v
```

---

# 31. Jalankan Next.js dengan PM2

```bash
cd /var/www/photographer-album
```

Jalankan:

```bash
pm2 start npm --name photographer-album -- start
```

Cek:

```bash
pm2 status
```

Log:

```bash
pm2 logs photographer-album
```

---

# 32. PM2 Startup

Agar aplikasi otomatis berjalan setelah reboot:

```bash
pm2 startup
```

Jalankan command yang diberikan PM2.

Kemudian:

```bash
pm2 save
```

Test:

```bash
sudo reboot
```

Setelah server hidup:

```bash
pm2 status
```

Pastikan:

```text
photographer-album
online
```

---

# 33. Nginx

Install:

```bash
sudo apt install nginx -y
```

Buat konfigurasi:

```bash
sudo nano /etc/nginx/sites-available/photographer-album
```

Isi:

```nginx
server {
    listen 80;

    server_name photos.example.com;

    client_max_body_size 100M;

    location / {
        proxy_pass http://127.0.0.1:3000;

        proxy_http_version 1.1;

        proxy_set_header Host $host;

        proxy_set_header X-Real-IP $remote_addr;

        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_set_header Upgrade $http_upgrade;

        proxy_set_header Connection "upgrade";
    }
}
```

---

# 34. Enable Nginx Site

```bash
sudo ln -s \
/etc/nginx/sites-available/photographer-album \
/etc/nginx/sites-enabled/photographer-album
```

Test:

```bash
sudo nginx -t
```

Jika:

```text
syntax is ok
test is successful
```

reload:

```bash
sudo systemctl reload nginx
```

---

# 35. DNS Domain

Di DNS provider, buat:

```text
Type: A
Name: photos
Value: SERVER_IP
```

Contoh:

```text
photos.example.com
        ↓
123.123.123.123
```

Tunggu DNS propagation.

Test:

```bash
ping photographer-album.com
```

---

# 36. SSL HTTPS

Install Certbot:

```bash
sudo apt install certbot python3-certbot-nginx -y
```

Generate SSL:

```bash
sudo certbot --nginx \
-d photographer-album.com
```

Pilih redirect HTTP ke HTTPS jika ditawarkan.

Setelah selesai:

```text
https://photographer-album.com
```

---

# 37. Test SSL Renewal

```bash
sudo certbot renew --dry-run
```

Harus berhasil.

---

# 38. Update Project Production

Setiap ada update:

```bash
cd /var/www/photographer-album
```

Pull:

```bash
git pull origin main
```

Install dependency:

```bash
npm ci
```

Build:

```bash
npm run build
```

Restart:

```bash
pm2 restart photographer-album
```

Cek:

```bash
pm2 status
```

---

# 39. Deployment Script

Agar lebih mudah, buat:

```bash
nano deploy.sh
```

Isi:

```bash
#!/bin/bash

set -e

echo "================================="
echo "Deploy Photographer Application"
echo "================================="

cd /var/www/photographer-album

echo "[1/5] Pull latest source..."

git pull origin main

echo "[2/5] Install dependencies..."

npm ci

echo "[3/5] Build application..."

npm run build

echo "[4/5] Restart application..."

pm2 restart photographer-album

echo "[5/5] Application status..."

pm2 status

echo "================================="
echo "Deployment completed"
echo "================================="
```

Buat executable:

```bash
chmod +x deploy.sh
```

Deploy:

```bash
./deploy.sh
```

---

# 40. Directory Production

Struktur server:

```text
/var/www/photographer-album
│
├── src/
├── public/
├── package.json
├── package-lock.json
├── next.config.ts
├── tsconfig.json
├── .env.local
├── .gitignore
└── deploy.sh
```

Jangan menyimpan:

```text
Google Client Secret
Supabase Service Role Key
Google Refresh Token
```

di source code.

---

# 41. Security Checklist

Sebelum production, pastikan:

```text
[ ] HTTPS aktif
[ ] .env.local tidak masuk Git
[ ] SUPABASE_SERVICE_ROLE_KEY tidak public
[ ] GOOGLE_CLIENT_SECRET tidak public
[ ] Google refresh token tidak public
[ ] RLS Supabase aktif
[ ] Public album menggunakan token
[ ] Public API memvalidasi token
[ ] Photo endpoint memvalidasi album
[ ] Client tidak dapat mengambil album lain
[ ] Client tidak dapat memilih foto album lain
[ ] Quota divalidasi server
[ ] Submitted selection terkunci
[ ] Nginx aktif
[ ] PM2 aktif
[ ] PM2 startup aktif
[ ] SSL aktif
[ ] Certbot renewal berhasil
```

---

# 42. Troubleshooting

## `Module not found`

Hapus cache build:

```bash
rm -rf .next
npm run build
```

---

## `npm run build` gagal

Cek:

```bash
npm run build
```

Lihat error TypeScript:

```bash
npx tsc --noEmit
```

---

## Supabase `42501`

Contoh:

```text
new row violates row-level security policy
```

Periksa:

```text
RLS
Supabase policy
Supabase Auth user
```

Untuk server-side operation yang memang harus melewati RLS, pastikan penggunaan:

```text
SUPABASE_SERVICE_ROLE_KEY
```

hanya pada server.

---

## Google Drive `401`

Periksa:

```text
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

dan token OAuth.

---

## Google Drive `403`

Kemungkinan:

```text
OAuth account tidak mempunyai akses folder
```

atau scope/API belum benar.

Periksa:

```text
Google Drive API
OAuth scopes
Google Drive folder permissions
```

---

## Google OAuth `redirect_uri_mismatch`

Pastikan:

```env
GOOGLE_REDIRECT_URI=https://photos.example.com/api/google/callback
```

sama persis dengan Authorized Redirect URI di Google Cloud.

Jangan berbeda:

```text
http vs https
www vs non-www
/
```

Contoh ini berbeda:

```text
https://photographer-album/api/google/callback
```

dan:

```text
https://photographer-album/api/google/callback
```

---

## PM2 application `errored`

Cek:

```bash
pm2 logs photographer-album
```

Kemudian:

```bash
pm2 describe photographer-album
```

Pastikan environment variable tersedia.

---

## Nginx `502 Bad Gateway`

Cek apakah Next.js hidup:

```bash
curl http://127.0.0.1:3000
```

Jika gagal:

```bash
pm2 status
pm2 logs photographer-album
```

Restart:

```bash
pm2 restart photographer-album
```

---

## Nginx configuration error

```bash
sudo nginx -t
```

Jika berhasil:

```bash
sudo systemctl reload nginx
```

---

# 43. Production Architecture

Deployment final:

```text
                         INTERNET
                            │
                            ▼
                  ┌──────────────────┐
                  │     DOMAIN       │
                  │ photos.example   │
                  └────────┬─────────┘
                           │
                           │ HTTPS :443
                           ▼
                  ┌──────────────────┐
                  │      NGINX       │
                  │                  │
                  │ Reverse Proxy    │
                  └────────┬─────────┘
                           │
                           │ localhost:3000
                           ▼
                  ┌──────────────────┐
                  │     PM2          │
                  │                  │
                  │ photographer-album │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │     NEXT.JS      │
                  │                  │
                  │ Server           │
                  │ API              │
                  │ Public Album     │
                  └───────┬───┬──────┘
                          │   │
             ┌────────────┘   └─────────────┐
             ▼                              ▼
      ┌──────────────┐              ┌──────────────┐
      │   SUPABASE   │              │ GOOGLE DRIVE │
      │              │              │              │
      │ PostgreSQL   │              │ Photos       │
      │ Auth         │              │              │
      │ RLS          │              │ Drive API    │
      └──────────────┘              └──────────────┘
```

---

# 44. Production Request Flow

## Photographer Login

```text
Photographer
     ↓
https://photos.example.com/login
     ↓
Supabase Auth
     ↓
Authenticated Session
     ↓
Photographer Dashboard
```

## Create Album

```text
Photographer
     ↓
Create Album
     ↓
Next.js API
     ↓
Supabase
     ↓
albums
```

## Sync Google Drive

```text
Photographer
     ↓
Sync Drive
     ↓
Next.js API
     ↓
Google OAuth Credential
     ↓
Google Drive API
     ↓
album_photos
```

## Client Access

```text
https://photos.example.com/a/TOKEN
                 ↓
          Validate Token
                 ↓
             Album
                 ↓
          album_photos
                 ↓
              Gallery
```

## Client Selection

```text
Client
  ↓
Select Photos
  ↓
album_selections
  ↓
album_selected_photos
  ↓
Submit
  ↓
status = submitted
```

---

# 45. Recommended Backup

Walaupun database berada di Supabase, tetap siapkan backup.

Backup minimal:

```text
Supabase database
Google Drive
Application source
Environment configuration
```

Jangan memasukkan secret ke Git.

Untuk backup environment, simpan secara aman di password manager atau secret management system.

---

# 46. Final Production Checklist

Sebelum aplikasi diberikan kepada photographer:

```text
SERVER
[✓] Ubuntu
[✓] Node.js
[✓] Git
[✓] Nginx
[✓] PM2
[✓] SSL

NEXT.JS
[✓] npm ci
[✓] npm run build
[✓] npm start
[✓] PM2

SUPABASE
[✓] Project created
[✓] Database migration
[✓] RLS
[✓] Auth
[✓] Site URL
[✓] Redirect URL

GOOGLE
[✓] Google Cloud Project
[✓] Google Drive API enabled
[✓] OAuth Consent Screen
[✓] OAuth Client
[✓] Redirect URI
[✓] Drive permission
[✓] Refresh token handling

SECURITY
[✓] .env.local protected
[✓] Service Role Key server-only
[✓] Google Client Secret server-only
[✓] Public album token
[✓] Quota validation server-side
[✓] Selection locking
[✓] HTTPS
```

---

# 47. Quick Installation

Untuk deployment baru, urutan singkatnya:

```bash
# 1. Clone
cd /var/www
git clone https://github.com/USERNAME/photographer-album.git photographer-album

# 2. Enter project
cd photographer-album

# 3. Install
npm ci

# 4. Configure environment
nano .env.local

# 5. Build
npm run build

# 6. Install PM2
sudo npm install -g pm2

# 7. Start
pm2 start npm --name photographer-album -- start

# 8. Save PM2
pm2 save

# 9. Configure startup
pm2 startup

# 10. Configure Nginx
sudo nano /etc/nginx/sites-available/photographer-album

# 11. Test Nginx
sudo nginx -t

# 12. Reload
sudo systemctl reload nginx

# 13. SSL
sudo certbot --nginx -d photos.example.com

# 14. Test
curl https://photos.example.com
```

---

# 48. Environment Variable Reference

| Variable                        | Public | Required | Description                    |
| ------------------------------- | -----: | -------: | ------------------------------ |
| `NEXT_PUBLIC_APP_URL`           |    Yes |      Yes | URL aplikasi                   |
| `NEXT_PUBLIC_SUPABASE_URL`      |    Yes |      Yes | Supabase URL                   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` |    Yes |      Yes | Supabase public key            |
| `SUPABASE_SERVICE_ROLE_KEY`     | **NO** |      Yes | Server-side Supabase admin key |
| `GOOGLE_CLIENT_ID`              |     No |      Yes | Google OAuth Client ID         |
| `GOOGLE_CLIENT_SECRET`          | **NO** |      Yes | Google OAuth Client Secret     |
| `GOOGLE_REDIRECT_URI`           |     No |      Yes | OAuth callback                 |
| `GOOGLE_DRIVE_ROOT_FOLDER_ID`   |     No | Optional | Root Google Drive folder       |
| `APP_SECRET_KEY`                | **NO** |      Yes | Application secret             |
| `PHOTOGRAPHER_WHATSAPP_NUMBER`  |     No | Optional | Nomor WhatsApp photographer    |
| `NODE_ENV`                      |     No |      Yes | Production/development         |

---

# 49. Important Production Notes

### Jangan menggunakan Service Role Key di Client Component

Salah:

```tsx
"use client";

const supabase = createClient(
    process.env.SUPABASE_SERVICE_ROLE_KEY
);
```

Benar:

```text
Client
   ↓
Next.js API
   ↓
Supabase Admin Client
```

---

### Jangan expose Google Client Secret

Salah:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=...
```

Benar:

```env
GOOGLE_CLIENT_SECRET=...
```

dan hanya digunakan pada server.

---

### Jangan percaya quota dari browser

Client dapat mengubah JavaScript.

Karena itu:

```text
Frontend quota
+
API quota validation
+
Database/RPC validation
```

harus digunakan.

---

### Jangan percaya `photo_id` dari client

Setiap photo ID harus diverifikasi:

```text
photo.album_id === token.album_id
```

---

# 50. Status Workflow

Status yang digunakan aplikasi:

```text
draft
   │
   │ client submit
   ▼
submitted
   │
   │ photographer mulai editing
   ▼
editing
   │
   │ selesai editing
   ▼
printing
   │
   │ selesai cetak
   ▼
done
```

UI:

```text
Memilih Foto
      ↓
Foto Sudah Dipilih
      ↓
Progress Editing
      ↓
Proses Cetak
      ↓
DONE
```

---

# 51. Next Development Phase

Setelah deployment dan konfigurasi Google Drive selesai, development berikutnya adalah:

```text
FASE 6
│
├── Photographer Selection View
│
├── Daftar foto yang dipilih client
│
├── Ambil file_name dari album_photos
│
├── Generate selection summary
│
├── WhatsApp integration
│
├── Status workflow
│   ├── SUBMITTED
│   ├── EDITING
│   ├── PRINTING
│   └── DONE
│
└── Photographer update status
```

Output yang diharapkan:

```text
Client memilih 40 foto
        ↓
Submit Final Selection
        ↓
status = submitted
        ↓
Photographer Dashboard
        ↓
"40 Foto Dipilih"
        ↓
Lihat daftar:
        DSC_001.jpg
        DSC_017.jpg
        DSC_032.jpg
        ...
        ↓
Kirim ke WhatsApp
        ↓
Mulai Editing
        ↓
status = editing
        ↓
Proses Cetak
        ↓
status = printing
        ↓
Selesai
        ↓
status = done
```

---

## End of README

Project:

**Photographer Photo Selection System**

Stack:

**Next.js + Supabase + Google Drive API + Nginx + PM2**
