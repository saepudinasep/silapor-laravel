# SiLapor — Sistem Pengaduan Masyarakat

**SiLapor** adalah aplikasi web untuk mengelola pengaduan warga terhadap masalah di lingkungan sekitar (jalan rusak, fasilitas umum, kebersihan, dsb). Warga dapat melaporkan masalah secara online, berdiskusi langsung dengan petugas melalui fitur chat real-time, dan memantau status penanganan laporannya — mulai dari **Baru**, **Diproses**, hingga **Selesai**.

Dibangun ulang menggunakan **Laravel 12** + **React** (Inertia.js).

---

## Daftar Isi

- [Untuk Siapa Aplikasi Ini?](#untuk-siapa-aplikasi-ini)
- [Fitur Utama](#fitur-utama)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Prasyarat](#prasyarat)
- [Panduan Instalasi](#panduan-instalasi)
- [Konfigurasi Penting (.env)](#konfigurasi-penting-env)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Akun Default](#akun-default)
- [Alur & Peran Pengguna](#alur--peran-pengguna)
- [Struktur Proyek](#struktur-proyek)
- [Pemecahan Masalah Umum](#pemecahan-masalah-umum)
- [Lisensi](#lisensi)

---

## Untuk Siapa Aplikasi Ini?

SiLapor dibuat untuk pemerintah desa/kelurahan yang ingin punya kanal pengaduan resmi secara online. Ada 3 jenis pengguna:

| Peran             | Bisa Melakukan Apa                                                                                                    |
| ----------------- | --------------------------------------------------------------------------------------------------------------------- |
| 🧑‍🤝‍🧑 **Masyarakat** | Mendaftar akun, membuat laporan pengaduan (dengan foto bukti), chat langsung dengan petugas, memantau status laporan  |
| 👮 **Petugas**    | Melihat semua pengaduan masuk, membalas & berdiskusi dengan pelapor, mengubah status pengaduan, membuat rekap laporan |
| 🛠️ **Admin**      | Semua kemampuan Petugas, ditambah mengelola akun petugas (tambah/edit/hapus/reset password)                           |

Semua notifikasi (pengaduan baru, balasan chat) muncul **secara real-time** — tidak perlu me-refresh halaman.

---

## Fitur Utama

- ✅ Landing page publik dengan statistik transparansi pengaduan
- ✅ Registrasi mandiri untuk masyarakat (verifikasi NIK 16 digit)
- ✅ Login terpadu (username) untuk semua peran
- ✅ Lupa password tanpa email (verifikasi via NIK/username)
- ✅ Dashboard terpisah untuk tiap peran, lengkap dengan filter status & paginasi
- ✅ Form pengaduan dengan unggah foto bukti
- ✅ **Chat real-time** dua arah antara masyarakat dan petugas per pengaduan
- ✅ **Status pengaduan otomatis berubah**:
    - `Baru` → `Proses` saat petugas membalas pertama kali
    - `Proses` → `Selesai` otomatis setelah 24 jam tidak ada balasan dari masyarakat
    - `Selesai` → `Proses` kembali jika masyarakat membalas lagi
- ✅ **Notifikasi lonceng real-time** untuk pengaduan baru & balasan chat (bukan sekadar polling)
- ✅ Manajemen akun petugas/admin oleh admin (dengan proteksi: admin terakhir tidak bisa dihapus/diturunkan)
- ✅ Generate laporan rekap dalam format **PDF** dan **Excel**
- ✅ Notifikasi popup (SweetAlert2) untuk setiap aksi penting

---

## Teknologi yang Digunakan

| Kategori       | Teknologi                                              |
| -------------- | ------------------------------------------------------ |
| Backend        | Laravel 12, PHP 8.2+                                   |
| Frontend       | React, Inertia.js                                      |
| Database       | MySQL / MariaDB                                        |
| Real-time      | Laravel Reverb (WebSocket, protokol kompatibel Pusher) |
| Styling        | CSS custom (tema navy + teal)                          |
| Export Laporan | jsPDF, SheetJS (xlsx)                                  |
| Notifikasi UI  | SweetAlert2                                            |

---

## Prasyarat

Pastikan sudah terpasang di komputer kamu:

- PHP 8.2 atau lebih baru
- Composer
- Node.js & npm
- MySQL / MariaDB
- Git

---

## Panduan Instalasi

```bash
# 1. Clone repository
git clone <url-repository-ini>
cd silapor-laravel

# 2. Install dependency backend
composer install

# 3. Install dependency frontend
npm install

# 4. Salin file environment
cp .env.example .env
php artisan key:generate

# 5. Atur koneksi database di file .env
#    DB_DATABASE=silapor
#    DB_USERNAME=root
#    DB_PASSWORD=

# 6. Jalankan migrasi database + data awal (akun admin default)
php artisan migrate --seed

# 7. Buat symlink storage (agar foto pengaduan bisa diakses)
php artisan storage:link

# 8. Install & konfigurasi broadcasting (WebSocket)
php artisan install:broadcasting
```

Saat instalasi broadcasting, pilih **Reverb** sebagai driver. Perintah ini otomatis mengisi beberapa variabel `REVERB_*` di `.env`.

> ⚠️ **Penting untuk pengguna Windows**: pastikan `REVERB_SERVER_PORT` juga diisi di `.env` (tidak cukup hanya `REVERB_PORT`), dan tambahkan pengecualian Antivirus/Firewall untuk `php.exe` jika Reverb gagal listen di port tertentu.

---

## Konfigurasi Penting (.env)

```env
# Broadcasting (WebSocket real-time)
BROADCAST_CONNECTION=reverb
REVERB_APP_ID=
REVERB_APP_KEY=
REVERB_APP_SECRET=
REVERB_HOST="localhost"
REVERB_PORT=8080
REVERB_SERVER_HOST=0.0.0.0
REVERB_SERVER_PORT=8080
REVERB_SCHEME=http

VITE_REVERB_APP_KEY="${REVERB_APP_KEY}"
VITE_REVERB_HOST="${REVERB_HOST}"
VITE_REVERB_PORT="${REVERB_PORT}"
VITE_REVERB_SCHEME="${REVERB_SCHEME}"

# Akun admin awal (dipakai oleh seeder)
SEED_ADMIN_USERNAME=admin123
SEED_ADMIN_PASSWORD=password123
```

---

## Menjalankan Aplikasi

Aplikasi ini butuh **4 proses berjalan bersamaan** saat development. Buka 4 terminal terpisah:

```bash
# Terminal 1 — Web server Laravel
php artisan serve

# Terminal 2 — Compile & watch aset frontend
npm run dev

# Terminal 3 — Server WebSocket (chat & notifikasi real-time)
php artisan reverb:start

# Terminal 4 — Scheduler (auto-close pengaduan setelah 24 jam tidak aktif)
php artisan schedule:work
```

Setelah semua jalan, buka **http://127.0.0.1:8000** di browser.

---

## Akun Default

Setelah `php artisan migrate --seed`, tersedia 1 akun admin (sesuai `SEED_ADMIN_USERNAME` / `SEED_ADMIN_PASSWORD` di `.env`):

| Username   | Password      | Peran         |
| ---------- | ------------- | ------------- |
| `admin123` | `password123` | Administrator |

Akun **petugas** dan **masyarakat** dibuat lewat aplikasi:

- Petugas → didaftarkan oleh admin lewat menu **Data Pengguna**
- Masyarakat → mendaftar sendiri lewat halaman **Daftar**

---

## Alur & Peran Pengguna

```
Masyarakat membuat pengaduan
        │
        ▼
   Status: BARU  ──────────────► Petugas mendapat notifikasi
        │
        │ Petugas membalas pertama kali
        ▼
   Status: PROSES ◄────────────┐
        │                       │ Masyarakat membalas lagi
        │ 24 jam tanpa balasan  │
        │ dari masyarakat       │
        ▼                       │
   Status: SELESAI ─────────────┘
```

Setiap perubahan status dan pesan chat baru dikirim secara **real-time** ke kedua pihak tanpa perlu refresh halaman.

---

## Struktur Proyek

Beberapa bagian penting yang perlu diketahui developer:

```
app/
├── Console/Commands/
│   └── AutoCloseStalePengaduan.php     # Auto-close pengaduan 24 jam tidak aktif
├── Events/
│   ├── PesanDikirim.php                # Broadcast pesan chat baru
│   ├── StatusPengaduanDiubah.php       # Broadcast perubahan status
│   └── NotifikasiDiperbarui.php        # "Ping" untuk refresh lonceng notifikasi
├── Http/Controllers/
│   ├── PengaduanController.php         # CRUD pengaduan (masyarakat)
│   ├── PesanController.php             # Kirim pesan chat (bersama)
│   ├── Petugas/PengaduanController.php # Detail & respon (petugas/admin)
│   └── Admin/PetugasController.php     # CRUD akun petugas (admin)
├── Models/
│   ├── User.php                        # Role: admin, petugas, masyarakat
│   ├── Pengaduan.php
│   └── Pesan.php                       # Chat, dengan read-tracking (dibaca_at)
resources/js/
├── Layouts/AppLayout.jsx               # Sidebar, topbar, lonceng notifikasi
├── Components/Chat.jsx                 # Widget chat real-time (reusable)
└── Pages/                              # Halaman per role
routes/
├── web.php
└── channels.php                        # Otorisasi channel WebSocket
```

---

## Pemecahan Masalah Umum

<details>
<summary><strong>Chat/notifikasi tidak real-time</strong></summary>

1. Pastikan `php artisan reverb:start` sedang berjalan.
2. Cek `routes/channels.php` — pastikan 3 channel berikut terdaftar: `pengaduan.{pengaduanId}`, `petugas-notifikasi`, dan `App.Models.User.{id}`.
3. Buka DevTools browser → tab Network → filter "WS" → pastikan koneksi WebSocket berstatus `101 Switching Protocols`.

</details>

<details>
<summary><strong>Status tidak otomatis berubah setelah 24 jam</strong></summary>

Pastikan `php artisan schedule:work` sedang berjalan (untuk development), atau cron job server sudah dikonfigurasi menjalankan `php artisan schedule:run` setiap menit (untuk production). Untuk tes manual tanpa menunggu 24 jam:

```bash
php artisan pengaduan:auto-close
```

</details>

<details>
<summary><strong>Reverb gagal listen di port 8080</strong></summary>

Biasanya karena Windows me-reserve port tersebut (terkait WSL2/Hyper-V). Ganti ke port lain di `.env` (misal 8082), pastikan **kedua** variabel diubah: `REVERB_PORT` dan `REVERB_SERVER_PORT`, lalu jalankan `php artisan config:clear`.
</details>

<details>
<summary><strong>Foto pengaduan tidak muncul</strong></summary>

Jalankan `php artisan storage:link` — foto disimpan di `storage/app/public` dan perlu symlink ke `public/storage` agar bisa diakses browser.
</details>

---

## Lisensi

Proyek ini menggunakan lisensi [MIT](https://opensource.org/licenses/MIT). Bebas digunakan dan dimodifikasi untuk keperluan pembelajaran maupun implementasi nyata.
