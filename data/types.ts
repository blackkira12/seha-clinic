// Shared domain types for SEHA Clinic Operations System
// Prototype only — all data is fictional dummy data.

export type RoleId = "admin" | "doctor" | "nurse" | "pharmacist" | "developer";

export interface StaffUser {
  id: string;
  name: string;
  role: RoleId;
  roleLabel: string;
  initials: string;
}

export type Gender = "L" | "P"; // Laki-laki / Perempuan

export type VisitType =
  | "Konsultasi Umum"
  | "Imunisasi"
  | "Kontrol Ulang"
  | "Surat Sehat"
  | "Surat Sakit";

export type RegistrationChannel = "online" | "offline";

export type QueueStatus =
  | "Menunggu Registrasi"
  | "Menunggu Perawat"
  | "Menunggu Dokter"
  | "Menunggu Farmasi"
  | "Laporan Siap"
  | "Selesai";

export interface ImmunizationRecord {
  name: string;
  date: string; // ISO date
}

export interface VisitHistoryItem {
  date: string; // ISO date
  visitType: VisitType;
  summary: string;
}

export interface Patient {
  id: string; // Patient ID, e.g. SEHA-0001
  name: string;
  dateOfBirth: string; // ISO date
  ageLabel: string; // human readable, e.g. "3 tahun 2 bulan"
  gender: Gender;
  parentName: string;
  parentPhone: string; // dummy format 08xx-xxxx-xxxx
  address: string;
  allergyNotes: string;
  visitHistory: VisitHistoryItem[];
  immunizationHistory: ImmunizationRecord[];
  reminderPreference: "WhatsApp" | "Telepon" | "SMS";
}

export interface Vitals {
  weightKg: number | null;
  heightCm: number | null;
  temperatureC: number | null;
  briefComplaint: string;
  initialNotes: string;
  recordedBy?: string;
  recordedAt?: string;
}

export interface SoapNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  icd10?: string; // manually selected ICD-10 code (RME), optional
  weightKg: number | null;
  heightCm: number | null;
  medicationInstructions: string;
  nextAction: string;
  immunizationReminderDate: string | null;
  controlReminderDate: string | null;
  doctorNotes: string;
  completedBy?: string;
  completedAt?: string;
}

export interface QueueEntry {
  id: string;
  queueNumber: string; // e.g. A-01
  patientId: string;
  patientName: string;
  channel: RegistrationChannel;
  visitType: VisitType;
  status: QueueStatus;
  priority: boolean;
  checkInTime: string; // HH:mm
  waitingMinutes: number;
  vitals?: Vitals;
  soap?: SoapNote;
}

export type InventoryCategory =
  | "Obat"
  | "Vaksin / Imunisasi"
  | "Bahan Habis Pakai"
  | "Bahan Obat Racik";

export type InventoryStatus =
  | "Aman"
  | "Stok Menipis"
  | "Akan Kadaluarsa"
  | "Kadaluarsa";

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  currentStock: number;
  minimumStock: number;
  unit: string;
  batchNumber: string;
  expiryDate: string; // ISO date
  supplier: string;
  status: InventoryStatus;
}

export type CompoundStatus =
  | "Menunggu"
  | "Sedang Diracik"
  | "Selesai Diracik"
  | "Diserahkan";

export interface CompoundedMedicine {
  id: string;
  patientName: string;
  recipe: string; // manual dummy text
  status: CompoundStatus;
  preparedBy: string;
}

export type ReminderType =
  | "Pengingat Imunisasi"
  | "Pengingat Kontrol"
  | "Pengingat Lanjutan Obat";

export type ReminderStatus =
  | "Pending"
  | "Siap Dihubungi"
  | "Sudah Dihubungi Manual"
  | "Selesai";

export interface Reminder {
  id: string;
  patientName: string;
  parentName: string;
  parentPhone: string;
  type: ReminderType;
  dueDate: string; // ISO date
  status: ReminderStatus;
  note: string;
}

export type CertificateType = "Surat Keterangan Sakit" | "Surat Keterangan Sehat";

export interface Certificate {
  id: string;
  type: CertificateType;
  patientName: string;
  ageLabel: string;
  parentName: string;
  examinationDate: string; // ISO date
  purpose: string;
  restRecommendation: string; // only meaningful for sick certificate
  doctorNotes: string;
}

export interface PricingPackage {
  id: string;
  name: string;
  tagline: string;
  recommended: boolean;
  features: string[];
  setupFeeMin: number | null;
  setupFeeMax: number | null;
  monthlyMin: number | null;
  monthlyMax: number | null;
  customQuote: boolean;
}

export interface AccessMatrixRow {
  role: string;
  viewAccess: string;
  editAccess: string;
  restricted: string;
}
