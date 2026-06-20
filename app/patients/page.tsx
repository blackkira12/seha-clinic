"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import PatientCard from "@/components/PatientCard";
import { patients as initialPatients } from "@/data/patients";
import { Patient } from "@/data/types";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  // New patient form (simulation only).
  const [name, setName] = useState("");
  const [parentName, setParentName] = useState("");
  const [ageLabel, setAgeLabel] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.parentName.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
    );
  }, [patients, query]);

  function handleAddPatient() {
    if (!name.trim()) return;
    const seq = patients.length + 1;
    const newPatient: Patient = {
      id: `SEHA-${String(seq).padStart(4, "0")}-NEW`,
      name: name.trim(),
      dateOfBirth: "",
      ageLabel: ageLabel.trim() || "—",
      gender: "L",
      parentName: parentName.trim() || "—",
      parentPhone: "—",
      address: "—",
      allergyNotes: "Tidak ada alergi yang diketahui",
      reminderPreference: "WhatsApp",
      visitHistory: [],
      immunizationHistory: [],
    };
    setPatients((prev) => [newPatient, ...prev]);
    setName("");
    setParentName("");
    setAgeLabel("");
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Registry Pasien"
        description={`${patients.length} pasien terdaftar`}
        action={
          <button
            type="button"
            className="btn-primary"
            onClick={() => setShowForm((s) => !s)}
          >
            {showForm ? "Tutup Form" : "Tambah Pasien"}
          </button>
        }
      />

      {showForm && (
        <section className="card">
          <h2 className="section-title mb-4">Tambah Pasien (Simulasi)</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="label" htmlFor="np-name">
                Nama Pasien
              </label>
              <input
                id="np-name"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama anak"
              />
            </div>
            <div>
              <label className="label" htmlFor="np-parent">
                Nama Orang Tua
              </label>
              <input
                id="np-parent"
                className="input"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="Nama orang tua"
              />
            </div>
            <div>
              <label className="label" htmlFor="np-age">
                Usia
              </label>
              <input
                id="np-age"
                className="input"
                value={ageLabel}
                onChange={(e) => setAgeLabel(e.target.value)}
                placeholder="mis. 2 tahun 3 bulan"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button type="button" className="btn-primary" onClick={handleAddPatient}>
              Simpan Pasien
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Data baru hanya tersimpan sementara di halaman ini.
          </p>
        </section>
      )}

      {/* Search */}
      <div className="max-w-md">
        <label className="label" htmlFor="search">
          Cari Pasien
        </label>
        <input
          id="search"
          className="input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama pasien, orang tua, atau ID…"
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="card text-center text-sm text-gray-400">
          Tidak ada pasien yang cocok dengan pencarian.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <PatientCard key={p.id} patient={p} href={`/patients/${p.id}`} />
          ))}
        </div>
      )}
    </div>
  );
}
