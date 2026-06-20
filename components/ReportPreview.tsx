"use client";

export interface ReportPreviewData {
  clinicName: string;
  doctorName: string;
  patientName: string;
  parentName: string;
  visitDate: string;
  weightKg: number | null;
  heightCm: number | null;
  examinationSummary: string;
  medicationInstructions: string;
  nextAction: string;
  immunizationReminder: string | null;
  controlReminder: string | null;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="w-44 shrink-0 text-gray-500">{label}</span>
      <span className="text-gray-800">: {value}</span>
    </div>
  );
}

export default function ReportPreview({ data }: { data: ReportPreviewData }) {
  return (
    <div className="print-area mx-auto max-w-[800px] rounded-2xl border border-gray-200 bg-white p-10 text-sm leading-relaxed text-gray-800 shadow-sm">
      {/* Letterhead */}
      <header className="border-b-2 border-brand-600 pb-4 text-center">
        <h2 className="text-lg font-bold text-brand-700">{data.clinicName}</h2>
        <p className="mt-1 text-xs text-gray-500">
          Praktik Dokter Spesialis Anak · Yogyakarta
        </p>
      </header>

      <h3 className="mt-6 text-center text-base font-semibold uppercase tracking-wide text-gray-800">
        Laporan Hasil Kunjungan
      </h3>

      {/* Identity */}
      <section className="mt-6 space-y-1.5">
        <Field label="Nama Pasien" value={`An. ${data.patientName}`} />
        <Field label="Nama Orang Tua/Wali" value={data.parentName} />
        <Field label="Tanggal Kunjungan" value={data.visitDate} />
        <Field
          label="Berat Badan"
          value={
            data.weightKg != null ? `${data.weightKg} kg` : "Tidak tercatat"
          }
        />
        <Field
          label="Tinggi Badan"
          value={
            data.heightCm != null ? `${data.heightCm} cm` : "Tidak tercatat"
          }
        />
      </section>

      {/* Clinical content */}
      <section className="mt-6 space-y-4">
        <div>
          <p className="font-semibold text-gray-700">Ringkasan Pemeriksaan</p>
          <p className="mt-1 whitespace-pre-line text-gray-800">
            {data.examinationSummary || "—"}
          </p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Instruksi Obat</p>
          <p className="mt-1 whitespace-pre-line text-gray-800">
            {data.medicationInstructions || "—"}
          </p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Tindak Lanjut</p>
          <p className="mt-1 whitespace-pre-line text-gray-800">
            {data.nextAction || "—"}
          </p>
        </div>
        {(data.immunizationReminder || data.controlReminder) && (
          <div>
            <p className="font-semibold text-gray-700">Pengingat</p>
            <ul className="mt-1 list-inside list-disc text-gray-800">
              {data.immunizationReminder && (
                <li>Imunisasi berikutnya: {data.immunizationReminder}</li>
              )}
              {data.controlReminder && (
                <li>Kontrol berikutnya: {data.controlReminder}</li>
              )}
            </ul>
          </div>
        )}
      </section>

      {/* Signature */}
      <section className="mt-10 flex justify-end">
        <div className="text-center text-sm">
          <p className="text-gray-600">Hormat kami,</p>
          <div className="h-16" />
          <p className="text-gray-700">(................................)</p>
          <p className="mt-1 font-semibold text-gray-800">{data.doctorName}</p>
        </div>
      </section>

      <p className="mt-8 text-center text-[10px] text-gray-400">
        Dokumen ini dihasilkan dari prototype SEHA — data dummy untuk demonstrasi.
      </p>
    </div>
  );
}
