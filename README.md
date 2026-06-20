# SEHA Clinic Operations System

Prototype sistem operasional klinik untuk **Praktik Mandiri dr. Aisyah Fikritama, S.A.** (praktik dokter anak / pediatri).

> **Disclaimer:** Aplikasi ini adalah prototype yang menggunakan **data dummy saja**. Ini **bukan** sistem rekam medis tersertifikasi dan **tidak boleh** digunakan untuk operasional klinis nyata tanpa proses kepatuhan, keamanan, legal, dan validasi healthcare yang sesuai.

---

## 1. Project Overview

SEHA adalah prototype *clinic operations system* yang dirancang dengan prinsip:

> **Simple enough for daily use, structured enough for operational control.**

Fokusnya bukan kelengkapan fitur ala rumah sakit, melainkan **alur kerja klinik yang cepat, low-click, dan tablet-friendly** — dari pasien datang hingga pulang. Dibangun sebagai portofolio **Business Analyst / Product & Implementation Designer**.

## 2. User Roles

Akses berbasis peran disimulasikan melalui **Role Switcher** (tanpa autentikasi nyata):

| Peran | Tanggung Jawab Utama | Akses |
|-------|----------------------|-------|
| **Admin** | Registrasi pasien & kunjungan, kelola antrean, profil pasien, generate laporan PDF & sertifikat, reminder, dashboard operasional | Editor luas kecuali setting developer |
| **Dokter** | SOAP, diagnosis manual, berat/tinggi, instruksi obat manual, next action, reminder imunisasi/kontrol, approve laporan & sertifikat | Edit rekam klinis, lihat stok |
| **Perawat** | Vitals awal (berat, tinggi, suhu), keluhan, persiapan pasien, update status antrean | Edit vitals; SOAP dokter read-only setelah submit |
| **Apoteker** | Lihat instruksi obat, kelola stok farmasi, expiry, obat racik, bahan habis pakai, status penyerahan | Edit farmasi & inventory; tidak bisa edit SOAP |
| **Developer** | Akses konfigurasi tertinggi (ditampilkan sebagai peran saja, tanpa backend nyata) | — |

Matriks akses lengkap ada di halaman **/access-control**.

## 3. Main Workflow (Arrival → Checkout)

1. Pasien datang / sudah registrasi online.
2. Admin cari/buat profil pasien & pilih tipe kunjungan (Konsultasi Umum, Imunisasi, Kontrol Ulang, Surat Sehat, Surat Sakit).
3. Admin masukkan ke antrean — berlaku **aturan keadilan: 2 online : 1 offline**.
4. Perawat panggil pasien, catat **vitals** (berat, tinggi, suhu, keluhan).
5. Dokter buka pemeriksaan, isi **SOAP** + instruksi obat + next action + reminder.
6. Apoteker review resep, cek stok, obat racik, dan **expiry alert**.
7. Admin generate **laporan PDF** & **sertifikat** (cetak via browser).
8. Admin buat **reminder** untuk orang tua (copy pesan WhatsApp manual).
9. Pasien pulang.

## 4. Feature List

- **Dashboard berbasis peran** — kartu relevan per peran (Admin/Dokter/Perawat/Apoteker/Developer) + banner branding & badge kepatuhan.
- **Dashboard Manajemen Praktik** — analitik bulanan untuk pemilik praktik: tren kunjungan pasien (online/offline), ringkasan keuangan (pendapatan/biaya/laba + YTD), tagihan belum dibayar, jenis kunjungan, diagnosis terbanyak (ICD-10), pertumbuhan pasien baru & imunisasi, ringkasan & pergerakan stok obat — semua chart digambar inline SVG (tanpa library). Akses: Dokter (owner) / Admin / Developer.
- **Registry Pasien** — 8 pasien anak dummy, detail profil, riwayat kunjungan & imunisasi.
- **Registrasi & Antrean** — online/offline, tipe kunjungan, status antrean, badge, waktu tunggu, aturan keadilan 2:1.
- **Modul Pemeriksaan (RME)** — Vitals perawat + SOAP dokter dalam satu workspace, **kode ICD-10 (input manual)**, **Ambience AI Scribe (simulasi)** yang wajib direview dokter, gating per peran.
- **KMS Digital Anak** — kurva pertumbuhan persentil (berat & tinggi terhadap usia) gaya WHO dengan klasifikasi band, render SVG (tanpa library chart).
- **Farmasi & Inventory** — stok obat, vaksin, **bahan habis pakai (single-use)**, bahan obat racik; **pergerakan stok (stock movement)** penerimaan/pemakaian/penyesuaian yang langsung mengubah jumlah & status; monitoring expiry, alert low-stock/expiring/expired.
- **Kasir & Billing** — invoice, katalog tarif, metode bayar (Tunai/QRIS/Asuransi/BPJS), status pembayaran, cetak kwitansi.
- **Laporan PDF** — preview laporan kunjungan profesional, cetak/simpan PDF via browser.
- **Sertifikat** — Surat Keterangan Sakit/Sehat untuk anak (tanpa field pekerjaan).
- **Reminder Center** — daftar reminder, generate teks WhatsApp untuk disalin manual (tanpa API).
- **Hak Akses** — matriks role-based access.
- **Proposal & Contract Estimator** — memisahkan **biaya pengembangan one-time (Rp108jt, capital — diamortisasi ke banyak klinik)** dari **harga langganan tahunan klinik** yang dihitung cost-plus (HPP operasional + margin). Rekomendasi langganan **±Rp14,4jt/tahun (≈Rp1,2jt/bulan) all-in**, rentang Rp12–18jt/tahun + onboarding Rp3jt. Termasuk rincian HPP, 3 paket harga, dan estimator yang dapat diedit.
- **Tentang** — penjelasan proyek + tabel penyelarasan dengan platform SEHA (projectseha.com).
- **Website Publik Praktik** (`/profil`) — situs profil untuk orang tua/pasien: hero, profil dokter, layanan, jadwal praktik, lokasi & kontak, pendaftaran online via WhatsApp (salin/kirim pesan manual), dan FAQ. Tampil full-page tanpa sidebar staf; ada link "Login Staf" menuju sistem internal.

### Penyelarasan dengan platform SEHA (projectseha.com)

Prototype ini diselaraskan dengan modul produk SEHA yang sebenarnya — tagline **"Kembalikan Waktu Dokter untuk Pasien"**:

| Modul SEHA | Implementasi prototype |
|------------|------------------------|
| Rekam Medis Elektronik (RME) | SOAP terstruktur + kode ICD-10 (manual) |
| KMS Digital Anak | Kurva pertumbuhan persentil berat & tinggi |
| Manajemen Antrean | Antrean online/offline, aturan keadilan 2:1 |
| Farmasi & Inventori | Stok, racik, monitoring kadaluarsa/low-stock |
| Kasir & Billing | Invoice, tarif, metode bayar, kwitansi |
| Ambience AI Scribe | Simulasi draft SOAP dari transkrip (wajib review dokter) |
| Integrasi SATUSEHAT / HL7 FHIR / SNOMED CT / UU PDP | Ditampilkan sebagai **kesiapan/acuan standar** (badge), bukan koneksi/sertifikasi nyata |

Modul **IGD/Emergency** pada produk SEHA sengaja tidak diadopsi karena tidak relevan untuk praktik mandiri solo.

## 5. Business Rules

1. **Keadilan antrean:** 2 pasien online diikuti 1 pasien offline, berulang.
2. **Laporan siap** hanya jika: vitals perawat selesai **dan** SOAP dokter selesai **dan** (instruksi obat **atau** next action terisi).
3. **Peringatan farmasi:** tampil jika obat kadaluarsa, akan kadaluarsa (≤90 hari), atau stok di bawah minimum.
4. **Reminder:** untuk imunisasi/kontrol, kontak manual saja (tanpa WhatsApp blast).
5. **Sertifikat:** untuk anak — tanpa field pekerjaan/okupasi.
6. **Akses peran:** Dokter→SOAP, Perawat→vitals, Apoteker→stok, Admin→registrasi/laporan/reminder, Developer→akses tertinggi (tanpa backend nyata).

## 6. Dummy Data

Seluruh data fiktif, ada di folder `data/`:

| File | Isi |
|------|-----|
| `data/users.ts` | Staf: dr. Aisyah (Dokter), Admin Klinik, Perawat Rina, Apoteker Sari, Developer SEHA |
| `data/patients.ts` | 8 pasien anak (Rania, Arka, Naya, Daffa, Keisha, Bima, Zoya, Rayyan) |
| `data/queue.ts` | Antrean hari ini (urutan sudah mengikuti aturan 2:1) |
| `data/visits.ts` | Tipe kunjungan, status, aturan keadilan, business rule laporan |
| `data/inventory.ts` | 11 item (obat, vaksin, bahan habis pakai, bahan racik) + obat racik |
| `data/stockMovement.ts` | Riwayat pergerakan stok (penerimaan/pemakaian/penyesuaian) |
| `data/analytics.ts` | Agregat bulanan untuk dashboard manajemen (kunjungan, keuangan, diagnosis, imunisasi) |
| `data/growth.ts` | Referensi persentil (WHO-style, disederhanakan) + riwayat pengukuran per pasien |
| `data/billing.ts` | Invoice, katalog tarif, metode pembayaran |
| `data/icd10.ts` | Subset kode ICD-10 untuk pemilihan manual |
| `data/reminders.ts` | Reminder + builder pesan WhatsApp |
| `data/certificates.ts` | Contoh surat sehat & sakit |
| `data/pricing.ts` | Paket harga & disclaimer |
| `data/access.ts` | Matriks hak akses |
| `data/practice.ts` | Konten website publik (profil, layanan, jadwal, lokasi, FAQ) |

Nomor telepon memakai format dummy `08xx-xxxx-xxxx`. **Tidak ada data pasien nyata.**

## 7. Tech Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (palet soft blue / putih / abu / hijau-aman / amber-warning / merah-kritis)
- Data lokal (tanpa backend, tanpa database, tanpa autentikasi nyata)
- Tanpa integrasi WhatsApp / SATUSEHAT nyata

Komponen reusable: `AppShell`, `RoleSwitcher`, `DashboardCard`, `QueueTable`, `PatientCard`, `StatusBadge`, `InventoryTable`, `GrowthChart`, `ReportPreview`, `CertificatePreview`, `ReceiptPreview`, `ReminderCard`, `PricingCard`, `PageHeader`, `DummyNotice`.

## 8. How to Run Locally

```bash
npm install
npm run dev      # http://localhost:3000
```

Build produksi:

```bash
npm run build
npm start
```

Gunakan **Role Switcher** di header / sidebar untuk berpindah peran. Untuk cetak laporan/sertifikat, buka **/reports** lalu klik **Cetak / Simpan PDF** (memakai dialog print browser → "Save as PDF").

## 9. Scope Limitations

- State interaktif (registrasi, update status, edit vitals/SOAP, status reminder) bersifat **session-only** dan reset saat reload — tidak ada persistensi.
- Tidak ada autentikasi/otorisasi nyata; peran disimulasikan via role switcher.
- Tidak ada backend, database, audit log, atau enkripsi.
- Generate PDF memakai print browser, bukan engine PDF server-side.
- Tidak ada integrasi WhatsApp API maupun SATUSEHAT.

## 10. Future Development Roadmap

- **Fase 2:** integrasi WhatsApp, kesiapan SATUSEHAT, janji temu online, billing & kasir, audit log, cloud backup, analytics lanjutan.
- Persistensi data (database) + autentikasi nyata berbasis peran.
- Pergerakan stok inventory & arsip laporan.
- Engine PDF server-side dan tanda tangan digital.

## 11. Assumptions Made

- Tanggal acuan ("hari ini") untuk perhitungan expiry: **2026-06-19**.
- "Akan kadaluarsa" didefinisikan sebagai expiry dalam ≤ 90 hari.
- Label umur pasien disimpan sebagai teks dummy yang sudah dihitung.
- Aturan keadilan antrean disajikan sebagai urutan data yang sudah disusun + penjelasan visual, bukan algoritma penjadwalan dinamis.
- Kurva pertumbuhan KMS memakai referensi persentil yang **disederhanakan** (loosely WHO-style), bukan tabel WHO resmi — untuk demonstrasi prototype saja.
- Ambience AI Scribe adalah **simulasi UI** (template statis), tanpa AI nyata; dokter tetap memegang kendali penuh dan wajib mereview.
- Badge SATUSEHAT/HL7 FHIR/SNOMED CT/UU PDP menandakan kesiapan/acuan standar, bukan integrasi atau sertifikasi nyata.

---

*Dibuat oleh Fadhil — Business Analyst / Product & Implementation Designer — sebagai prototype portofolio.*
