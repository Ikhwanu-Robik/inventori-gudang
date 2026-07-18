# Sprint Plan

## Cara memakai sprint ini

Sprint bukan janji tanggal. Sprint adalah paket kerja kecil dengan hasil yang bisa diperiksa. Jangan mulai sprint berikutnya bila quality gate sprint aktif masih gagal, kecuali ada keputusan tertulis untuk menunda.

Setiap item harus punya:

- tujuan jelas;
- file atau area terdampak;
- cara verifikasi;
- risiko data bila menyentuh Prisma atau database;
- status: `Belum mulai`, `Berjalan`, `Review`, atau `Selesai`.

## Sprint 0 — Stabilkan fondasi

**Tujuan:** kolaborator baru dapat menjalankan proyek dengan langkah jelas.

| Item | Status | Bukti selesai |
| --- | --- | --- |
| Tambah `.env.example` tanpa rahasia | Belum mulai | Variabel Prisma CLI dan runtime terdokumentasi. |
| Tambah README setup lokal | Belum mulai | Clone baru dapat install, generate, migrasi aman, lalu menjalankan app. |
| Tambah Prisma generate otomatis dan script DB | Belum mulai | Client generated tersedia setelah setup. |
| Perbaiki `tsconfig` dan lint | Belum mulai | `npm run lint` dan typecheck lulus. |
| Audit migrasi awal | Belum mulai | Tidak ada kehilangan data atau masalah nama tabel yang tak disadari. |

**Verifikasi sprint:** install bersih pada folder baru, `npx prisma generate`, lint, typecheck, dan build.

## Sprint 1 — Tetapkan aturan data inventori

**Tujuan:** data barang tidak bercampur dan aturan stok terdokumentasi.

| Item | Status | Bukti selesai |
| --- | --- | --- |
| Putuskan SKU, satuan, dan aturan duplikasi | Belum mulai | Keputusan dicatat di PRD dan schema. |
| Rancang lokasi gudang sebagai data terstruktur | Belum mulai | Lokasi tidak lagi berupa JSON bebas. |
| Tambah schema validation server | Belum mulai | Input invalid ditolak dengan pesan jelas. |
| Perbaiki error `not found` dan error form | Belum mulai | Route invalid tidak menjadi error 500. |
| Tambah test aturan validasi | Belum mulai | Kasus kuantitas invalid dan SKU duplikat diuji. |

**Verifikasi sprint:** test validasi lulus; input barang salah tidak mengubah database.

## Sprint 2 — Mutasi stok yang dapat dipercaya

**Tujuan:** stok per lokasi dan riwayat selalu konsisten.

| Item | Status | Bukti selesai |
| --- | --- | --- |
| Tambah `StockMovement` dan saldo per lokasi | Belum mulai | Model data mendukung masuk, keluar, transfer. |
| Ubah barang masuk menjadi transaksi atomik | Belum mulai | Mutasi dan saldo tersimpan bersama atau gagal bersama. |
| Buat barang keluar | Belum mulai | Stok negatif ditolak. |
| Buat transfer lokasi | Belum mulai | Saldo asal dan tujuan benar dalam satu transaksi. |
| Tampilkan riwayat pada detail barang | Belum mulai | Setiap perubahan dapat ditelusuri. |

**Verifikasi sprint:** test integrasi menjalankan transaksi sukses, gagal, dan dua request bersamaan bila database test mendukung.

## Sprint 3 — Dashboard dan pengalaman pengguna

**Tujuan:** petugas cepat menemukan dan membaca data.

| Item | Status | Bukti selesai |
| --- | --- | --- |
| Terapkan shell dashboard dan shadcn/ui | Belum mulai | Navigasi, form, dialog, toast konsisten. |
| Daftar barang dengan pencarian/filter | Belum mulai | Pencarian SKU/nama dan empty state tersedia. |
| Detail stok per lokasi dan denah responsif | Belum mulai | Denah bukan satu-satunya cara membaca lokasi. |
| Perbaiki aksesibilitas interaksi | Belum mulai | Navigasi keyboard dan label form berfungsi. |
| Tambah state loading/error | Belum mulai | Pengguna menerima feedback saat data lambat/gagal. |

**Verifikasi sprint:** cek layar ponsel dan desktop; lakukan keyboard-only smoke test.

## Sprint 4 — Keamanan dan delivery

**Tujuan:** aplikasi siap dipakai internal dengan proses rilis aman.

| Item | Status | Bukti selesai |
| --- | --- | --- |
| Tambah autentikasi dan role | Belum mulai | Hanya peran sesuai yang dapat mengubah data. |
| Tambah audit trail pengguna | Belum mulai | Pembuat dan waktu mutasi terlihat. |
| Tambah CI GitHub Actions | Belum mulai | Pull request menjalankan quality gate. |
| Tambah backup dan panduan deploy | Belum mulai | Prosedur restore dan migrasi terdokumentasi. |
| Tinjau dependency dan vulnerability | Belum mulai | Upgrade dipilih manual dan diuji. |

**Verifikasi sprint:** pull request contoh lulus CI; pengguna tanpa role tulis ditolak.

## Definition of Ready

Pekerjaan boleh mulai bila kebutuhan, aturan bisnis, dampak data, dan cara verifikasi sudah jelas. Bila tidak jelas, tambahkan pertanyaan ke PRD atau buat item eksplorasi kecil.

## Definition of Done

Pekerjaan selesai bila implementasi, dokumentasi, test/verifikasi, dan review sudah selesai. `Selesai` bukan berarti fitur hanya terlihat bekerja di browser sendiri.
