import { InventoryItem, CompoundedMedicine, InventoryStatus } from "./types";

// "Today" reference for expiry calculations in the prototype.
export const TODAY = "2026-06-19";

// Derive status from stock + expiry. Expiring soon = within 90 days.
export function deriveStatus(item: {
  currentStock: number;
  minimumStock: number;
  expiryDate: string;
}): InventoryStatus {
  const today = new Date(TODAY);
  const expiry = new Date(item.expiryDate);
  const days = Math.round((expiry.getTime() - today.getTime()) / 86400000);
  if (days < 0) return "Kadaluarsa";
  if (item.currentStock <= item.minimumStock) return "Stok Menipis";
  if (days <= 90) return "Akan Kadaluarsa";
  return "Aman";
}

export function daysUntilExpiry(expiryDate: string): number {
  const today = new Date(TODAY);
  const expiry = new Date(expiryDate);
  return Math.round((expiry.getTime() - today.getTime()) / 86400000);
}

const raw: Omit<InventoryItem, "status">[] = [
  {
    id: "INV-001",
    name: "Paracetamol Sirup",
    category: "Obat",
    currentStock: 24,
    minimumStock: 10,
    unit: "botol",
    batchNumber: "PCT-2405",
    expiryDate: "2027-05-01",
    supplier: "PT Kimia Farma",
  },
  {
    id: "INV-002",
    name: "Cetirizine Sirup",
    category: "Obat",
    currentStock: 8,
    minimumStock: 10,
    unit: "botol",
    batchNumber: "CTZ-2403",
    expiryDate: "2026-12-15",
    supplier: "PT Sanbe Farma",
  },
  {
    id: "INV-003",
    name: "Oralit (Garam Rehidrasi Oral)",
    category: "Obat",
    currentStock: 60,
    minimumStock: 20,
    unit: "sachet",
    batchNumber: "ORL-2501",
    expiryDate: "2027-09-01",
    supplier: "PT Phapros",
  },
  {
    id: "INV-004",
    name: "Vitamin D Drops",
    category: "Obat",
    currentStock: 15,
    minimumStock: 8,
    unit: "botol",
    batchNumber: "VTD-2406",
    expiryDate: "2026-08-20",
    supplier: "PT Soho Global",
  },
  {
    id: "INV-005",
    name: "Vaksin DPT-HB-Hib",
    category: "Vaksin / Imunisasi",
    currentStock: 12,
    minimumStock: 6,
    unit: "vial",
    batchNumber: "DPT-2502",
    expiryDate: "2026-07-30",
    supplier: "Bio Farma",
  },
  {
    id: "INV-006",
    name: "Vaksin MMR",
    category: "Vaksin / Imunisasi",
    currentStock: 4,
    minimumStock: 5,
    unit: "vial",
    batchNumber: "MMR-2410",
    expiryDate: "2026-10-10",
    supplier: "Bio Farma",
  },
  {
    id: "INV-007",
    name: "Alcohol Swab",
    category: "Bahan Habis Pakai",
    currentStock: 320,
    minimumStock: 100,
    unit: "pcs",
    batchNumber: "ALC-2411",
    expiryDate: "2028-01-01",
    supplier: "PT OneMed",
  },
  {
    id: "INV-008",
    name: "Syringe 1 ml",
    category: "Bahan Habis Pakai",
    currentStock: 90,
    minimumStock: 100,
    unit: "pcs",
    batchNumber: "SYR-2409",
    expiryDate: "2029-03-01",
    supplier: "PT OneMed",
  },
  {
    id: "INV-009",
    name: "Sarung Tangan Pemeriksaan",
    category: "Bahan Habis Pakai",
    currentStock: 150,
    minimumStock: 80,
    unit: "pasang",
    batchNumber: "GLV-2407",
    expiryDate: "2027-11-01",
    supplier: "PT Sensi Gloves",
  },
  {
    id: "INV-010",
    name: "Masker",
    category: "Bahan Habis Pakai",
    currentStock: 200,
    minimumStock: 100,
    unit: "pcs",
    batchNumber: "MSK-2404",
    expiryDate: "2026-05-30",
    supplier: "PT Sensi",
  },
  {
    id: "INV-011",
    name: "Serbuk Paket Obat Racik",
    category: "Bahan Obat Racik",
    currentStock: 35,
    minimumStock: 15,
    unit: "paket",
    batchNumber: "RCK-2412",
    expiryDate: "2026-09-05",
    supplier: "PT Kimia Farma",
  },
];

export const inventory: InventoryItem[] = raw.map((item) => ({
  ...item,
  status: deriveStatus(item),
}));

export const compoundedMedicines: CompoundedMedicine[] = [
  {
    id: "RCK-01",
    patientName: "Daffa Pratama",
    recipe: "Puyer batuk-pilek (campuran sesuai resep dokter — dummy).",
    status: "Sedang Diracik",
    preparedBy: "Apoteker Sari",
  },
  {
    id: "RCK-02",
    patientName: "Rania Putri",
    recipe: "Puyer penurun demam (campuran sesuai resep dokter — dummy).",
    status: "Menunggu",
    preparedBy: "Apoteker Sari",
  },
];
