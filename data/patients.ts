import { Patient } from "./types";

// 8 fictional pediatric patients. Dummy data only — no real persons.
export const patients: Patient[] = [
  {
    id: "SEHA-0001",
    name: "Rania Putri",
    dateOfBirth: "2021-03-14",
    ageLabel: "5 tahun 3 bulan",
    gender: "P",
    parentName: "Ibu Sinta Wulandari",
    parentPhone: "0812-3456-7890",
    address: "Jl. Melati No. 12, Yogyakarta",
    allergyNotes: "Alergi amoxicillin (ruam ringan)",
    reminderPreference: "WhatsApp",
    visitHistory: [
      { date: "2026-04-10", visitType: "Konsultasi Umum", summary: "Batuk pilek, diberi terapi simtomatik." },
      { date: "2026-01-22", visitType: "Kontrol Ulang", summary: "Kontrol pasca demam, kondisi membaik." },
    ],
    immunizationHistory: [
      { name: "DPT-HB-Hib 3", date: "2021-09-14" },
      { name: "Campak / MR", date: "2022-03-14" },
    ],
  },
  {
    id: "SEHA-0002",
    name: "Arka Mahendra",
    dateOfBirth: "2024-11-02",
    ageLabel: "1 tahun 7 bulan",
    gender: "L",
    parentName: "Bapak Yoga Pratama",
    parentPhone: "0813-2233-4455",
    address: "Jl. Kenanga No. 4, Sleman",
    allergyNotes: "Tidak ada alergi yang diketahui",
    reminderPreference: "WhatsApp",
    visitHistory: [
      { date: "2026-05-30", visitType: "Imunisasi", summary: "Imunisasi DPT-HB-Hib lanjutan." },
    ],
    immunizationHistory: [
      { name: "BCG", date: "2024-11-30" },
      { name: "Polio 1", date: "2024-12-28" },
      { name: "DPT-HB-Hib 1", date: "2025-01-25" },
    ],
  },
  {
    id: "SEHA-0003",
    name: "Naya Kirana",
    dateOfBirth: "2019-07-19",
    ageLabel: "6 tahun 11 bulan",
    gender: "P",
    parentName: "Ibu Dewi Anggraini",
    parentPhone: "0852-7788-9900",
    address: "Jl. Anggrek No. 8, Bantul",
    allergyNotes: "Alergi debu (rhinitis ringan)",
    reminderPreference: "Telepon",
    visitHistory: [
      { date: "2026-06-01", visitType: "Surat Sehat", summary: "Pemeriksaan untuk keperluan sekolah." },
      { date: "2025-12-15", visitType: "Konsultasi Umum", summary: "Demam ringan, terapi simtomatik." },
    ],
    immunizationHistory: [
      { name: "Campak / MR", date: "2020-07-19" },
      { name: "MMR", date: "2021-01-19" },
    ],
  },
  {
    id: "SEHA-0004",
    name: "Daffa Pratama",
    dateOfBirth: "2022-09-05",
    ageLabel: "3 tahun 9 bulan",
    gender: "L",
    parentName: "Ibu Rahmawati",
    parentPhone: "0856-1122-3344",
    address: "Jl. Mawar No. 21, Yogyakarta",
    allergyNotes: "Tidak ada alergi yang diketahui",
    reminderPreference: "WhatsApp",
    visitHistory: [
      { date: "2026-06-10", visitType: "Konsultasi Umum", summary: "Diare ringan, edukasi rehidrasi oral." },
    ],
    immunizationHistory: [
      { name: "DPT-HB-Hib 3", date: "2023-03-05" },
      { name: "Campak / MR", date: "2023-09-05" },
    ],
  },
  {
    id: "SEHA-0005",
    name: "Keisha Ramadhani",
    dateOfBirth: "2020-12-25",
    ageLabel: "5 tahun 5 bulan",
    gender: "P",
    parentName: "Bapak Faisal Ramadhani",
    parentPhone: "0878-4455-6677",
    address: "Jl. Flamboyan No. 3, Sleman",
    allergyNotes: "Alergi seafood (gatal)",
    reminderPreference: "SMS",
    visitHistory: [
      { date: "2026-03-18", visitType: "Kontrol Ulang", summary: "Kontrol asma ringan, stabil." },
    ],
    immunizationHistory: [
      { name: "DPT-HB-Hib 3", date: "2021-06-25" },
      { name: "MMR", date: "2022-06-25" },
    ],
  },
  {
    id: "SEHA-0006",
    name: "Bima Aditya",
    dateOfBirth: "2023-02-11",
    ageLabel: "3 tahun 4 bulan",
    gender: "L",
    parentName: "Ibu Lestari Ningsih",
    parentPhone: "0813-9988-7766",
    address: "Jl. Cempaka No. 15, Bantul",
    allergyNotes: "Tidak ada alergi yang diketahui",
    reminderPreference: "WhatsApp",
    visitHistory: [
      { date: "2026-05-12", visitType: "Imunisasi", summary: "Imunisasi lanjutan sesuai jadwal." },
    ],
    immunizationHistory: [
      { name: "DPT-HB-Hib 3", date: "2023-08-11" },
      { name: "Campak / MR", date: "2024-02-11" },
    ],
  },
  {
    id: "SEHA-0007",
    name: "Zoya Aulia",
    dateOfBirth: "2025-01-20",
    ageLabel: "1 tahun 5 bulan",
    gender: "P",
    parentName: "Ibu Putri Maharani",
    parentPhone: "0857-3344-5566",
    address: "Jl. Dahlia No. 9, Yogyakarta",
    allergyNotes: "Tidak ada alergi yang diketahui",
    reminderPreference: "WhatsApp",
    visitHistory: [
      { date: "2026-06-15", visitType: "Imunisasi", summary: "Imunisasi campak/MR." },
    ],
    immunizationHistory: [
      { name: "BCG", date: "2025-02-17" },
      { name: "Polio 1", date: "2025-03-17" },
    ],
  },
  {
    id: "SEHA-0008",
    name: "Rayyan Hafiz",
    dateOfBirth: "2018-08-30",
    ageLabel: "7 tahun 9 bulan",
    gender: "L",
    parentName: "Bapak Hendra Saputra",
    parentPhone: "0812-6677-8899",
    address: "Jl. Teratai No. 7, Sleman",
    allergyNotes: "Alergi penisilin",
    reminderPreference: "Telepon",
    visitHistory: [
      { date: "2026-06-02", visitType: "Surat Sakit", summary: "Demam, istirahat 2 hari direkomendasikan." },
      { date: "2026-02-14", visitType: "Konsultasi Umum", summary: "Faringitis, terapi simtomatik." },
    ],
    immunizationHistory: [
      { name: "Campak / MR", date: "2019-08-30" },
      { name: "MMR", date: "2020-02-29" },
    ],
  },
];

export function getPatientById(id: string) {
  return patients.find((p) => p.id === id);
}
