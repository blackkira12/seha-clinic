"use client";

import Link from "next/link";
import {
  practice,
  heroStats,
  services,
  schedule,
  faqs,
} from "@/data/practice";
import Navbar from "@/components/public/Navbar";
import Faq from "@/components/public/Faq";
import RegistrationForm from "@/components/public/RegistrationForm";

// Convert "0812-3456-7890" -> "6281234567890" (strip non-digits, leading 0 -> 62).
function toWaNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.startsWith("0") ? "62" + digits.slice(1) : digits;
}

const WA_NUMBER = toWaNumber(practice.whatsapp);
const WA_GREETING =
  "Halo, saya ingin bertanya / mendaftar kunjungan di " + practice.clinicName + ".";
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_GREETING)}`;

const aboutHighlights = [
  { icon: "🤝", text: "Pendekatan ramah anak" },
  { icon: "🗂️", text: "Dokumentasi rapi" },
  { icon: "🔔", text: "Pengingat jadwal kunjungan" },
];

export default function ProfilPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Navbar waLink={WA_LINK} />

      {/* ===== HERO ===== */}
      <section
        id="beranda"
        className="bg-gradient-to-br from-brand-600 to-brand-700 text-white"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:py-20 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
              👶 {practice.doctorRole}
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
              {practice.clinicName}
            </h1>
            <p className="mt-2 text-lg font-medium text-brand-100">
              {practice.doctorName} · {practice.doctorRole}
            </p>
            <p className="mt-4 text-xl font-semibold text-white/95">
              {practice.tagline}
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-brand-100">
              {practice.intro}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-brand-700 shadow-sm transition-colors hover:bg-brand-50"
              >
                Daftar via WhatsApp
              </a>
              <a
                href="#jadwal"
                className="rounded-xl border border-white/40 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Lihat Jadwal
              </a>
            </div>

            {/* Stat chips */}
            <div className="mt-9 grid grid-cols-3 gap-3">
              {heroStats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl bg-white/10 px-3 py-4 text-center backdrop-blur-sm"
                >
                  <p className="text-xl font-bold sm:text-2xl">{s.value}</p>
                  <p className="mt-1 text-[11px] leading-tight text-brand-100">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Friendly illustrative element */}
          <div className="hidden justify-center lg:flex">
            <div className="relative flex h-72 w-72 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
              <span className="text-[7rem]" aria-hidden="true">
                👩‍⚕️
              </span>
              <span className="absolute -right-2 top-6 rounded-2xl bg-white px-3 py-2 text-2xl shadow-lg">
                🩺
              </span>
              <span className="absolute -left-3 bottom-10 rounded-2xl bg-white px-3 py-2 text-2xl shadow-lg">
                👶
              </span>
              <span className="absolute bottom-0 right-8 rounded-2xl bg-white px-3 py-2 text-2xl shadow-lg">
                💉
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TENTANG ===== */}
      <section id="tentang" className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            eyebrow="Tentang Dokter"
            title="Mengenal dr. Aisyah Fikritama, S.A."
          />
          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[auto,1fr]">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-brand-100 text-5xl">
                👩‍⚕️
              </div>
              <p className="mt-4 text-base font-bold text-gray-800">
                {practice.doctorName}
              </p>
              <p className="text-sm text-brand-700">{practice.doctorRole}</p>
            </div>

            <div className="rounded-2xl border border-brand-100 bg-brand-50/30 p-6 sm:p-8">
              <p className="text-sm leading-relaxed text-gray-700">
                dr. Aisyah dikenal hangat dan komunikatif dalam menemani tumbuh
                kembang anak. Ia berfokus mendengarkan keluhan orang tua, menjelaskan
                kondisi anak dengan bahasa yang mudah dipahami, dan membuat suasana
                pemeriksaan terasa nyaman bagi si kecil. Setiap kunjungan dicatat
                dengan rapi sehingga riwayat kesehatan anak mudah ditelusuri dari waktu
                ke waktu.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {aboutHighlights.map((h) => (
                  <div
                    key={h.text}
                    className="flex items-center gap-2.5 rounded-xl bg-white px-3.5 py-3 text-sm font-medium text-gray-700"
                  >
                    <span className="text-lg" aria-hidden="true">
                      {h.icon}
                    </span>
                    {h.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== LAYANAN ===== */}
      <section id="layanan" className="bg-brand-50/40 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            eyebrow="Layanan"
            title="Pelayanan kesehatan anak yang lengkap"
            center
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-2xl">
                  {s.icon}
                </div>
                <h3 className="mt-4 text-base font-bold text-gray-800">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== JADWAL ===== */}
      <section id="jadwal" className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <SectionHeading
            eyebrow="Jadwal Praktik"
            title="Hari & jam pelayanan"
            center
          />
          <div className="mt-8 overflow-hidden rounded-2xl border border-brand-100">
            <ul className="divide-y divide-brand-100">
              {schedule.map((row) => (
                <li
                  key={row.day}
                  className={`flex items-center justify-between px-5 py-3.5 text-sm ${
                    row.closed ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <span
                    className={`font-medium ${
                      row.closed ? "text-gray-400" : "text-gray-800"
                    }`}
                  >
                    {row.day}
                  </span>
                  <span
                    className={
                      row.closed
                        ? "text-gray-400"
                        : "font-semibold text-brand-700"
                    }
                  >
                    {row.hours}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 text-center text-xs text-gray-500">
            Pasien yang mendaftar online mendapat estimasi waktu agar tidak menunggu
            terlalu lama.
          </p>
        </div>
      </section>

      {/* ===== LOKASI ===== */}
      <section id="lokasi" className="bg-brand-50/40 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            eyebrow="Lokasi & Kontak"
            title="Temukan dan hubungi kami"
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {/* Contact details */}
            <div className="rounded-2xl border border-brand-100 bg-white p-6 sm:p-8">
              <div>
                <ContactRow icon="📍" label="Alamat">
                  <p>{practice.address}</p>
                  <p className="mt-1 text-xs text-gray-500">{practice.mapsHint}</p>
                </ContactRow>
                <ContactRow icon="📞" label="Telepon">
                  <p>{practice.phone}</p>
                </ContactRow>
                <ContactRow icon="✉️" label="Email">
                  <p>{practice.email}</p>
                </ContactRow>
                <ContactRow icon="💬" label="WhatsApp">
                  <p>{practice.whatsapp}</p>
                </ContactRow>
              </div>
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
              >
                Hubungi via WhatsApp
              </a>
            </div>

            {/* Map placeholder */}
            <div className="flex flex-col overflow-hidden rounded-2xl border border-brand-100 bg-white">
              <div className="flex flex-1 flex-col items-center justify-center bg-brand-50 px-6 py-12 text-center">
                <span className="text-5xl" aria-hidden="true">
                  📍
                </span>
                <p className="mt-4 max-w-xs text-sm font-medium text-gray-700">
                  {practice.address}
                </p>
                <p className="mt-1 text-xs text-gray-500">{practice.mapsHint}</p>
              </div>
              <div className="border-t border-brand-100 px-6 py-4">
                <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-400">
                  🗺️ Buka di Maps
                  <span className="text-[10px] font-normal text-gray-400">
                    (ilustratif)
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DAFTAR ===== */}
      <section id="daftar" className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            eyebrow="Pendaftaran Online"
            title="Daftar kunjungan lewat WhatsApp"
            center
          />
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-gray-600">
            Isi data berikut untuk membuat pesan WhatsApp siap kirim. Anda tetap bisa
            menyalin atau menyuntingnya sebelum mengirim.
          </p>
          <div className="mt-10">
            <RegistrationForm waNumber={WA_NUMBER} />
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="bg-brand-50/40 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            eyebrow="FAQ"
            title="Pertanyaan yang sering diajukan"
            center
          />
          <div className="mt-10">
            <Faq faqs={faqs} />
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white">
                S
              </span>
              <span className="text-sm font-bold text-white">
                {practice.clinicName}
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-gray-400">
              {practice.address}
            </p>
          </div>

          <div className="text-sm">
            <p className="font-semibold text-white">Kontak</p>
            <p className="mt-3 text-gray-400">📞 {practice.phone}</p>
            <p className="mt-1 text-gray-400">✉️ {practice.email}</p>
            <p className="mt-1 text-gray-400">💬 {practice.whatsapp}</p>
          </div>

          <div className="text-sm">
            <p className="font-semibold text-white">Navigasi</p>
            <div className="mt-3 flex flex-col gap-2">
              <a href="#layanan" className="text-gray-400 hover:text-white">
                Layanan
              </a>
              <a href="#jadwal" className="text-gray-400 hover:text-white">
                Jadwal Praktik
              </a>
              <a href="#daftar" className="text-gray-400 hover:text-white">
                Pendaftaran Online
              </a>
              <Link href="/" className="text-brand-300 hover:text-white">
                Login Staf →
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <p className="mx-auto max-w-6xl px-4 py-5 text-center text-[11px] text-gray-500">
            Website prototype menggunakan data dummy. Bukan untuk layanan medis nyata.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ---------- small presentational helpers ---------- */

function SectionHeading({
  eyebrow,
  title,
  center,
}: {
  eyebrow: string;
  title: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "text-center" : ""}>
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
        {eyebrow}
      </p>
      <h2 className="mt-1.5 text-2xl font-bold text-gray-800 sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}

function ContactRow({
  icon,
  label,
  children,
}: {
  icon: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-brand-50 py-3 last:border-b-0 first:pt-0">
      <span className="mt-0.5 text-lg" aria-hidden="true">
        {icon}
      </span>
      <div className="text-sm">
        <p className="font-semibold text-gray-800">{label}</p>
        <div className="mt-0.5 text-gray-600">{children}</div>
      </div>
    </div>
  );
}
