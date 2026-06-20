import { Reminder } from "./types";
import { CLINIC_NAME } from "./users";

export const reminders: Reminder[] = [
  {
    id: "REM-01",
    patientName: "Arka Mahendra",
    parentName: "Bapak Yoga Pratama",
    parentPhone: "0813-2233-4455",
    type: "Pengingat Imunisasi",
    dueDate: "2026-08-30",
    status: "Pending",
    note: "Imunisasi DPT-HB-Hib lanjutan.",
  },
  {
    id: "REM-02",
    patientName: "Daffa Pratama",
    parentName: "Ibu Rahmawati",
    parentPhone: "0856-1122-3344",
    type: "Pengingat Kontrol",
    dueDate: "2026-06-13",
    status: "Siap Dihubungi",
    note: "Kontrol pasca diare.",
  },
  {
    id: "REM-03",
    patientName: "Zoya Aulia",
    parentName: "Ibu Putri Maharani",
    parentPhone: "0857-3344-5566",
    type: "Pengingat Imunisasi",
    dueDate: "2026-07-20",
    status: "Pending",
    note: "Imunisasi campak/MR lanjutan.",
  },
  {
    id: "REM-04",
    patientName: "Rania Putri",
    parentName: "Ibu Sinta Wulandari",
    parentPhone: "0812-3456-7890",
    type: "Pengingat Lanjutan Obat",
    dueDate: "2026-06-17",
    status: "Sudah Dihubungi Manual",
    note: "Evaluasi keluhan demam dan batuk.",
  },
  {
    id: "REM-05",
    patientName: "Bima Aditya",
    parentName: "Ibu Lestari Ningsih",
    parentPhone: "0813-9988-7766",
    type: "Pengingat Kontrol",
    dueDate: "2026-06-26",
    status: "Pending",
    note: "Kontrol rutin tumbuh kembang.",
  },
];

// Builds the manual WhatsApp message template (admin copies & sends manually).
export function buildWhatsAppMessage(r: {
  parentName: string;
  patientName: string;
  type: string;
  dueDate: string;
}): string {
  const date = new Date(r.dueDate).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `Selamat pagi Bapak/Ibu ${r.parentName}, ini pengingat dari ${CLINIC_NAME} bahwa ${r.patientName} memiliki jadwal ${r.type} pada ${date}. Terima kasih.`;
}
