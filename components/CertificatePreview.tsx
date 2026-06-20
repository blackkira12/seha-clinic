"use client";

import { CertificateType } from "@/data/types";

export interface CertificatePreviewData {
  clinicName: string;
  doctorName: string;
  type: CertificateType;
  patientName: string;
  ageLabel: string;
  parentName: string;
  examinationDate: string;
  purpose: string;
  restRecommendation: string;
  doctorNotes: string;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="w-44 shrink-0 text-gray-500">{label}</span>
      <span className="text-gray-800">: {value}</span>
    </div>
  );
}

export default function CertificatePreview({
  data,
}: {
  data: CertificatePreviewData;
}) {
  const isSick = data.type === "Surat Keterangan Sakit";
  const title = isSick
    ? "SURAT KETERANGAN SAKIT"
    : "SURAT KETERANGAN SEHAT";

  return (
    <div className="print-area mx-auto max-w-[800px] rounded-2xl border border-gray-200 bg-white p-10 text-sm leading-relaxed text-gray-800 shadow-sm">
      {/* Letterhead */}
      <header className="border-b-2 border-brand-600 pb-4 text-center">
        <h2 className="text-lg font-bold text-brand-700">{data.clinicName}</h2>
        <p className="mt-1 text-xs text-gray-500">
          Praktik Dokter Spesialis Anak · Yogyakarta
        </p>
      </header>

      <h3 className="mt-8 text-center text-lg font-bold uppercase tracking-wide text-gray-800 underline">
        {title}
      </h3>

      <p className="mt-6 text-gray-800">
        Yang bertanda tangan di bawah ini menerangkan bahwa:
      </p>

      <section className="mt-4 space-y-1.5">
        <Field label="Nama Anak" value={`An. ${data.patientName}`} />
        <Field label="Usia" value={data.ageLabel} />
        <Field label="Nama Orang Tua/Wali" value={data.parentName} />
        <Field label="Tanggal Pemeriksaan" value={data.examinationDate} />
      </section>

      <section className="mt-6 space-y-3">
        <p className="text-gray-800">
          Berdasarkan hasil pemeriksaan, anak tersebut dinyatakan{" "}
          <span className="font-semibold">
            {isSick ? "sakit" : "sehat"}
          </span>{" "}
          untuk keperluan: <span className="font-medium">{data.purpose}</span>.
        </p>

        {isSick && data.restRecommendation && (
          <p className="text-gray-800">
            <span className="font-semibold">Rekomendasi Istirahat:</span>{" "}
            {data.restRecommendation}
          </p>
        )}

        {data.doctorNotes && (
          <p className="text-gray-800">
            <span className="font-semibold">Catatan Dokter:</span>{" "}
            {data.doctorNotes}
          </p>
        )}
      </section>

      <p className="mt-6 text-gray-800">
        Demikian surat keterangan ini dibuat untuk dapat dipergunakan
        sebagaimana mestinya.
      </p>

      {/* Signature */}
      <section className="mt-10 flex justify-end">
        <div className="text-center text-sm">
          <p className="text-gray-600">Dokter Pemeriksa,</p>
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
