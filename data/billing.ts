// Kasir & Billing — simple cashier/invoice module (dummy data).
export type PaymentMethod = "Tunai" | "Transfer/QRIS" | "Asuransi" | "BPJS";
export type InvoiceStatus = "Belum Dibayar" | "Lunas" | "Sebagian";

export interface InvoiceLine {
  description: string;
  qty: number;
  unitPrice: number;
}

export interface Invoice {
  id: string; // INV-2026-0001
  date: string; // ISO date
  patientName: string;
  parentName: string;
  visitType: string;
  lines: InvoiceLine[];
  method: PaymentMethod;
  status: InvoiceStatus;
}

// Standard dummy tariff catalogue (admin/cashier can pick from these).
export const tariffCatalogue: InvoiceLine[] = [
  { description: "Jasa Konsultasi Dokter Anak", qty: 1, unitPrice: 150000 },
  { description: "Tindakan Imunisasi", qty: 1, unitPrice: 50000 },
  { description: "Vaksin DPT-HB-Hib", qty: 1, unitPrice: 250000 },
  { description: "Vaksin MMR", qty: 1, unitPrice: 350000 },
  { description: "Obat (Paracetamol Sirup)", qty: 1, unitPrice: 25000 },
  { description: "Obat Racik / Puyer", qty: 1, unitPrice: 40000 },
  { description: "Surat Keterangan Sehat/Sakit", qty: 1, unitPrice: 30000 },
  { description: "Administrasi", qty: 1, unitPrice: 15000 },
];

export const invoices: Invoice[] = [
  {
    id: "INV-2026-0001",
    date: "2026-06-19",
    patientName: "Arka Mahendra",
    parentName: "Bapak Yoga Pratama",
    visitType: "Imunisasi",
    lines: [
      { description: "Jasa Konsultasi Dokter Anak", qty: 1, unitPrice: 150000 },
      { description: "Tindakan Imunisasi", qty: 1, unitPrice: 50000 },
      { description: "Vaksin DPT-HB-Hib", qty: 1, unitPrice: 250000 },
      { description: "Administrasi", qty: 1, unitPrice: 15000 },
    ],
    method: "Tunai",
    status: "Lunas",
  },
  {
    id: "INV-2026-0002",
    date: "2026-06-19",
    patientName: "Daffa Pratama",
    parentName: "Ibu Rahmawati",
    visitType: "Konsultasi Umum",
    lines: [
      { description: "Jasa Konsultasi Dokter Anak", qty: 1, unitPrice: 150000 },
      { description: "Obat Racik / Puyer", qty: 1, unitPrice: 40000 },
      { description: "Obat (Oralit)", qty: 2, unitPrice: 8000 },
      { description: "Administrasi", qty: 1, unitPrice: 15000 },
    ],
    method: "Transfer/QRIS",
    status: "Belum Dibayar",
  },
  {
    id: "INV-2026-0003",
    date: "2026-06-19",
    patientName: "Rayyan Hafiz",
    parentName: "Bapak Hendra Saputra",
    visitType: "Surat Sakit",
    lines: [
      { description: "Jasa Konsultasi Dokter Anak", qty: 1, unitPrice: 150000 },
      { description: "Surat Keterangan Sehat/Sakit", qty: 1, unitPrice: 30000 },
      { description: "Administrasi", qty: 1, unitPrice: 15000 },
    ],
    method: "Tunai",
    status: "Lunas",
  },
];

export const paymentMethods: PaymentMethod[] = [
  "Tunai",
  "Transfer/QRIS",
  "Asuransi",
  "BPJS",
];

export function invoiceTotal(inv: { lines: InvoiceLine[] }): number {
  return inv.lines.reduce((sum, l) => sum + l.qty * l.unitPrice, 0);
}
