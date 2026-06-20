// Public-facing practice profile content for dr. Aisyah's website (dummy).
import { CLINIC_NAME, DOCTOR_NAME } from "./users";

export const practice = {
  clinicName: CLINIC_NAME,
  doctorName: DOCTOR_NAME,
  doctorRole: "Dokter Praktik Anak",
  tagline: "Praktik dokter anak yang ramah, cepat, dan terpercaya.",
  intro:
    "Memberikan pelayanan kesehatan anak dengan pendekatan hangat dan komunikatif — mulai dari konsultasi, imunisasi, hingga pemantauan tumbuh kembang — dalam suasana yang nyaman bagi anak dan orang tua.",
  // Dummy contact — bukan nomor/alamat asli.
  whatsapp: "0812-3456-7890",
  phone: "(0274) 123-456",
  email: "praktik.draisyah@contoh.id",
  address: "Jl. Melati No. 12, Caturtunggal, Depok, Sleman, Yogyakarta",
  mapsHint: "Dekat Jl. Kaliurang KM 5 (lokasi ilustratif)",
};

export const heroStats: { label: string; value: string }[] = [
  { label: "Pasien anak dilayani", value: "1.300+" },
  { label: "Tahun pengalaman", value: "8+" },
  { label: "Rating orang tua", value: "4.9/5" },
];

export const services: { icon: string; title: string; desc: string }[] = [
  {
    icon: "🩺",
    title: "Konsultasi Anak",
    desc: "Pemeriksaan keluhan umum anak seperti demam, batuk-pilek, diare, dan alergi.",
  },
  {
    icon: "💉",
    title: "Imunisasi",
    desc: "Imunisasi dasar dan lanjutan sesuai jadwal, dengan pencatatan yang rapi.",
  },
  {
    icon: "📈",
    title: "Pemantauan Tumbuh Kembang (KMS)",
    desc: "Pemantauan berat & tinggi badan terhadap usia dengan kurva pertumbuhan.",
  },
  {
    icon: "🔁",
    title: "Kontrol & Tindak Lanjut",
    desc: "Kontrol ulang pasca sakit dan pengingat jadwal kunjungan berikutnya.",
  },
  {
    icon: "📄",
    title: "Surat Sehat / Sakit Anak",
    desc: "Penerbitan surat keterangan sehat atau sakit untuk keperluan sekolah.",
  },
  {
    icon: "👶",
    title: "Edukasi Orang Tua",
    desc: "Konsultasi nutrisi, pola asuh, dan kesehatan harian anak.",
  },
];

export const schedule: { day: string; hours: string; closed?: boolean }[] = [
  { day: "Senin", hours: "16.00 – 20.00" },
  { day: "Selasa", hours: "16.00 – 20.00" },
  { day: "Rabu", hours: "16.00 – 20.00" },
  { day: "Kamis", hours: "16.00 – 20.00" },
  { day: "Jumat", hours: "16.00 – 20.00" },
  { day: "Sabtu", hours: "09.00 – 13.00" },
  { day: "Minggu", hours: "Tutup", closed: true },
];

export const faqs: { q: string; a: string }[] = [
  {
    q: "Apakah harus mendaftar dulu sebelum datang?",
    a: "Disarankan mendaftar online via WhatsApp agar mendapat nomor antrean dan mengurangi waktu tunggu. Pasien datang langsung (offline) tetap dilayani.",
  },
  {
    q: "Apa saja yang perlu dibawa saat kunjungan?",
    a: "Bawa buku KIA/KMS anak (bila ada), catatan imunisasi sebelumnya, dan daftar keluhan. Untuk kontrol, bawa resep/obat dari kunjungan terakhir.",
  },
  {
    q: "Bagaimana sistem antreannya?",
    a: "Antrean menggabungkan pasien online dan offline secara adil. Pasien online mendapat estimasi waktu agar tidak menunggu terlalu lama.",
  },
  {
    q: "Apakah melayani imunisasi lengkap?",
    a: "Ya, imunisasi dasar dan lanjutan tersedia sesuai jadwal. Tim akan mengingatkan jadwal imunisasi berikutnya.",
  },
];

// Builds the WhatsApp pre-filled registration message (manual, no API).
export function buildRegistrationMessage(opts: {
  parentName: string;
  childName: string;
  service: string;
  preferredDate: string;
}): string {
  return `Halo, saya ${opts.parentName} ingin mendaftar kunjungan untuk anak saya ${opts.childName}.\nLayanan: ${opts.service}\nTanggal diinginkan: ${opts.preferredDate}\nTerima kasih.`;
}
