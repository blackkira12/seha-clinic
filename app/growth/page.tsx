"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import DummyNotice from "@/components/DummyNotice";
import StatusBadge from "@/components/StatusBadge";
import GrowthChart from "@/components/GrowthChart";
import { patients } from "@/data/patients";
import {
  getPatientGrowth,
  weightRef,
  heightRef,
  classifyBand,
  PercentileAnchor,
  GrowthPoint,
} from "@/data/growth";

type Band = ReturnType<typeof classifyBand>;

// Descriptive (non-diagnostic) tone + note for a percentile band.
const bandTone: Record<Band, "danger" | "warn" | "safe"> = {
  "Di bawah P3": "danger",
  "P3–P50": "warn",
  "P50–P97": "safe",
  "Di atas P97": "warn",
};

function genderLabel(g: "L" | "P") {
  return g === "L" ? "Laki-laki" : "Perempuan";
}

// A small panel below each chart: latest value + percentile band.
function LatestSummary({
  label,
  unit,
  refBands,
  measurements,
  pick,
}: {
  label: string;
  unit: string;
  refBands: PercentileAnchor[];
  measurements: GrowthPoint[];
  pick: (m: GrowthPoint) => number;
}) {
  if (measurements.length === 0) return null;
  const latest = [...measurements].sort((a, b) => a.ageMonths - b.ageMonths).slice(-1)[0];
  const value = pick(latest);
  const band = classifyBand(value, refBands, latest.ageMonths);

  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-gray-50 px-3 py-2">
      <div className="text-sm text-gray-600">
        <span className="font-medium text-gray-800">{label} terakhir:</span>{" "}
        {value} {unit}{" "}
        <span className="text-gray-400">
          (usia {latest.ageMonths} bulan)
        </span>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge tone={bandTone[band]}>{band}</StatusBadge>
        <span className="text-xs text-gray-500">Berada pada rentang {band}</span>
      </div>
    </div>
  );
}

export default function GrowthPage() {
  const [patientId, setPatientId] = useState(patients[0].id);

  const patient = useMemo(
    () => patients.find((p) => p.id === patientId) ?? patients[0],
    [patientId]
  );
  const growth = useMemo(() => getPatientGrowth(patient.id), [patient.id]);
  const measurements = growth?.measurements ?? [];

  const wRef = weightRef[patient.gender];
  const hRef = heightRef[patient.gender];

  const weightPoints = measurements.map((m) => ({
    ageMonths: m.ageMonths,
    value: m.weightKg,
  }));
  const heightPoints = measurements.map((m) => ({
    ageMonths: m.ageMonths,
    value: m.heightCm,
  }));

  const sortedHistory = [...measurements].sort((a, b) => a.ageMonths - b.ageMonths);

  return (
    <div className="space-y-6">
      <PageHeader
        title="KMS Digital Anak"
        description="Pemantauan pertumbuhan anak — berat dan tinggi badan terhadap usia, dengan kurva persentil ilustratif."
        action={
          <div>
            <label className="label" htmlFor="growth-patient">
              Pilih Pasien
            </label>
            <select
              id="growth-patient"
              className="input"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id})
                </option>
              ))}
            </select>
          </div>
        }
      />

      <DummyNotice text="Kurva pertumbuhan menggunakan data referensi dummy yang disederhanakan untuk demonstrasi prototype, bukan untuk penilaian klinis." />

      {/* Patient summary */}
      <section className="card">
        <h2 className="section-title mb-3">Data Pasien</h2>
        <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <p className="text-xs text-gray-400">Nama</p>
            <p className="font-medium text-gray-800">{patient.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Usia</p>
            <p className="font-medium text-gray-800">{patient.ageLabel}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Jenis Kelamin</p>
            <p className="font-medium text-gray-800">{genderLabel(patient.gender)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Orang Tua</p>
            <p className="font-medium text-gray-800">{patient.parentName}</p>
          </div>
        </div>
      </section>

      {measurements.length === 0 ? (
        <section className="card">
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <span className="text-3xl">📈</span>
            <p className="font-medium text-gray-700">Belum ada data pertumbuhan</p>
            <p className="max-w-sm text-sm text-gray-500">
              Pasien ini belum memiliki riwayat pengukuran berat dan tinggi badan.
              Tambahkan pengukuran untuk menampilkan kurva pertumbuhan.
            </p>
          </div>
        </section>
      ) : (
        <>
          {/* Two charts side by side */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="card">
              <GrowthChart
                title="Berat Badan terhadap Usia"
                unit="kg"
                refBands={wRef}
                points={weightPoints}
              />
              <LatestSummary
                label="Berat badan"
                unit="kg"
                refBands={wRef}
                measurements={measurements}
                pick={(m) => m.weightKg}
              />
            </section>

            <section className="card">
              <GrowthChart
                title="Tinggi / Panjang Badan terhadap Usia"
                unit="cm"
                refBands={hRef}
                points={heightPoints}
              />
              <LatestSummary
                label="Tinggi badan"
                unit="cm"
                refBands={hRef}
                measurements={measurements}
                pick={(m) => m.heightCm}
              />
            </section>
          </div>

          {/* Measurement history table */}
          <section className="card">
            <h2 className="section-title mb-3">Riwayat Pengukuran</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-400">
                    <th className="px-3 py-2 font-medium">Usia (bulan)</th>
                    <th className="px-3 py-2 font-medium">Berat (kg)</th>
                    <th className="px-3 py-2 font-medium">Tinggi (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedHistory.map((m, i) => (
                    <tr key={i} className="border-b border-gray-100 last:border-0">
                      <td className="px-3 py-2 text-gray-700">{m.ageMonths}</td>
                      <td className="px-3 py-2 text-gray-700">{m.weightKg}</td>
                      <td className="px-3 py-2 text-gray-700">{m.heightCm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
