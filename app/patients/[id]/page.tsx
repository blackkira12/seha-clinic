"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import DummyNotice from "@/components/DummyNotice";
import { getPatientById } from "@/data/patients";

function hasAllergy(allergyNotes: string): boolean {
  return !/tidak ada alergi/i.test(allergyNotes.trim());
}

export default function PatientDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const patient = id ? getPatientById(id) : undefined;

  if (!patient) {
    return (
      <div className="space-y-6">
        <PageHeader title="Pasien tidak ditemukan" />
        <div className="card text-center">
          <p className="text-sm text-gray-500">
            Maaf, data pasien dengan ID{" "}
            <span className="font-medium text-gray-700">{id}</span> tidak ditemukan.
          </p>
          <Link href="/patients" className="btn-secondary mt-4 inline-flex">
            ← Kembali ke Registry Pasien
          </Link>
        </div>
      </div>
    );
  }

  const allergic = hasAllergy(patient.allergyNotes);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <Link href="/patients" className="text-brand-700 hover:underline">
          ← Kembali ke Registry Pasien
        </Link>
        <span className="text-gray-300">·</span>
        <Link href="/examination" className="text-brand-700 hover:underline">
          Ke Pemeriksaan →
        </Link>
      </div>

      <PageHeader
        title={patient.name}
        description={`${patient.id} · ${patient.ageLabel}`}
        action={
          allergic ? (
            <StatusBadge tone="danger">Memiliki Alergi</StatusBadge>
          ) : (
            <StatusBadge tone="safe">Tidak ada alergi</StatusBadge>
          )
        }
      />

      <DummyNotice />

      {/* Allergy highlight */}
      {allergic && (
        <div className="rounded-2xl border border-danger-border bg-danger-bg px-4 py-3 text-sm text-danger-text">
          <span className="font-semibold">Catatan Alergi: </span>
          {patient.allergyNotes}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile */}
        <section className="card lg:col-span-1">
          <h2 className="section-title mb-4">Profil Pasien</h2>
          <dl className="space-y-3 text-sm">
            {[
              ["Nama", patient.name],
              ["ID Pasien", patient.id],
              ["Tanggal Lahir", patient.dateOfBirth || "—"],
              ["Usia", patient.ageLabel],
              ["Jenis Kelamin", patient.gender === "L" ? "Laki-laki" : "Perempuan"],
              ["Nama Orang Tua", patient.parentName],
              ["Telepon Orang Tua", patient.parentPhone],
              ["Alamat", patient.address],
              ["Preferensi Pengingat", patient.reminderPreference],
              ["Catatan Alergi", patient.allergyNotes],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4">
                <dt className="shrink-0 text-gray-400">{label}</dt>
                <dd className="text-right text-gray-700">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="space-y-6 lg:col-span-2">
          {/* Visit history */}
          <section className="card">
            <h2 className="section-title mb-4">Riwayat Kunjungan</h2>
            {patient.visitHistory.length === 0 ? (
              <p className="text-sm text-gray-400">Belum ada riwayat kunjungan.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      <th className="py-2 pr-4">Tanggal</th>
                      <th className="py-2 pr-4">Jenis Kunjungan</th>
                      <th className="py-2">Ringkasan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {patient.visitHistory.map((v, i) => (
                      <tr key={i}>
                        <td className="py-2 pr-4 text-gray-600">{v.date}</td>
                        <td className="py-2 pr-4">
                          <StatusBadge tone="info">{v.visitType}</StatusBadge>
                        </td>
                        <td className="py-2 text-gray-700">{v.summary}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Immunization history */}
          <section className="card">
            <h2 className="section-title mb-4">Riwayat Imunisasi</h2>
            {patient.immunizationHistory.length === 0 ? (
              <p className="text-sm text-gray-400">Belum ada riwayat imunisasi.</p>
            ) : (
              <ul className="divide-y divide-gray-50">
                {patient.immunizationHistory.map((im, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-3 py-2.5 text-sm"
                  >
                    <span className="font-medium text-gray-700">{im.name}</span>
                    <span className="text-gray-400">{im.date}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
