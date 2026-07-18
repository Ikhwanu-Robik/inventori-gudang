# Dokumentasi Inventori Gudang

⚠️ **PENGUMUMAN:** Dokumentasi terbaru untuk arsitektur v2 (kategori dinamis, CRUD lokasi, session security, deploy Vercel) telah diperbarui secara lengkap pada branch **`v2`** di folder `inventori-gudang-v2/docs/`.

👉 **[Buka Dokumentasi v2 di Branch `v2`](../../tree/v2/inventori-gudang-v2/docs)**

---

Folder ini adalah konteks proyek. Baca sebelum mengubah fitur, skema database, atau konfigurasi.

## Urutan baca

1. [Audit awal](./audit.md) — kondisi kode saat audit pertama, risiko, dan urutan perbaikan.
2. [PRD](./best-practice/prd.md) — masalah bisnis, pengguna, alur, dan kebutuhan fitur.
3. [Design](./best-practice/design.md) — keputusan arsitektur dan rancangan teknis target.
4. [Sprint](./best-practice/sprint.md) — urutan kerja kecil yang dapat selesai dan diuji.
5. [Panduan AI agent](./best-practice/ai-agent-guide.md) — konteks dan aturan saat bekerja bersama AI.

## Status dokumentasi

- Aplikasi saat ini: prototipe belajar Next.js + Prisma untuk mencatat barang dan lokasi gudang.
- Dokumen ini: target perbaikan. Dokumen bukan bukti bahwa semua target sudah diterapkan.
- Kode sumber: tetap menjadi sumber fakta untuk perilaku aplikasi yang sudah berjalan.

## Cara memakai

- Perubahan kecil: baca `audit.md`, pilih item sprint terkait, lalu kerjakan dan perbarui statusnya.
- Fitur baru: perbarui PRD terlebih dahulu bila alur atau aturan bisnis berubah.
- Perubahan teknis besar: perbarui `design.md` sebelum mengubah struktur folder atau database.
- Kerja dengan AI agent: berikan tautan dokumen relevan, batas pekerjaan, dan perintah verifikasi.
