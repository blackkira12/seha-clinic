import { VisitType, QueueStatus, RegistrationChannel } from "./types";

export const visitTypes: VisitType[] = [
  "Konsultasi Umum",
  "Imunisasi",
  "Kontrol Ulang",
  "Surat Sehat",
  "Surat Sakit",
];

export const queueStatuses: QueueStatus[] = [
  "Menunggu Registrasi",
  "Menunggu Perawat",
  "Menunggu Dokter",
  "Menunggu Farmasi",
  "Laporan Siap",
  "Selesai",
];

export const channels: RegistrationChannel[] = ["online", "offline"];

// Queue fairness rule used across the app: 2 online : 1 offline.
export const FAIRNESS_RULE = {
  onlinePerCycle: 2,
  offlinePerCycle: 1,
  description: "2 pasien online diikuti 1 pasien offline, berulang.",
};

// Business rule: a report can only be marked ready when nurse vitals are done,
// doctor SOAP is done, and medication instruction OR next action is filled.
export function canMarkReportReady(opts: {
  vitalsComplete: boolean;
  soapComplete: boolean;
  hasMedicationOrNextAction: boolean;
}): boolean {
  return opts.vitalsComplete && opts.soapComplete && opts.hasMedicationOrNextAction;
}
