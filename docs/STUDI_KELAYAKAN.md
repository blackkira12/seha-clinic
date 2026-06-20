# Studi Kelayakan (Feasibility Study)
## SEHA Clinic Operations System — Praktik Mandiri dr. Aisyah Fikritama, S.A.

**Versi:** 1.0 · **Tanggal:** 19 Juni 2026
**Disusun oleh:** Fadhil — Business Analyst / Product & Implementation Designer
**Status dokumen:** Internal — untuk pengambilan keputusan investasi proyek

> Catatan: Seluruh angka operasional, finansial, dan volume pasien dalam dokumen ini menggunakan **data dummy/ilustratif** dari prototype. Pada implementasi nyata, angka wajib divalidasi dengan data aktual praktik.

---

## 1. Ringkasan Eksekutif

Praktik Mandiri dr. Aisyah Fikritama, S.A. (praktik dokter anak) membutuhkan sistem operasional klinik yang **sederhana, cepat, dan low-click** untuk merapikan alur kerja harian: registrasi, antrean, pemeriksaan (RME/SOAP), farmasi & inventory, kasir, pelaporan, hingga pengingat orang tua. Studi ini menilai kelayakan pembangunan dan pengoperasian sistem tersebut.

**Kesimpulan utama: PROYEK LAYAK DILANJUTKAN (GO), dengan syarat.**

| Dimensi | Putusan | Catatan |
|---|---|---|
| Teknis | ✅ Sangat Layak | Stack modern (Next.js), hosting cloud terjangkau, skalabel |
| Operasional | ✅ Layak | Desain low-click sesuai preferensi dokter; perlu pelatihan & manajemen perubahan |
| Ekonomi (langganan operasional) | ✅ Layak | ±Rp11–14jt/tahun ≈ 2–3% omzet; sangat terjangkau |
| Ekonomi (biaya build Rp108jt klien tunggal) | ⚠️ Bersyarat | Pure hard-ROI marginal untuk 1 klinik; dijustifikasi oleh kepatuhan RME, kualitas, & pertumbuhan. Disarankan **Model A** (build sebagai capital) atau model produk multi-klinik |
| Hukum & Kepatuhan | ⚠️ Bersyarat | Wajib hardening PDP & RME sebelum memakai data pasien nyata |
| Jadwal | ✅ Layak | MVP ±2,5–3 bulan |

---

## 2. Latar Belakang & Deskripsi Proyek

Saat ini dokter memprioritaskan **kesederhanaan dan efisiensi alur kerja** dibanding kelengkapan fitur. Sistem EMR yang terlalu kompleks dinilai lambat dan memperbanyak klik.

**Solusi yang diusulkan:** sistem operasional klinik berbasis web dengan modul:
registrasi & antrean (aturan keadilan 2 online : 1 offline), vitals perawat, SOAP dokter + ICD-10, KMS Digital Anak (kurva pertumbuhan), farmasi & inventory + pergerakan stok, kasir & billing, laporan PDF, surat sehat/sakit, reminder center manual, dashboard manajemen, serta website publik praktik.

Prototype fungsional telah dibangun (17 halaman, data dummy) sebagai bukti konsep.

---

## 3. Tujuan & Ruang Lingkup

**Tujuan:**
- Mengurangi dokumentasi manual yang tersebar.
- Mempercepat alur pasien dari datang hingga pulang.
- Memantau stok obat/vaksin & kadaluarsa.
- Mempermudah pelaporan & sertifikat.
- Menyediakan visibilitas manajerial (tren pasien, keuangan, stok).
- Menyiapkan kepatuhan RME & kesiapan integrasi SATUSEHAT.

**Dalam ruang lingkup (MVP):** seluruh modul operasional inti + dashboard manajemen + website publik.
**Di luar ruang lingkup (Fase 2+):** integrasi WhatsApp API, integrasi SATUSEHAT dua arah, billing/asuransi lanjutan, analitik prediktif.

---

## 4. Kelayakan Teknis (Technical Feasibility) — ✅ Sangat Layak

| Aspek | Penilaian |
|---|---|
| Teknologi | Next.js 14 + TypeScript + Tailwind; matang, banyak talenta, dokumentasi luas |
| Hosting | Vercel / VPS kecil — biaya rendah, auto-scaling, SSL gratis |
| Basis data (produksi) | PostgreSQL terkelola (mis. Supabase/Neon) — cukup untuk skala 1 praktik |
| Skalabilitas | Arsitektur dapat tumbuh dari 1 klinik ke multi-klinik (model produk) |
| Keamanan | Mendukung enkripsi in-transit (HTTPS) & at-rest; perlu kontrol akses & audit log pada produksi |
| Integrasi masa depan | Siap HL7 FHIR / SATUSEHAT (readiness, Fase 2) |
| Risiko teknis | Rendah — tidak ada teknologi eksperimental |

**Kesenjangan prototype → produksi:** autentikasi nyata, basis data + persistensi, audit log, backup, enkripsi at-rest, RBAC server-side, hardening keamanan.

---

## 5. Kelayakan Operasional (Operational Feasibility) — ✅ Layak

- **Kesesuaian dengan pengguna:** desain low-click & tablet-friendly selaras dengan preferensi dokter (cepat, sedikit klik). 
- **Perubahan proses:** alur baku registrasi → vitals → SOAP → farmasi → kasir → laporan. Perlu SOP & pelatihan singkat (perawat, admin, apoteker, dokter).
- **Adopsi:** rendah-menengah risikonya karena antarmuka sederhana; titik kritis adalah disiplin input data (vitals, stok).
- **Dukungan:** pemeliharaan & helpdesk oleh pengembang (termasuk dalam langganan).
- **Manajemen perubahan:** onboarding 1 kali (deploy + migrasi data + pelatihan), lalu pendampingan ringan bulan pertama.

---

## 6. Kelayakan Ekonomi / Finansial (Economic Feasibility)

### 6.1 Profil Operasi (ilustratif dari prototype)

| Metrik | Nilai |
|---|---|
| Kunjungan/bulan (rata-rata) | ±113 (rentang 96–132, tren +8%/bln) |
| Kunjungan/tahun (anualisasi) | ±1.356 |
| Omzet/bulan (rata-rata) | ±Rp45 juta |
| Biaya operasional klinik/bulan | ±Rp25,5 juta |
| Laba bersih/bulan | ±Rp19,3 juta |

### 6.2 Struktur Biaya Sistem — Model A (Build sebagai Capital) — *direkomendasikan*

**A. Biaya pengembangan (one-time / capital):**

| Item | Biaya |
|---|---|
| Pengembangan aplikasi (build) | Rp108.000.000 |
| Onboarding (deploy, migrasi, pelatihan) | Rp3.000.000 |
| **Total capital (Tahun 0)** | **Rp111.000.000** |

> Build dapat dicicil termin: DP 30% → MVP 40% → UAT 20% → Go-live 10%.

**B. Biaya operasional tahunan (HPP):**

| Komponen | Biaya/tahun |
|---|---|
| Domain (.id) | Rp200.000 |
| Cloud hosting | Rp2.400.000 |
| Database & storage terkelola | Rp1.800.000 |
| Backup & monitoring | Rp600.000 |
| Pemeliharaan & dukungan teknis | Rp3.600.000 |
| **Total HPP operasional** | **Rp8.600.000** |
| Langganan ke klinik (HPP + margin ±30%) | **±Rp11.200.000 / tahun** (≈Rp930rb/bln) |

**Langganan tahunan = ±2–2,5% dari omzet** → sangat terjangkau.

### 6.3 Total Cost of Ownership (TCO)

| Horizon | Model A (capital di muka + langganan) |
|---|---|
| Tahun 1 | Rp111jt + Rp11,2jt = **Rp122,2jt** |
| Tahun 2–5 (per tahun) | **Rp11,2jt/tahun** |
| TCO 5 tahun | Rp111jt + (5 × Rp11,2jt) = **±Rp167jt** |
| Rata-rata per tahun (5 thn) | **±Rp33,4jt/tahun** |

### 6.4 Estimasi Manfaat (ilustratif, konservatif)

| Sumber manfaat | Estimasi/tahun |
|---|---|
| Recapture follow-up & imunisasi via reminder (±3 kunjungan/bln × Rp150rb) | Rp5,4 juta |
| Pengurangan kerugian stok kadaluarsa (monitoring) | Rp3,6 juta |
| Pengurangan kebocoran billing (±1% omzet) | Rp5,4 juta |
| Efisiensi waktu dokumentasi (±9 jam/bln) | Tak langsung (kapasitas/kualitas) |
| **Manfaat terukur** | **±Rp14,4 juta/tahun** |

**Manfaat tak terukur (kualitatif, signifikan):** kepatuhan regulasi RME, citra profesional, kepuasan & retensi orang tua, transparansi manajerial, kesiapan tumbuh (multi-cabang / SATUSEHAT).

### 6.5 Analisis & Sensitivitas

- **Langganan operasional:** manfaat terukur (±Rp14,4jt) **menutup** biaya langganan (±Rp11,2jt) → **net positif** pada operasi tahunan. **Layak.**
- **Biaya build Rp108jt (klien tunggal):** jika dinilai murni dari manfaat terukur, payback capital lambat. **Justifikasi utama bersifat strategis & regulatori** (RME kini diwajibkan), bukan semata efisiensi.
- **Opsi memperbaiki ekonomi build:**
  1. **Turunkan scope build** untuk skala solo (MVP fokus bisa < Rp108jt).
  2. **Model produk multi-klinik** → amortisasi build per klinik kecil (±Rp2,2jt/thn), harga jual tetap ±Rp14,4jt/thn dengan margin sehat. (Ini jalur paling menarik secara bisnis bagi pengembang.)
  3. **Perlakukan build sebagai capital** (Model A) dan fokuskan justifikasi pada kepatuhan + pertumbuhan.

---

## 7. Kelayakan Jadwal (Schedule Feasibility) — ✅ Layak

| Fase | Durasi | Output |
|---|---|---|
| Analisis & desain | 2–3 minggu | Requirement final, desain UI, skema data |
| Pengembangan MVP | 6–8 minggu | Modul inti + database + autentikasi |
| UAT & implementasi | 2 minggu | Uji terima, perbaikan, migrasi data |
| Pelatihan & go-live | 1 minggu | Pelatihan staf, peluncuran |
| **Total** | **±2,5–3 bulan** | Sistem operasional |

---

## 8. Kelayakan Hukum & Kepatuhan (Legal/Compliance) — ⚠️ Bersyarat

| Regulasi | Relevansi | Tindakan |
|---|---|---|
| Permenkes No. 24/2022 — Rekam Medis Elektronik | RME diwajibkan bagi fasyankes | Sistem ini **mendukung** pemenuhan; perlu validasi fitur RME final |
| UU No. 27/2022 — Pelindungan Data Pribadi (PDP) | Data pasien = data pribadi/sensitif | Wajib enkripsi, kontrol akses, persetujuan, kebijakan retensi, audit log |
| SATUSEHAT (Kemenkes) | Interoperabilitas nasional | Kesiapan HL7 FHIR (Fase 2) |
| Kerahasiaan rekam medis | Etik & hukum | RBAC, audit trail, pembatasan akses per peran |

**Catatan penting:** prototype saat ini **belum** memenuhi kepatuhan produksi (tanpa autentikasi/enkripsi nyata). Hardening kepatuhan **wajib** sebelum memakai data pasien sungguhan. Verifikasi regulatori final disarankan bersama konsultan hukum kesehatan.

---

## 9. Analisis Risiko & Mitigasi

| Risiko | Dampak | Prob. | Mitigasi |
|---|---|---|---|
| Adopsi staf rendah / resistensi | Sedang | Sedang | Pelatihan, SOP, desain low-click, pendampingan awal |
| Disiplin input data kurang | Sedang | Sedang | Validasi form, indikator kelengkapan, kebiasaan harian |
| Biaya build berat untuk 1 klinik | Tinggi | Sedang | Model A (capital/cicil), turunkan scope, atau model produk |
| Kepatuhan PDP/RME belum siap | Tinggi | Tinggi (jika diabaikan) | Hardening keamanan sebelum data nyata; audit kepatuhan |
| Ketergantungan pada 1 pengembang | Sedang | Sedang | Dokumentasi, kontrak pemeliharaan, kode rapi & terstruktur |
| Downtime hosting | Rendah | Rendah | SLA hosting, backup harian, monitoring |
| Perubahan regulasi (SATUSEHAT) | Sedang | Sedang | Arsitektur siap integrasi, roadmap Fase 2 |

---

## 10. Asumsi

- Volume pasien & keuangan mengikuti data ilustratif prototype (Jan–Jun 2026).
- Biaya hosting/infrastruktur memakai tarif lean Indonesia untuk 1 praktik trafik rendah.
- Build cost Rp108jt sesuai nilai kontrak pengembangan yang diberikan; dapat di-rescope.
- Margin layanan ±30%; horizon analisis 5 tahun.
- Manfaat terukur bersifat konservatif & ilustratif.

---

## 11. Kesimpulan & Rekomendasi

**Putusan: GO (Layak dilanjutkan) — dengan syarat.**

1. **Adopsi Model A** — perlakukan biaya build sebagai *capital* (boleh dicicil termin), lalu langganan operasional ringan **±Rp11–14jt/tahun**. Ini paling sehat untuk praktik solo.
2. **Operasi tahunan layak secara ekonomi** — manfaat terukur menutup biaya langganan, dengan manfaat strategis/kepatuhan yang besar.
3. **Wajib hardening kepatuhan** (PDP + RME + keamanan) sebelum memakai data pasien nyata.
4. **Pertimbangkan jalur model produk multi-klinik** agar biaya build terbagi dan margin pengembang lebih sehat — sekaligus membuka peluang pertumbuhan.
5. **Implementasi bertahap**: MVP → stabilisasi → Fase 2 (WhatsApp, SATUSEHAT).

**Justifikasi inti:** kebutuhan kepatuhan RME yang kini diwajibkan, peningkatan kualitas & efisiensi layanan, transparansi manajerial, dan kesiapan tumbuh — menjadikan proyek ini bernilai strategis melampaui sekadar penghematan biaya jangka pendek.

---

*Dokumen ini bagian dari prototype portofolio dan menggunakan data dummy. Bukan nasihat finansial, hukum, atau medis profesional.*
