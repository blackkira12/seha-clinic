import { StaffUser } from "./types";

// Dummy staff accounts — role switcher only, no real authentication.
export const users: StaffUser[] = [
  {
    id: "U-ADM",
    name: "Admin Klinik",
    role: "admin",
    roleLabel: "Admin",
    initials: "AK",
  },
  {
    id: "U-DOC",
    name: "dr. Aisyah Fikritama, S.A.",
    role: "doctor",
    roleLabel: "Dokter",
    initials: "AF",
  },
  {
    id: "U-NUR",
    name: "Perawat Rina",
    role: "nurse",
    roleLabel: "Perawat",
    initials: "PR",
  },
  {
    id: "U-PHA",
    name: "Apoteker Sari",
    role: "pharmacist",
    roleLabel: "Apoteker",
    initials: "AS",
  },
  {
    id: "U-DEV",
    name: "Developer SEHA",
    role: "developer",
    roleLabel: "Developer",
    initials: "DS",
  },
];

export const CLINIC_NAME = "Praktik Mandiri dr. Aisyah Fikritama, S.A.";
export const DOCTOR_NAME = "dr. Aisyah Fikritama, S.A.";

export const PRODUCT_NAME = "SEHA";
export const PRODUCT_TAGLINE = "Kembalikan Waktu Dokter untuk Pasien";
export const PRODUCT_VALUE_PROP =
  "Fokus pada pelayanan pasien tanpa beban administrasi. Kelola rekam medis, operasional klinik, dan kesiapan integrasi SATUSEHAT dalam satu platform yang mudah digunakan.";

// Compliance & integration readiness badges (status: prototype readiness only).
export const complianceBadges: { label: string; note: string }[] = [
  { label: "SATUSEHAT Ready", note: "Siap integrasi SATUSEHAT Kemenkes RI (Fase 2)" },
  { label: "HL7 FHIR v4.0.1", note: "Acuan standar interoperabilitas" },
  { label: "SNOMED CT", note: "Acuan terminologi klinis" },
  { label: "Patuh UU PDP", note: "Mengacu UU No. 27/2022 Perlindungan Data Pribadi" },
];

export function getUserByRole(role: string) {
  return users.find((u) => u.role === role);
}
