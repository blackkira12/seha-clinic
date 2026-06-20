// Stock movement (pergerakan stok) — riwayat barang masuk/keluar/penyesuaian.
// Dummy data only.
export type MovementType = "Penerimaan" | "Pemakaian" | "Penyesuaian";

export interface StockMovement {
  id: string;
  date: string; // ISO date
  itemId: string;
  itemName: string;
  type: MovementType;
  qty: number; // positive number; direction implied by type (Pemakaian = keluar)
  note: string;
  by: string;
}

// Effect of a movement on current stock.
// Penerimaan = +qty, Pemakaian = -qty, Penyesuaian = set absolute to qty.
export function applyMovement(
  currentStock: number,
  type: MovementType,
  qty: number
): number {
  if (type === "Penerimaan") return currentStock + qty;
  if (type === "Pemakaian") return Math.max(0, currentStock - qty);
  return Math.max(0, qty); // Penyesuaian → nilai absolut
}

export const stockMovements: StockMovement[] = [
  {
    id: "MOV-001",
    date: "2026-06-19",
    itemId: "INV-009",
    itemName: "Sarung Tangan Pemeriksaan",
    type: "Pemakaian",
    qty: 12,
    note: "Pemakaian pemeriksaan pagi",
    by: "Perawat Rina",
  },
  {
    id: "MOV-002",
    date: "2026-06-19",
    itemId: "INV-007",
    itemName: "Alcohol Swab",
    type: "Pemakaian",
    qty: 20,
    note: "Tindakan imunisasi & injeksi",
    by: "Perawat Rina",
  },
  {
    id: "MOV-003",
    date: "2026-06-18",
    itemId: "INV-001",
    itemName: "Paracetamol Sirup",
    type: "Penerimaan",
    qty: 24,
    note: "Penerimaan dari PT Kimia Farma",
    by: "Apoteker Sari",
  },
  {
    id: "MOV-004",
    date: "2026-06-18",
    itemId: "INV-005",
    itemName: "Vaksin DPT-HB-Hib",
    type: "Pemakaian",
    qty: 2,
    note: "Imunisasi 2 pasien",
    by: "Apoteker Sari",
  },
  {
    id: "MOV-005",
    date: "2026-06-17",
    itemId: "INV-008",
    itemName: "Syringe 1 ml",
    type: "Pemakaian",
    qty: 10,
    note: "Pemakaian injeksi harian",
    by: "Perawat Rina",
  },
  {
    id: "MOV-006",
    date: "2026-06-17",
    itemId: "INV-003",
    itemName: "Oralit (Garam Rehidrasi Oral)",
    type: "Penerimaan",
    qty: 30,
    note: "Restock dari PT Phapros",
    by: "Apoteker Sari",
  },
  {
    id: "MOV-007",
    date: "2026-06-16",
    itemId: "INV-002",
    itemName: "Cetirizine Sirup",
    type: "Pemakaian",
    qty: 4,
    note: "Penyerahan resep alergi",
    by: "Apoteker Sari",
  },
  {
    id: "MOV-008",
    date: "2026-06-16",
    itemId: "INV-010",
    itemName: "Masker",
    type: "Penyesuaian",
    qty: 200,
    note: "Stock opname — penyesuaian fisik",
    by: "Apoteker Sari",
  },
];

export const movementTypes: MovementType[] = [
  "Penerimaan",
  "Pemakaian",
  "Penyesuaian",
];
