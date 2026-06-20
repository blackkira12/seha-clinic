import { AccessMatrixRow } from "./types";

export const accessMatrix: AccessMatrixRow[] = [
  {
    role: "Admin",
    viewAccess: "Dashboard, antrean, pasien, laporan, reminder, inventory (lihat)",
    editAccess: "Registrasi, antrean, profil pasien, laporan PDF, sertifikat, reminder",
    restricted: "Pengaturan sistem developer",
  },
  {
    role: "Dokter",
    viewAccess: "Antrean, profil pasien, ketersediaan stok",
    editAccess: "SOAP, diagnosis (manual), berat/tinggi, instruksi obat, reminder",
    restricted: "Pengaturan sistem, edit inventory",
  },
  {
    role: "Perawat",
    viewAccess: "Antrean, SOAP dokter (read-only setelah submit)",
    editAccess: "Vitals, berat/tinggi, catatan awal, status antrean",
    restricted: "SOAP dokter (edit), inventory, pengaturan sistem",
  },
  {
    role: "Apoteker",
    viewAccess: "Instruksi obat dokter, antrean farmasi",
    editAccess: "Stok farmasi, inventory, status racik, status penyerahan obat",
    restricted: "SOAP dokter, pengaturan sistem",
  },
  {
    role: "Developer",
    viewAccess: "Seluruh modul (konfigurasi tingkat sistem)",
    editAccess: "Konfigurasi teknis & maintenance (ditampilkan sebagai peran saja)",
    restricted: "Tidak ada — akses tertinggi (tanpa backend nyata di prototype)",
  },
];
