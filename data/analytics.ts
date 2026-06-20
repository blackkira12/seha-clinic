// Aggregated management analytics (dummy). Powers the management dashboard
// so the practice owner (dokter) can see monthly trends: visits, finance,
// diagnoses, immunization, and stock. All figures are fictional.

export interface MonthlyVisits {
  month: string; // short label, e.g. "Jan"
  online: number;
  offline: number;
  ongoing?: boolean; // true for the current (partial) month
}

export interface MonthlyFinance {
  month: string;
  revenue: number; // Rp
  expense: number; // Rp (operational, dummy)
  ongoing?: boolean;
}

export interface BreakdownItem {
  label: string;
  value: number;
}

// Reference period: Jan–Jun 2026. June is still running (partial).
export const monthlyVisits: MonthlyVisits[] = [
  { month: "Jan", online: 60, offline: 36 },
  { month: "Feb", online: 66, offline: 38 },
  { month: "Mar", online: 72, offline: 40 },
  { month: "Apr", online: 78, offline: 42 },
  { month: "Mei", online: 86, offline: 46 },
  { month: "Jun", online: 58, offline: 30, ongoing: true },
];

export const monthlyFinance: MonthlyFinance[] = [
  { month: "Jan", revenue: 38500000, expense: 23200000 },
  { month: "Feb", revenue: 41200000, expense: 24100000 },
  { month: "Mar", revenue: 44800000, expense: 25600000 },
  { month: "Apr", revenue: 47300000, expense: 26400000 },
  { month: "Mei", revenue: 52100000, expense: 28200000 },
  { month: "Jun", revenue: 33900000, expense: 19800000, ongoing: true },
];

// New (first-visit) patients registered per month.
export const newPatientsMonthly: BreakdownItem[] = [
  { label: "Jan", value: 14 },
  { label: "Feb", value: 16 },
  { label: "Mar", value: 18 },
  { label: "Apr", value: 17 },
  { label: "Mei", value: 21 },
  { label: "Jun", value: 12 },
];

// Immunizations administered per month.
export const immunizationMonthly: BreakdownItem[] = [
  { label: "Jan", value: 22 },
  { label: "Feb", value: 25 },
  { label: "Mar", value: 28 },
  { label: "Apr", value: 24 },
  { label: "Mei", value: 31 },
  { label: "Jun", value: 19 },
];

// Visit type mix (cumulative, current month).
export const visitTypeBreakdown: BreakdownItem[] = [
  { label: "Konsultasi Umum", value: 41 },
  { label: "Imunisasi", value: 19 },
  { label: "Kontrol Ulang", value: 14 },
  { label: "Surat Sehat", value: 8 },
  { label: "Surat Sakit", value: 6 },
];

// Top diagnoses by ICD-10 (this month, dummy counts).
export const topDiagnoses: { code: string; label: string; count: number }[] = [
  { code: "J06.9", label: "ISPA akut", count: 24 },
  { code: "A09", label: "Diare & gastroenteritis", count: 16 },
  { code: "R50.9", label: "Demam", count: 13 },
  { code: "Z23", label: "Kontak imunisasi", count: 19 },
  { code: "J45.9", label: "Asma", count: 6 },
  { code: "L20.9", label: "Dermatitis atopik", count: 4 },
];

export function sumVisits(m: MonthlyVisits): number {
  return m.online + m.offline;
}

export function netProfit(m: MonthlyFinance): number {
  return m.revenue - m.expense;
}

// Convenience totals.
export const currentMonth = monthlyVisits[monthlyVisits.length - 1];
export const previousMonth = monthlyVisits[monthlyVisits.length - 2];
export const currentFinance = monthlyFinance[monthlyFinance.length - 1];
export const previousFinance = monthlyFinance[monthlyFinance.length - 2];

export const ytdRevenue = monthlyFinance.reduce((s, m) => s + m.revenue, 0);
export const ytdExpense = monthlyFinance.reduce((s, m) => s + m.expense, 0);
export const ytdVisits = monthlyVisits.reduce((s, m) => s + sumVisits(m), 0);

// Percentage change helper (vs previous month).
export function pctChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}
