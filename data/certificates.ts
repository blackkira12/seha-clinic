import { Certificate } from "./types";

// Certificates are for children only — no occupation ("pekerjaan") field.
export const certificates: Certificate[] = [
  {
    id: "CERT-01",
    type: "Surat Keterangan Sakit",
    patientName: "Rayyan Hafiz",
    ageLabel: "7 tahun 9 bulan",
    parentName: "Bapak Hendra Saputra",
    examinationDate: "2026-06-02",
    purpose: "Izin tidak masuk sekolah",
    restRecommendation: "Istirahat selama 2 (dua) hari.",
    doctorNotes: "Demam, dianjurkan istirahat dan banyak minum.",
  },
  {
    id: "CERT-02",
    type: "Surat Keterangan Sehat",
    patientName: "Naya Kirana",
    ageLabel: "6 tahun 11 bulan",
    parentName: "Ibu Dewi Anggraini",
    examinationDate: "2026-06-01",
    purpose: "Persyaratan pendaftaran sekolah",
    restRecommendation: "",
    doctorNotes: "Kondisi umum baik, dinyatakan sehat.",
  },
];
