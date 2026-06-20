import PageHeader from "@/components/PageHeader";
import { complianceBadges, PRODUCT_TAGLINE } from "@/data/users";

// Modul prototype yang diselaraskan dengan modul produk SEHA (projectseha.com).
const sehaAlignment = [
  { module: "Dashboard Manajemen (SIM)", impl: "Analitik bulanan: kunjungan, keuangan, diagnosis, stok — disederhanakan untuk praktik mandiri" },
  { module: "Rekam Medis Elektronik (RME)", impl: "SOAP terstruktur + kode ICD-10 (input manual)" },
  { module: "KMS Digital Anak", impl: "Kurva pertumbuhan persentil (berat & tinggi terhadap usia)" },
  { module: "Manajemen Antrean", impl: "Antrean online/offline dengan aturan keadilan 2:1" },
  { module: "Farmasi & Inventori", impl: "Stok, obat racik, monitoring kadaluarsa & low-stock" },
  { module: "Kasir & Billing", impl: "Invoice, tarif, metode bayar, cetak kwitansi" },
  { module: "Ambience AI Scribe", impl: "Simulasi draft SOAP dari transkrip — wajib direview dokter" },
  { module: "Integrasi SATUSEHAT", impl: "Kesiapan integrasi (Fase 2) — readiness, bukan koneksi nyata" },
];

const skills = [
  "Business process analysis",
  "ERP/workflow design",
  "Requirement documentation",
  "Role-based access design",
  "Inventory process mapping",
  "Product implementation planning",
  "Healthcare operations understanding",
];

const businessValue = [
  "Mengurangi dokumentasi manual yang tersebar.",
  "Meningkatkan transparansi antrean.",
  "Mendukung alur pasien online/offline yang adil.",
  "Membantu memantau kadaluarsa obat dan vaksin.",
  "Mempermudah pembuatan laporan pasien.",
  "Mendukung ekspansi di masa depan (pengingat WhatsApp, integrasi SATUSEHAT).",
];

const solutions = [
  "Antrean pasien (online/offline)",
  "Catatan SOAP + kode ICD-10",
  "KMS Digital Anak (kurva pertumbuhan)",
  "Pemantauan inventory & farmasi",
  "Kasir & billing",
  "Laporan PDF & surat keterangan",
  "Ambience AI Scribe (simulasi)",
  "Reminder center manual",
];

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Tentang Proyek"
        description="Penjelasan portofolio untuk SEHA Clinic Operations System."
      />

      <section className="card space-y-2">
        <p className="card-title">Judul</p>
        <h2 className="text-xl font-bold text-brand-700">
          SEHA Clinic Operations System for Pediatric Private Practice
        </h2>
        <p className="text-sm text-gray-500">
          Prototype sistem operasional klinik untuk Praktik Mandiri dr. Aisyah
          Fikritama, S.A.
        </p>
      </section>

      <section className="card space-y-2">
        <h2 className="section-title">Masalah (Problem)</h2>
        <p className="text-sm text-gray-600">
          Klinik membutuhkan sistem sederhana untuk merapikan alur kerja harian — mulai
          dari registrasi, antrean, pemeriksaan, farmasi, pelaporan, hingga pengingat
          orang tua — tanpa kompleksitas yang tidak perlu.
        </p>
      </section>

      <section className="card space-y-3">
        <h2 className="section-title">Solusi (Solution)</h2>
        <p className="text-sm text-gray-600">
          Sistem operasional klinik dengan klik minimal (low-click) yang mencakup:
        </p>
        <ul className="grid grid-cols-1 gap-1.5 text-sm text-gray-700 sm:grid-cols-2">
          {solutions.map((s) => (
            <li key={s} className="flex items-start gap-2">
              <span className="mt-0.5 text-safe-text">✓</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card space-y-3">
        <h2 className="section-title">Nilai Bisnis (Business Value)</h2>
        <ul className="space-y-1.5 text-sm text-gray-700">
          {businessValue.map((v) => (
            <li key={v} className="flex items-start gap-2">
              <span className="mt-0.5 text-brand-600">•</span>
              <span>{v}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card space-y-2">
          <h2 className="section-title">Peran Fadhil</h2>
          <p className="text-sm text-gray-600">
            Business Analyst / Product &amp; Implementation Designer
          </p>
        </div>

        <div className="card space-y-3">
          <h2 className="section-title">Skills Demonstrated</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span
                key={s}
                className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="card space-y-3">
        <h2 className="section-title">Penyelarasan dengan Platform SEHA</h2>
        <p className="text-sm text-gray-600">
          Modul prototype diselaraskan dengan modul produk SEHA — “{PRODUCT_TAGLINE}”.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-400">
                <th className="py-2 pr-4 font-medium">Modul SEHA</th>
                <th className="py-2 font-medium">Implementasi Prototype</th>
              </tr>
            </thead>
            <tbody>
              {sehaAlignment.map((row) => (
                <tr key={row.module} className="border-b border-gray-50">
                  <td className="py-2 pr-4 font-medium text-gray-700">{row.module}</td>
                  <td className="py-2 text-gray-600">{row.impl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {complianceBadges.map((b) => (
            <span
              key={b.label}
              title={b.note}
              className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700"
            >
              {b.label}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-400">
          Catatan: badge kepatuhan & integrasi menunjukkan kesiapan/acuan standar pada
          prototype, bukan sertifikasi atau koneksi nyata.
        </p>
      </section>

      <section className="rounded-2xl border border-warn-border bg-warn-bg px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-warn-text">
          Disclaimer
        </p>
        <p className="mt-1 text-sm text-warn-text">
          Ini adalah prototype non-produksi dengan data dummy untuk keperluan demonstrasi
          portofolio. Bukan sistem rekam medis tersertifikasi dan tidak digunakan untuk
          layanan pasien sesungguhnya.
        </p>
      </section>
    </div>
  );
}
