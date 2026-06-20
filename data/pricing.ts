import { PricingPackage } from "./types";

export const PRICING_DISCLAIMER =
  "Harga adalah estimasi internal untuk bahan diskusi dan harus disesuaikan dengan ruang lingkup final, hosting, dukungan, integrasi, dan kebutuhan pemeliharaan.";

// === Biaya pengembangan (CAPITAL / one-time) ===
// Ini adalah biaya MEMBANGUN aplikasi (kontrak pengembangan), BUKAN biaya yang
// dibayar klinik per tahun untuk MEMAKAI aplikasi. Nilai ini diamortisasi ke
// banyak klinik pada model produk/lisensi.
export const BUILD_COST = 108000000;
export const BUILD_COST_NOTE =
  "Biaya pengembangan aplikasi (one-time, capital project): analisis kebutuhan, desain, pengembangan modul inti, implementasi, dan pelatihan awal. Ini BUKAN tarif tahunan yang dibayar klinik — melainkan biaya membangun produk yang diamortisasi ke banyak klinik pengguna.";
// Termin pembayaran milestone untuk proyek pengembangan (jumlah = BUILD_COST).
export const buildMilestones: { label: string; percent: number; amount: number }[] = [
  { label: "Down Payment (kick-off & analisis)", percent: 30, amount: 32400000 },
  { label: "Pengembangan modul inti (MVP)", percent: 40, amount: 43200000 },
  { label: "UAT, implementasi & pelatihan", percent: 20, amount: 21600000 },
  { label: "Go-live & serah terima", percent: 10, amount: 10800000 },
];

// === Harga langganan tahunan untuk KLINIK (operasional) ===
// Model cost-plus: HPP operasional per tahun + margin sehat, tetap kompetitif
// untuk praktik mandiri solo.
export interface CostLine {
  component: string;
  annual: number;
  note?: string;
}

export const annualCostModel: CostLine[] = [
  { component: "Domain (.id, 1 tahun)", annual: 200000 },
  { component: "Cloud hosting (server aplikasi)", annual: 2400000, note: "VPS kecil / Vercel" },
  { component: "Database & storage terkelola", annual: 1800000 },
  { component: "Backup & monitoring", annual: 600000 },
  { component: "Pemeliharaan teknis & update minor", annual: 3600000 },
  { component: "Amortisasi pengembangan (alokasi model produk)", annual: 2200000, note: "Build dibagi ke banyak klinik" },
];

export const ANNUAL_HPP = annualCostModel.reduce((s, c) => s + c.annual, 0); // 10.800.000

// HPP operasional MURNI (infra + pemeliharaan) — TANPA amortisasi pengembangan.
// Dipakai untuk model klien tunggal (satu praktik mandiri), di mana biaya build
// dihitung terpisah, bukan dibagi ke banyak klinik.
export const OPERATIONAL_HPP = annualCostModel
  .filter((c) => !c.component.toLowerCase().includes("amortisasi"))
  .reduce((s, c) => s + c.annual, 0); // 8.600.000
export const ANNUAL_MARGIN_PCT = 33;
export const RECOMMENDED_ANNUAL = 14400000; // ≈ HPP + 33% margin, dibulatkan
export const ANNUAL_FLOOR = 12000000; // lantai, margin tipis
export const ANNUAL_PREMIUM = 18000000; // termasuk paket support premium
export const ONBOARDING_FEE = 3000000; // sekali, deploy + migrasi + pelatihan
export const ANNUAL_PRICE_NOTE =
  "Harga langganan tahunan all-in untuk klinik: hosting, domain, pemeliharaan, dukungan, dan update minor. Dihitung cost-plus dari HPP operasional + margin sehat, dan tetap kompetitif untuk praktik mandiri solo.";

export const pricingPackages: PricingPackage[] = [
  {
    id: "PKG-1",
    name: "Paket 1: Pilot MVP",
    tagline: "Direkomendasikan untuk implementasi pertama.",
    recommended: true,
    features: [
      "Registry pasien",
      "Manajemen antrean",
      "SOAP dokter",
      "Vitals perawat",
      "Laporan PDF",
      "Surat sehat/sakit",
      "Inventory dasar",
      "Reminder center manual",
      "Dashboard berbasis peran",
    ],
    setupFeeMin: 8000000,
    setupFeeMax: 15000000,
    monthlyMin: 500000,
    monthlyMax: 1500000,
    customQuote: false,
  },
  {
    id: "PKG-2",
    name: "Paket 2: Operational MVP",
    tagline: "Direkomendasikan jika klinik ingin penggunaan operasional lebih kuat.",
    recommended: false,
    features: [
      "Pergerakan stok inventory lebih baik",
      "Peringatan kadaluarsa lanjutan",
      "Arsip laporan",
      "Pengaturan akses pengguna",
      "Pelatihan & dokumentasi",
      "Kebijakan backup dasar",
    ],
    setupFeeMin: 15000000,
    setupFeeMax: 30000000,
    monthlyMin: 1000000,
    monthlyMax: 2500000,
    customQuote: false,
  },
  {
    id: "PKG-3",
    name: "Paket 3: Phase 2 Automation",
    tagline: "Fase masa depan saja.",
    recommended: false,
    features: [
      "Integrasi WhatsApp",
      "Kesiapan integrasi SATUSEHAT",
      "Janji temu online",
      "Billing & kasir",
      "Audit log",
      "Cloud backup",
      "Dashboard analitik lanjutan",
    ],
    setupFeeMin: null,
    setupFeeMax: null,
    monthlyMin: null,
    monthlyMax: null,
    customQuote: true,
  },
];

export function formatRupiah(value: number): string {
  return "Rp" + value.toLocaleString("id-ID");
}
