// Small ICD-10 reference list (dummy subset, pediatric-relevant).
// For manual selection only — the system does NOT auto-assign codes.
export interface Icd10Code {
  code: string;
  label: string;
}

export const icd10Codes: Icd10Code[] = [
  { code: "J00", label: "Nasofaringitis akut (common cold)" },
  { code: "J02.9", label: "Faringitis akut, tidak dijelaskan" },
  { code: "J06.9", label: "Infeksi saluran napas atas akut" },
  { code: "A09", label: "Diare & gastroenteritis (dugaan infeksi)" },
  { code: "R50.9", label: "Demam, tidak dijelaskan" },
  { code: "J45.9", label: "Asma, tidak dijelaskan" },
  { code: "L20.9", label: "Dermatitis atopik, tidak dijelaskan" },
  { code: "Z23", label: "Kontak untuk imunisasi" },
  { code: "Z00.1", label: "Pemeriksaan kesehatan anak rutin" },
  { code: "B34.9", label: "Infeksi virus, tidak dijelaskan" },
];
