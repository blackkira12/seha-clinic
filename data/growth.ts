// KMS Digital Anak — pediatric growth monitoring (WHO-style percentile bands).
// Reference values are SIMPLIFIED DUMMY anchors for prototype demonstration only,
// loosely modeled on WHO child growth standards. NOT for clinical use.
import { Gender } from "./types";

export interface GrowthPoint {
  ageMonths: number;
  weightKg: number;
  heightCm: number;
}

export interface PercentileAnchor {
  ageMonths: number;
  p3: number;
  p50: number;
  p97: number;
}

export interface PatientGrowth {
  patientId: string;
  measurements: GrowthPoint[];
}

// Weight-for-age (kg) reference anchors — simplified.
export const weightRef: Record<Gender, PercentileAnchor[]> = {
  L: [
    { ageMonths: 0, p3: 2.5, p50: 3.3, p97: 4.4 },
    { ageMonths: 6, p3: 6.4, p50: 7.9, p97: 9.8 },
    { ageMonths: 12, p3: 7.8, p50: 9.6, p97: 12.0 },
    { ageMonths: 24, p3: 9.7, p50: 12.2, p97: 15.3 },
    { ageMonths: 36, p3: 11.3, p50: 14.3, p97: 18.3 },
    { ageMonths: 48, p3: 12.7, p50: 16.3, p97: 21.2 },
    { ageMonths: 60, p3: 14.1, p50: 18.3, p97: 24.2 },
    { ageMonths: 72, p3: 15.9, p50: 20.5, p97: 27.6 },
    { ageMonths: 84, p3: 17.7, p50: 22.9, p97: 31.6 },
  ],
  P: [
    { ageMonths: 0, p3: 2.4, p50: 3.2, p97: 4.2 },
    { ageMonths: 6, p3: 5.8, p50: 7.3, p97: 9.3 },
    { ageMonths: 12, p3: 7.0, p50: 8.9, p97: 11.5 },
    { ageMonths: 24, p3: 9.0, p50: 11.5, p97: 14.8 },
    { ageMonths: 36, p3: 10.8, p50: 13.9, p97: 18.1 },
    { ageMonths: 48, p3: 12.3, p50: 16.1, p97: 21.5 },
    { ageMonths: 60, p3: 13.7, p50: 18.2, p97: 24.9 },
    { ageMonths: 72, p3: 15.3, p50: 20.2, p97: 28.2 },
    { ageMonths: 84, p3: 16.8, p50: 22.4, p97: 31.8 },
  ],
};

// Height/length-for-age (cm) reference anchors — simplified.
export const heightRef: Record<Gender, PercentileAnchor[]> = {
  L: [
    { ageMonths: 0, p3: 46.1, p50: 49.9, p97: 53.7 },
    { ageMonths: 6, p3: 63.3, p50: 67.6, p97: 71.9 },
    { ageMonths: 12, p3: 71.0, p50: 75.7, p97: 80.5 },
    { ageMonths: 24, p3: 81.7, p50: 87.1, p97: 92.9 },
    { ageMonths: 36, p3: 88.7, p50: 96.1, p97: 103.5 },
    { ageMonths: 48, p3: 94.9, p50: 103.3, p97: 111.7 },
    { ageMonths: 60, p3: 100.7, p50: 110.0, p97: 119.2 },
    { ageMonths: 72, p3: 106.1, p50: 116.0, p97: 125.8 },
    { ageMonths: 84, p3: 111.2, p50: 121.7, p97: 132.2 },
  ],
  P: [
    { ageMonths: 0, p3: 45.4, p50: 49.1, p97: 52.9 },
    { ageMonths: 6, p3: 61.2, p50: 65.7, p97: 70.3 },
    { ageMonths: 12, p3: 68.9, p50: 74.0, p97: 79.2 },
    { ageMonths: 24, p3: 80.0, p50: 85.7, p97: 91.5 },
    { ageMonths: 36, p3: 87.4, p50: 95.1, p97: 102.7 },
    { ageMonths: 48, p3: 94.1, p50: 102.7, p97: 111.3 },
    { ageMonths: 60, p3: 99.9, p50: 109.4, p97: 118.9 },
    { ageMonths: 72, p3: 104.9, p50: 115.1, p97: 125.4 },
    { ageMonths: 84, p3: 109.6, p50: 120.8, p97: 132.0 },
  ],
};

// Per-patient measurement history (dummy). ageMonths roughly matches DOB.
export const patientGrowth: PatientGrowth[] = [
  {
    patientId: "SEHA-0001", // Rania Putri, P
    measurements: [
      { ageMonths: 12, weightKg: 9.0, heightCm: 74 },
      { ageMonths: 24, weightKg: 11.6, heightCm: 86 },
      { ageMonths: 36, weightKg: 14.0, heightCm: 95 },
      { ageMonths: 48, weightKg: 16.2, heightCm: 103 },
      { ageMonths: 60, weightKg: 18.0, heightCm: 108 },
    ],
  },
  {
    patientId: "SEHA-0002", // Arka Mahendra, L
    measurements: [
      { ageMonths: 3, weightKg: 6.2, heightCm: 61 },
      { ageMonths: 6, weightKg: 7.8, heightCm: 67 },
      { ageMonths: 12, weightKg: 9.4, heightCm: 75 },
      { ageMonths: 19, weightKg: 10.2, heightCm: 78 },
    ],
  },
  {
    patientId: "SEHA-0003", // Naya Kirana, P
    measurements: [
      { ageMonths: 24, weightKg: 11.0, heightCm: 84 },
      { ageMonths: 48, weightKg: 15.5, heightCm: 101 },
      { ageMonths: 60, weightKg: 17.8, heightCm: 109 },
      { ageMonths: 72, weightKg: 19.9, heightCm: 115 },
      { ageMonths: 83, weightKg: 21.5, heightCm: 120 },
    ],
  },
  {
    patientId: "SEHA-0004", // Daffa Pratama, L
    measurements: [
      { ageMonths: 12, weightKg: 9.5, heightCm: 75 },
      { ageMonths: 24, weightKg: 12.1, heightCm: 87 },
      { ageMonths: 36, weightKg: 14.0, heightCm: 95 },
      { ageMonths: 45, weightKg: 14.5, heightCm: 96 },
    ],
  },
  {
    patientId: "SEHA-0005", // Keisha Ramadhani, P
    measurements: [
      { ageMonths: 24, weightKg: 11.2, heightCm: 85 },
      { ageMonths: 36, weightKg: 13.6, heightCm: 94 },
      { ageMonths: 48, weightKg: 15.8, heightCm: 102 },
      { ageMonths: 60, weightKg: 18.1, heightCm: 109 },
    ],
  },
  {
    patientId: "SEHA-0006", // Bima Aditya, L
    measurements: [
      { ageMonths: 12, weightKg: 9.7, heightCm: 76 },
      { ageMonths: 24, weightKg: 12.3, heightCm: 87 },
      { ageMonths: 36, weightKg: 14.4, heightCm: 96 },
      { ageMonths: 40, weightKg: 14.9, heightCm: 97 },
    ],
  },
  {
    patientId: "SEHA-0007", // Zoya Aulia, P
    measurements: [
      { ageMonths: 3, weightKg: 5.9, heightCm: 60 },
      { ageMonths: 6, weightKg: 7.3, heightCm: 66 },
      { ageMonths: 12, weightKg: 8.9, heightCm: 74 },
      { ageMonths: 17, weightKg: 9.6, heightCm: 78 },
    ],
  },
  {
    patientId: "SEHA-0008", // Rayyan Hafiz, L
    measurements: [
      { ageMonths: 36, weightKg: 14.2, heightCm: 96 },
      { ageMonths: 60, weightKg: 18.4, heightCm: 110 },
      { ageMonths: 72, weightKg: 20.6, heightCm: 116 },
      { ageMonths: 84, weightKg: 22.9, heightCm: 122 },
      { ageMonths: 93, weightKg: 24.5, heightCm: 126 },
    ],
  },
];

export function getPatientGrowth(patientId: string) {
  return patientGrowth.find((g) => g.patientId === patientId);
}

// Rough percentile band classification for the latest measurement.
export function classifyBand(
  value: number,
  ref: PercentileAnchor[],
  ageMonths: number
): "Di bawah P3" | "P3–P50" | "P50–P97" | "Di atas P97" {
  // linear interpolation of ref anchors at ageMonths
  const interp = (key: "p3" | "p50" | "p97") => {
    const sorted = [...ref].sort((a, b) => a.ageMonths - b.ageMonths);
    if (ageMonths <= sorted[0].ageMonths) return sorted[0][key];
    if (ageMonths >= sorted[sorted.length - 1].ageMonths)
      return sorted[sorted.length - 1][key];
    for (let i = 0; i < sorted.length - 1; i++) {
      const a = sorted[i];
      const b = sorted[i + 1];
      if (ageMonths >= a.ageMonths && ageMonths <= b.ageMonths) {
        const t = (ageMonths - a.ageMonths) / (b.ageMonths - a.ageMonths);
        return a[key] + t * (b[key] - a[key]);
      }
    }
    return sorted[sorted.length - 1][key];
  };
  if (value < interp("p3")) return "Di bawah P3";
  if (value < interp("p50")) return "P3–P50";
  if (value <= interp("p97")) return "P50–P97";
  return "Di atas P97";
}
