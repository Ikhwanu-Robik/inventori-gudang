# Inventori Gudang

⚠️ **INFORMASI BRANCH BARU (v2):** 
Aplikasi ini telah di-upgrade secara masif ke versi **Gudang v2** dengan arsitektur standar industri, keamanan ketat, dan performa optimal. Seluruh hasil perbaikan v2 dideploy di branch **`putra`**.

👉 **[Lihat Gudang v2 di Branch `putra`](../tree/putra)**

---

Aplikasi pencatatan barang dan lokasi gudang. Dibuat untuk membantu menemukan barang tanpa bertanya ke orang lain.

## Masalah

Di gudang tempat kerja, barang seringkali sulit ditemukan karena informasi lokasi hanya berada di ingatan orang atau catatan terpisah. Aplikasi ini menjadi _single source of truth_ untuk stok dan lokasi barang.

## Fitur Saat Ini

- Form barang masuk dengan denah gudang
- Daftar barang dengan detail stok
- Barang dapat memiliki banyak lokasi dengan catatan masing-masing
- Lokasi ditampilkan pada denah visual

## Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Database:** MySQL/MariaDB + Prisma ORM
- **UI:** Tailwind CSS + React Icons
- **Runtime:** Node.js 24+

Proyek ini adalah proyek belajar pertama dengan Next.js dan Prisma.

## Setup untuk Clone Baru

### Prasyarat

- Node.js 20+ dan npm/yarn/pnpm
- MySQL atau MariaDB server yang berjalan
- Git

### Langkah Setup

1. **Clone repository**

   ```bash
   git clone <repository-url>
   cd inventori-gudang
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup database dan environment**

   Buat database MySQL/MariaDB kosong:

   ```sql
   CREATE DATABASE inventori_gudang CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

   Buat file `.env` di root proyek dengan variabel berikut:

   ```env
   # Untuk Prisma CLI (migrasi dan generate)
   DATABASE_URL="mysql://user:password@localhost:3306/inventori_gudang"

   # Untuk runtime aplikasi (adapter MariaDB)
   DATABASE_HOST="localhost"
   DATABASE_USER="user"
   DATABASE_PASSWORD="password"
   DATABASE_NAME="inventori_gudang"
   ```

   Ganti `user`, `password`, `localhost`, dan `inventori_gudang` sesuai database kamu.

4. **Generate Prisma Client**

   ```bash
   npx prisma generate
   ```

5. **Jalankan migrasi database**

   ⚠️ **Peringatan:** Migrasi kedua (`20260718024727_item_to_details`) menghapus kolom `note` dan `location` dari tabel `Item`. Bila database sudah berisi data, backup dulu sebelum migrasi.

   Untuk database kosong baru:

   ```bash
   npx prisma migrate deploy
   ```

   Untuk development:

   ```bash
   npx prisma migrate dev
   ```

6. **Jalankan aplikasi**

   ```bash
   npm run dev
   ```

   Buka [http://localhost:3000](http://localhost:3000) di browser.

## Masalah yang Diketahui

Setup saat ini **belum lengkap** dan memiliki beberapa risiko:

- Prisma Client belum digenerate otomatis setelah `npm install`
- Tidak ada `.env.example` sebagai template
- Migrasi kedua dapat menghapus data lama tanpa peringatan
- `npm run lint` dan `npx tsc --noEmit` masih gagal
- Tidak ada test atau CI
- Transaksi stok belum atomik

**Untuk detail lengkap masalah dan rencana perbaikan, baca [docs/audit.md](docs/audit.md).**

### 🚀 Spill Perbaikan di Gudang v2 (Branch `putra`)

| Fitur / Isu | Versi 1 (Prototipe) | Versi 2 (Standard Industri - Branch `putra`) | Status |
| --- | --- | --- | --- |
| **Database** | MySQL lokal (raw connection) | PostgreSQL + Neon Serverless (Cloud-native ready) | Migrasi Sukses |
| **Transaksi Stok** | Query terpisah (tidak atomik, rawan stok negatif) | Transaksi atomik `Serializable` dengan retry otomatis pada konflik concurrency | Diselesaikan |
| **Input SKU** | Input manual (rawan duplikasi dan tidak konsisten) | **Auto-Generate SKU** dinamis berdasarkan prefix kategori barang database | Diselesaikan |
| **Denah Gudang** | Visual statis (dot lokasi tidak pas) | CRUD Lokasi dinamis dengan visual koordinat `x/y` persen tepat pada grid | Diselesaikan |
| **Keamanan (Auth)** | Tanpa autentikasi (publik bebas ubah) | Cookie-based session terenkripsi (Web Crypto API) & Role-based Access | Diselesaikan |
| **Aksesibilitas** | Navigasi mouse only, elemen non-semantik | Focus keyboard, tombol semantik, label ARIA, bahasa ID | Diselesaikan |
| **CI/CD Quality Gate** | Tanpa test & linting rusak | GitHub Actions otomatis (ESLint, Typecheck, 9 Unit + Integration Tests) | Diselesaikan |

## Dokumentasi

Folder `docs/` menyimpan konteks proyek untuk kolaborator dan AI agent:

- [docs/audit.md](docs/audit.md) — audit kode awal, temuan, dan urutan perbaikan
- [docs/best-practice/prd.md](docs/best-practice/prd.md) — kebutuhan produk dan aturan bisnis
- [docs/best-practice/design.md](docs/best-practice/design.md) — arsitektur target
- [docs/best-practice/sprint.md](docs/best-practice/sprint.md) — rencana kerja bertahap
- [docs/best-practice/ai-agent-guide.md](docs/best-practice/ai-agent-guide.md) — panduan kerja dengan AI

## Status Proyek

Proyek ini adalah **prototipe belajar**. Fitur dasar sudah berjalan, tetapi belum siap untuk produksi atau kolaborasi tanpa perbaikan pada Sprint 0 (lihat [docs/best-practice/sprint.md](docs/best-practice/sprint.md)).

## Kontribusi

Baca [docs/README.md](docs/README.md) dan [docs/audit.md](docs/audit.md) sebelum mengubah kode. Perbaikan dimulai dari Sprint 0: setup, lint, TypeScript, dan migrasi aman.

## Lisensi

Proyek pribadi untuk belajar.
