"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import DummyNotice from "@/components/DummyNotice";
import { useRole } from "@/components/RoleContext";
import { queue as initialQueue } from "@/data/queue";
import { getPatientById } from "@/data/patients";
import { canMarkReportReady } from "@/data/visits";
import { QueueEntry, Vitals, SoapNote } from "@/data/types";
import { icd10Codes } from "@/data/icd10";

// Fixed dummy timestamp used for any "save" action in this prototype.
const DUMMY_TIME = "Sekarang";

// Empty form scaffolds (vitals & SOAP) used when an entry has no saved data yet.
function emptyVitals(): Vitals {
  return {
    weightKg: null,
    heightCm: null,
    temperatureC: null,
    briefComplaint: "",
    initialNotes: "",
  };
}

function emptySoap(): SoapNote {
  return {
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
    weightKg: null,
    heightCm: null,
    medicationInstructions: "",
    nextAction: "",
    immunizationReminderDate: null,
    controlReminderDate: null,
    doctorNotes: "",
    icd10: "",
  };
}

// Parse a number input into number | null (empty string -> null).
function parseNum(value: string): number | null {
  if (value.trim() === "") return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

function numVal(value: number | null): string {
  return value === null || value === undefined ? "" : String(value);
}

export default function ExaminationPage() {
  const { role, user } = useRole();

  const canEditVitals =
    role === "nurse" || role === "admin" || role === "developer";
  const canEditSoap =
    role === "doctor" || role === "admin" || role === "developer";

  // Only entries that are still examinable (not yet "Selesai").
  const examinable = useMemo(
    () => initialQueue.filter((q) => q.status !== "Selesai"),
    []
  );

  const [selectedId, setSelectedId] = useState<string>(
    examinable[0]?.id ?? ""
  );

  // Per-entry working copies of vitals / soap, keyed by queue entry id.
  const [vitalsMap, setVitalsMap] = useState<Record<string, Vitals>>({});
  const [soapMap, setSoapMap] = useState<Record<string, SoapNote>>({});
  // Completion + readiness flags keyed by entry id.
  const [vitalsSaved, setVitalsSaved] = useState<Record<string, boolean>>({});
  const [soapSaved, setSoapSaved] = useState<Record<string, boolean>>({});
  const [reportReady, setReportReady] = useState<Record<string, boolean>>({});
  // Ambience AI Scribe (simulation only): per-entry dummy transcript text and a
  // flag marking that a simulated draft was generated (so we can show the
  // "must be reviewed" warning). No real AI is used.
  const [transcriptMap, setTranscriptMap] = useState<Record<string, string>>({});
  const [scribeDrafted, setScribeDrafted] = useState<Record<string, boolean>>({});

  const selected = examinable.find((q) => q.id === selectedId);
  const patient = selected ? getPatientById(selected.patientId) : undefined;

  // Resolve the working vitals/soap for the selected entry (seed from entry data).
  const vitals: Vitals = selected
    ? vitalsMap[selected.id] ?? selected.vitals ?? emptyVitals()
    : emptyVitals();
  const soap: SoapNote = selected
    ? soapMap[selected.id] ?? selected.soap ?? emptySoap()
    : emptySoap();

  // Working transcript + draft flag for the AI Scribe simulation panel.
  const transcript = selected ? transcriptMap[selected.id] ?? "" : "";
  const isScribeDrafted = selected
    ? scribeDrafted[selected.id] ?? false
    : false;

  // A saved flag is true if locally saved OR the seed entry already had data.
  const isVitalsComplete = selected
    ? vitalsSaved[selected.id] ?? Boolean(selected.vitals?.recordedAt)
    : false;
  const isSoapComplete = selected
    ? soapSaved[selected.id] ?? Boolean(selected.soap?.completedAt)
    : false;
  const isReportReady = selected
    ? reportReady[selected.id] ?? selected.status === "Laporan Siap"
    : false;

  const hasMedicationOrNextAction = Boolean(
    soap.medicationInstructions.trim() || soap.nextAction.trim()
  );

  const canReady = canMarkReportReady({
    vitalsComplete: isVitalsComplete,
    soapComplete: isSoapComplete,
    hasMedicationOrNextAction,
  });

  const hasAllergy = Boolean(
    patient &&
      patient.allergyNotes &&
      !/tidak ada/i.test(patient.allergyNotes)
  );

  // ---- mutators ----
  function updateVitals(patch: Partial<Vitals>) {
    if (!selected) return;
    setVitalsMap((prev) => ({
      ...prev,
      [selected.id]: { ...vitals, ...patch },
    }));
  }

  function updateSoap(patch: Partial<SoapNote>) {
    if (!selected) return;
    setSoapMap((prev) => ({
      ...prev,
      [selected.id]: { ...soap, ...patch },
    }));
  }

  function updateTranscript(value: string) {
    if (!selected) return;
    setTranscriptMap((prev) => ({ ...prev, [selected.id]: value }));
  }

  // Simulation only: fill SOAP S/O/A/P with STATIC placeholder templates.
  // These are NOT derived from the transcript and contain no real diagnosis
  // or dosage — the doctor must review, edit, and sign before saving.
  function generateScribeDraft() {
    if (!selected || !canEditSoap) return;
    updateSoap({
      subjective:
        "[Draft simulasi] Orang tua menyampaikan keluhan utama anak. Mohon dokter sesuaikan dengan kondisi nyata.",
      objective:
        "[Draft simulasi] Hasil pemeriksaan fisik dan tanda vital. Mohon dokter verifikasi sesuai temuan sebenarnya.",
      assessment:
        "[Draft simulasi] Kesan/penilaian sementara. Diagnosis WAJIB ditentukan dan dikonfirmasi oleh dokter.",
      plan:
        "[Draft simulasi] Rencana tata laksana dan edukasi. Mohon dokter sesuaikan termasuk terapi dan tindak lanjut.",
    });
    setScribeDrafted((prev) => ({ ...prev, [selected.id]: true }));
  }

  function saveVitals() {
    if (!selected) return;
    setVitalsMap((prev) => ({
      ...prev,
      [selected.id]: { ...vitals, recordedBy: user.name, recordedAt: DUMMY_TIME },
    }));
    setVitalsSaved((prev) => ({ ...prev, [selected.id]: true }));
  }

  function saveSoap() {
    if (!selected) return;
    setSoapMap((prev) => ({
      ...prev,
      [selected.id]: { ...soap, completedBy: user.name, completedAt: DUMMY_TIME },
    }));
    setSoapSaved((prev) => ({ ...prev, [selected.id]: true }));
  }

  function markReady() {
    if (!selected || !canReady) return;
    setReportReady((prev) => ({ ...prev, [selected.id]: true }));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pemeriksaan"
        description="Ruang kerja gabungan vitals perawat dan SOAP dokter untuk pasien terpilih."
      />

      <DummyNotice text="Informasi klinis adalah data dummy untuk demonstrasi prototype saja." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
        {/* LEFT: patient / queue selector */}
        <aside className="space-y-3">
          <h2 className="section-title">Antrean Pemeriksaan</h2>
          <p className="text-xs text-gray-400">
            Pilih pasien untuk membuka ruang kerja pemeriksaan.
          </p>
          <div className="space-y-2">
            {examinable.length === 0 && (
              <p className="text-sm text-gray-400">
                Tidak ada pasien dalam antrean pemeriksaan.
              </p>
            )}
            {examinable.map((entry) => {
              const active = entry.id === selectedId;
              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setSelectedId(entry.id)}
                  className={`w-full rounded-2xl border p-3 text-left transition ${
                    active
                      ? "border-brand-600 bg-brand-50 ring-2 ring-brand-100"
                      : "border-gray-100 bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-gray-800">
                      {entry.patientName}
                    </span>
                    <span className="text-xs font-medium text-gray-400">
                      {entry.queueNumber}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">{entry.visitType}</p>
                  <div className="mt-2">
                    <StatusBadge status={entry.status}>{entry.status}</StatusBadge>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* RIGHT: examination workspace */}
        <section className="space-y-6">
          {!selected || !patient ? (
            <div className="card text-sm text-gray-500">
              Pilih pasien dari daftar di samping untuk memulai pemeriksaan.
            </div>
          ) : (
            <>
              {/* Patient summary header */}
              <div className="card">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-gray-800">
                        {patient.name}
                      </h2>
                      <StatusBadge status={selected.status}>
                        {selected.status}
                      </StatusBadge>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {patient.id} · {patient.ageLabel} ·{" "}
                      {patient.gender === "L" ? "Laki-laki" : "Perempuan"}
                    </p>
                    <p className="mt-0.5 text-sm text-gray-500">
                      Orang tua: {patient.parentName}
                    </p>
                  </div>
                  <div className="shrink-0">
                    {hasAllergy ? (
                      <div className="rounded-xl border border-danger-border bg-danger-bg px-3 py-2 text-xs text-danger-text">
                        <span className="font-semibold">⚠ Alergi:</span>{" "}
                        {patient.allergyNotes}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-safe-border bg-safe-bg px-3 py-2 text-xs text-safe-text">
                        {patient.allergyNotes}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="card-title">Kunjungan Terakhir</p>
                    {patient.visitHistory[0] ? (
                      <p className="mt-1 text-sm text-gray-700">
                        {patient.visitHistory[0].date} ·{" "}
                        {patient.visitHistory[0].visitType}
                        <br />
                        <span className="text-gray-500">
                          {patient.visitHistory[0].summary}
                        </span>
                      </p>
                    ) : (
                      <p className="mt-1 text-sm text-gray-400">
                        Belum ada riwayat kunjungan.
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="card-title">Riwayat Imunisasi</p>
                    {patient.immunizationHistory.length > 0 ? (
                      <ul className="mt-1 space-y-0.5 text-sm text-gray-700">
                        {patient.immunizationHistory.map((im) => (
                          <li key={`${im.name}-${im.date}`}>
                            {im.name}{" "}
                            <span className="text-gray-400">({im.date})</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1 text-sm text-gray-400">
                        Belum ada riwayat imunisasi.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* NURSE VITALS */}
              <div className="card">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <h3 className="section-title">Vitals Perawat</h3>
                  {isVitalsComplete && (
                    <StatusBadge tone="safe">✓ Vitals tersimpan</StatusBadge>
                  )}
                </div>

                {!canEditVitals && (
                  <p className="mb-3 text-xs text-gray-400">
                    Mode hanya-baca. Hanya perawat / admin yang dapat mengisi vitals.
                  </p>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="label" htmlFor="weightKg">
                      Berat Badan (kg)
                    </label>
                    <input
                      id="weightKg"
                      type="number"
                      inputMode="decimal"
                      className={`input ${!canEditVitals ? "bg-gray-50 text-gray-400" : ""}`}
                      value={numVal(vitals.weightKg)}
                      disabled={!canEditVitals}
                      onChange={(e) =>
                        updateVitals({ weightKg: parseNum(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="heightCm">
                      Tinggi Badan (cm)
                    </label>
                    <input
                      id="heightCm"
                      type="number"
                      inputMode="decimal"
                      className={`input ${!canEditVitals ? "bg-gray-50 text-gray-400" : ""}`}
                      value={numVal(vitals.heightCm)}
                      disabled={!canEditVitals}
                      onChange={(e) =>
                        updateVitals({ heightCm: parseNum(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="temperatureC">
                      Suhu (°C)
                    </label>
                    <input
                      id="temperatureC"
                      type="number"
                      inputMode="decimal"
                      className={`input ${!canEditVitals ? "bg-gray-50 text-gray-400" : ""}`}
                      value={numVal(vitals.temperatureC)}
                      disabled={!canEditVitals}
                      onChange={(e) =>
                        updateVitals({ temperatureC: parseNum(e.target.value) })
                      }
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="label" htmlFor="briefComplaint">
                      Keluhan Singkat
                    </label>
                    <input
                      id="briefComplaint"
                      type="text"
                      className={`input ${!canEditVitals ? "bg-gray-50 text-gray-400" : ""}`}
                      value={vitals.briefComplaint}
                      disabled={!canEditVitals}
                      onChange={(e) =>
                        updateVitals({ briefComplaint: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="initialNotes">
                      Catatan Awal
                    </label>
                    <textarea
                      id="initialNotes"
                      rows={2}
                      className={`input ${!canEditVitals ? "bg-gray-50 text-gray-400" : ""}`}
                      value={vitals.initialNotes}
                      disabled={!canEditVitals}
                      onChange={(e) =>
                        updateVitals({ initialNotes: e.target.value })
                      }
                    />
                  </div>
                </div>

                {canEditVitals && (
                  <div className="mt-4 flex items-center gap-3">
                    <button type="button" className="btn-primary" onClick={saveVitals}>
                      Simpan Vitals
                    </button>
                    {isVitalsComplete && vitals.recordedBy && (
                      <span className="text-xs text-gray-400">
                        Direkam oleh {vitals.recordedBy} · {vitals.recordedAt}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* DOCTOR SOAP */}
              <div className="card">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <h3 className="section-title">SOAP Dokter</h3>
                  {isSoapComplete && (
                    <StatusBadge tone="safe">✓ SOAP tersimpan</StatusBadge>
                  )}
                </div>

                {/* Nurse/pharmacist: SOAP hidden until doctor submits */}
                {!canEditSoap && !isSoapComplete ? (
                  <p className="rounded-xl border border-warn-border bg-warn-bg px-4 py-3 text-sm text-warn-text">
                    SOAP belum diisi dokter.
                  </p>
                ) : (
                  <>
                    {!canEditSoap && (
                      <p className="mb-3 text-xs text-gray-400">
                        Mode hanya-baca. Hanya dokter / admin yang dapat mengisi SOAP.
                      </p>
                    )}

                    {/* AMBIENCE AI SCRIBE (SIMULATION ONLY) */}
                    <div className="mb-4 rounded-2xl border border-brand-200 bg-brand-50 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="section-title">Ambience AI Scribe (Simulasi)</h4>
                        <StatusBadge tone="warn">Simulasi · bukan AI nyata</StatusBadge>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Draft SOAP dibuat dari transkrip percakapan dan WAJIB
                        direview &amp; ditandatangani dokter. Tidak ada AI nyata yang
                        digunakan — dokter memegang kendali penuh.
                      </p>

                      <div className="mt-3">
                        <label className="label" htmlFor="aiTranscript">
                          Transkrip Percakapan (dummy)
                        </label>
                        <textarea
                          id="aiTranscript"
                          rows={3}
                          placeholder="Tempel/ketik transkrip percakapan (dummy) di sini…"
                          className={`input ${!canEditSoap ? "bg-gray-50 text-gray-400" : ""}`}
                          value={transcript}
                          disabled={!canEditSoap}
                          onChange={(e) => updateTranscript(e.target.value)}
                        />
                      </div>

                      {canEditSoap && (
                        <div className="mt-3">
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={generateScribeDraft}
                          >
                            Hasilkan Draft SOAP (Simulasi)
                          </button>
                        </div>
                      )}

                      {isScribeDrafted && (
                        <p className="mt-3 rounded-xl border border-warn-border bg-warn-bg px-4 py-2 text-xs text-warn-text">
                          ⚠ Draft simulasi — wajib direview &amp; diedit dokter sebelum
                          disimpan. Klik “Simpan SOAP” setelah review.
                        </p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="label" htmlFor="subjective">
                          Subjective
                        </label>
                        <textarea
                          id="subjective"
                          rows={2}
                          className={`input ${!canEditSoap ? "bg-gray-50 text-gray-400" : ""}`}
                          value={soap.subjective}
                          disabled={!canEditSoap}
                          onChange={(e) =>
                            updateSoap({ subjective: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="label" htmlFor="objective">
                          Objective
                        </label>
                        <textarea
                          id="objective"
                          rows={2}
                          className={`input ${!canEditSoap ? "bg-gray-50 text-gray-400" : ""}`}
                          value={soap.objective}
                          disabled={!canEditSoap}
                          onChange={(e) =>
                            updateSoap({ objective: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="label" htmlFor="assessment">
                          Diagnosis/Assessment (input manual)
                        </label>
                        <textarea
                          id="assessment"
                          rows={2}
                          className={`input ${!canEditSoap ? "bg-gray-50 text-gray-400" : ""}`}
                          value={soap.assessment}
                          disabled={!canEditSoap}
                          onChange={(e) =>
                            updateSoap({ assessment: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="label" htmlFor="icd10">
                          Kode ICD-10 (pilih manual)
                        </label>
                        <select
                          id="icd10"
                          className={`input ${!canEditSoap ? "bg-gray-50 text-gray-400" : ""}`}
                          value={soap.icd10 ?? ""}
                          disabled={!canEditSoap}
                          onChange={(e) =>
                            updateSoap({ icd10: e.target.value })
                          }
                        >
                          <option value="">— Pilih kode —</option>
                          {icd10Codes.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.code} — {c.label}
                            </option>
                          ))}
                        </select>
                        <p className="mt-1 text-[11px] text-gray-400">
                          Pemilihan manual — sistem tidak menyarankan atau mengisi
                          kode secara otomatis.
                        </p>
                      </div>
                      <div>
                        <label className="label" htmlFor="plan">
                          Plan
                        </label>
                        <textarea
                          id="plan"
                          rows={2}
                          className={`input ${!canEditSoap ? "bg-gray-50 text-gray-400" : ""}`}
                          value={soap.plan}
                          disabled={!canEditSoap}
                          onChange={(e) => updateSoap({ plan: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="label" htmlFor="soapWeight">
                            Berat Badan (kg)
                          </label>
                          <div className="flex gap-2">
                            <input
                              id="soapWeight"
                              type="number"
                              inputMode="decimal"
                              className={`input ${!canEditSoap ? "bg-gray-50 text-gray-400" : ""}`}
                              value={numVal(soap.weightKg)}
                              disabled={!canEditSoap}
                              onChange={(e) =>
                                updateSoap({ weightKg: parseNum(e.target.value) })
                              }
                            />
                            {canEditSoap && (
                              <button
                                type="button"
                                className="btn-secondary whitespace-nowrap px-3 text-xs"
                                onClick={() =>
                                  updateSoap({ weightKg: vitals.weightKg })
                                }
                              >
                                Dari vitals
                              </button>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="label" htmlFor="soapHeight">
                            Tinggi Badan (cm)
                          </label>
                          <div className="flex gap-2">
                            <input
                              id="soapHeight"
                              type="number"
                              inputMode="decimal"
                              className={`input ${!canEditSoap ? "bg-gray-50 text-gray-400" : ""}`}
                              value={numVal(soap.heightCm)}
                              disabled={!canEditSoap}
                              onChange={(e) =>
                                updateSoap({ heightCm: parseNum(e.target.value) })
                              }
                            />
                            {canEditSoap && (
                              <button
                                type="button"
                                className="btn-secondary whitespace-nowrap px-3 text-xs"
                                onClick={() =>
                                  updateSoap({ heightCm: vitals.heightCm })
                                }
                              >
                                Dari vitals
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="label" htmlFor="medicationInstructions">
                          Instruksi Obat (input manual)
                        </label>
                        <textarea
                          id="medicationInstructions"
                          rows={2}
                          className={`input ${!canEditSoap ? "bg-gray-50 text-gray-400" : ""}`}
                          value={soap.medicationInstructions}
                          disabled={!canEditSoap}
                          onChange={(e) =>
                            updateSoap({ medicationInstructions: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="label" htmlFor="nextAction">
                          Tindak Lanjut
                        </label>
                        <input
                          id="nextAction"
                          type="text"
                          className={`input ${!canEditSoap ? "bg-gray-50 text-gray-400" : ""}`}
                          value={soap.nextAction}
                          disabled={!canEditSoap}
                          onChange={(e) =>
                            updateSoap({ nextAction: e.target.value })
                          }
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="label" htmlFor="immunizationReminderDate">
                            Tanggal Pengingat Imunisasi
                          </label>
                          <input
                            id="immunizationReminderDate"
                            type="date"
                            className={`input ${!canEditSoap ? "bg-gray-50 text-gray-400" : ""}`}
                            value={soap.immunizationReminderDate ?? ""}
                            disabled={!canEditSoap}
                            onChange={(e) =>
                              updateSoap({
                                immunizationReminderDate: e.target.value || null,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="label" htmlFor="controlReminderDate">
                            Tanggal Pengingat Kontrol
                          </label>
                          <input
                            id="controlReminderDate"
                            type="date"
                            className={`input ${!canEditSoap ? "bg-gray-50 text-gray-400" : ""}`}
                            value={soap.controlReminderDate ?? ""}
                            disabled={!canEditSoap}
                            onChange={(e) =>
                              updateSoap({
                                controlReminderDate: e.target.value || null,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <label className="label" htmlFor="doctorNotes">
                          Catatan Dokter
                        </label>
                        <textarea
                          id="doctorNotes"
                          rows={2}
                          className={`input ${!canEditSoap ? "bg-gray-50 text-gray-400" : ""}`}
                          value={soap.doctorNotes}
                          disabled={!canEditSoap}
                          onChange={(e) =>
                            updateSoap({ doctorNotes: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    {canEditSoap && (
                      <div className="mt-4 flex items-center gap-3">
                        <button type="button" className="btn-primary" onClick={saveSoap}>
                          Simpan SOAP
                        </button>
                        {isSoapComplete && soap.completedBy && (
                          <span className="text-xs text-gray-400">
                            Diisi oleh {soap.completedBy} · {soap.completedAt}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Reminder creation summary */}
                    {(soap.immunizationReminderDate || soap.controlReminderDate) && (
                      <div className="mt-4 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-700">
                        <p className="font-semibold">Reminder akan dibuat</p>
                        <ul className="mt-1 space-y-0.5 text-xs">
                          {soap.immunizationReminderDate && (
                            <li>
                              Pengingat Imunisasi · {soap.immunizationReminderDate}
                            </li>
                          )}
                          {soap.controlReminderDate && (
                            <li>
                              Pengingat Kontrol · {soap.controlReminderDate}
                            </li>
                          )}
                        </ul>
                        <p className="mt-1 text-[11px] text-brand-700/70">
                          Akan dikirim via {patient.reminderPreference} (simulasi).
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* REPORT READINESS */}
              <div className="card">
                <h3 className="section-title mb-4">Kesiapan Laporan</h3>

                <ul className="space-y-2">
                  {[
                    { label: "Vitals perawat lengkap", ok: isVitalsComplete },
                    { label: "SOAP dokter lengkap", ok: isSoapComplete },
                    {
                      label: "Instruksi obat / tindak lanjut terisi",
                      ok: hasMedicationOrNextAction,
                    },
                  ].map((c) => (
                    <li key={c.label} className="flex items-center gap-2">
                      <StatusBadge tone={c.ok ? "safe" : "danger"}>
                        {c.ok ? "✓" : "✗"}
                      </StatusBadge>
                      <span className="text-sm text-gray-700">{c.label}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={!canReady || isReportReady}
                    onClick={markReady}
                  >
                    Tandai Laporan Siap
                  </button>
                  <Link href="/reports" className="btn-secondary">
                    Buat PDF Laporan →
                  </Link>
                </div>

                {isReportReady ? (
                  <div className="mt-4 rounded-xl border border-safe-border bg-safe-bg px-4 py-3 text-sm text-safe-text">
                    ✓ Laporan ditandai siap. Lanjutkan ke pembuatan PDF di halaman
                    Laporan.
                  </div>
                ) : (
                  !canReady && (
                    <p className="mt-3 text-xs text-gray-400">
                      Semua syarat di atas harus terpenuhi sebelum laporan dapat
                      ditandai siap.
                    </p>
                  )
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
