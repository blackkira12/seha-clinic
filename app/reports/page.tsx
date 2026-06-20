"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import DummyNotice from "@/components/DummyNotice";
import ReportPreview, {
  ReportPreviewData,
} from "@/components/ReportPreview";
import CertificatePreview, {
  CertificatePreviewData,
} from "@/components/CertificatePreview";
import { useRole } from "@/components/RoleContext";
import { CLINIC_NAME, DOCTOR_NAME } from "@/data/users";
import { queue } from "@/data/queue";
import { patients, getPatientById } from "@/data/patients";
import { certificates } from "@/data/certificates";
import { CertificateType } from "@/data/types";

type Tab = "report" | "certificate";

// Queue entries with a completed SOAP note are eligible for a visit report.
const reportableEntries = queue.filter((q) => q.soap);

export default function ReportsPage() {
  const { role } = useRole();
  const canApprove = role === "doctor" || role === "admin" || role === "developer";

  const [tab, setTab] = useState<Tab>("report");

  // --- Visit report state ---
  const [entryId, setEntryId] = useState<string>(
    reportableEntries[0]?.id ?? ""
  );
  const [approvedIds, setApprovedIds] = useState<Record<string, boolean>>({});

  const selectedEntry = useMemo(
    () => reportableEntries.find((q) => q.id === entryId),
    [entryId]
  );

  const reportData: ReportPreviewData | null = useMemo(() => {
    if (!selectedEntry || !selectedEntry.soap) return null;
    const patient = getPatientById(selectedEntry.patientId);
    const soap = selectedEntry.soap;
    return {
      clinicName: CLINIC_NAME,
      doctorName: soap.completedBy ?? DOCTOR_NAME,
      patientName: selectedEntry.patientName,
      parentName: patient?.parentName ?? "—",
      visitDate: soap.completedAt
        ? `${selectedEntry.checkInTime} (hari ini)`
        : selectedEntry.checkInTime,
      weightKg: soap.weightKg,
      heightCm: soap.heightCm,
      examinationSummary: [
        soap.subjective && `S: ${soap.subjective}`,
        soap.objective && `O: ${soap.objective}`,
        soap.assessment && `A: ${soap.assessment}`,
        soap.plan && `P: ${soap.plan}`,
      ]
        .filter(Boolean)
        .join("\n"),
      medicationInstructions: soap.medicationInstructions,
      nextAction: soap.nextAction,
      immunizationReminder: soap.immunizationReminderDate,
      controlReminder: soap.controlReminderDate,
    };
  }, [selectedEntry]);

  const isApproved = !!approvedIds[entryId];

  // --- Certificate state ---
  const [certType, setCertType] = useState<CertificateType>(
    "Surat Keterangan Sakit"
  );
  // Optional prefill from an existing certificate of the chosen type.
  const [sourceCertId, setSourceCertId] = useState<string>("manual");
  const [patientId, setPatientId] = useState<string>(patients[0]?.id ?? "");
  const [parentName, setParentName] = useState<string>(
    patients[0]?.parentName ?? ""
  );
  const [ageLabel, setAgeLabel] = useState<string>(
    patients[0]?.ageLabel ?? ""
  );
  const [examinationDate, setExaminationDate] = useState<string>("2026-06-19");
  const [purpose, setPurpose] = useState<string>("");
  const [restRecommendation, setRestRecommendation] = useState<string>("");
  const [doctorNotes, setDoctorNotes] = useState<string>("");

  const certsOfType = certificates.filter((c) => c.type === certType);

  function applyPatient(id: string) {
    setPatientId(id);
    const p = getPatientById(id);
    if (p) {
      setParentName(p.parentName);
      setAgeLabel(p.ageLabel);
    }
  }

  function applySource(id: string) {
    setSourceCertId(id);
    if (id === "manual") return;
    const cert = certificates.find((c) => c.id === id);
    if (!cert) return;
    const p = patients.find((pt) => pt.name === cert.patientName);
    if (p) setPatientId(p.id);
    setParentName(cert.parentName);
    setAgeLabel(cert.ageLabel);
    setExaminationDate(cert.examinationDate);
    setPurpose(cert.purpose);
    setRestRecommendation(cert.restRecommendation);
    setDoctorNotes(cert.doctorNotes);
  }

  function changeCertType(next: CertificateType) {
    setCertType(next);
    setSourceCertId("manual");
  }

  const selectedPatient = getPatientById(patientId);

  const certData: CertificatePreviewData = {
    clinicName: CLINIC_NAME,
    doctorName: DOCTOR_NAME,
    type: certType,
    patientName: selectedPatient?.name ?? "—",
    ageLabel,
    parentName,
    examinationDate,
    purpose: purpose || "—",
    restRecommendation,
    doctorNotes,
  };

  return (
    <div className="space-y-8">
      <div className="no-print">
        <PageHeader
          title="Laporan & Sertifikat"
          description="Cetak laporan kunjungan dan surat keterangan sehat/sakit untuk pasien anak."
        />
        <DummyNotice />

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTab("report")}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              tab === "report"
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Laporan Kunjungan
          </button>
          <button
            type="button"
            onClick={() => setTab("certificate")}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              tab === "certificate"
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Surat Sehat/Sakit
          </button>
        </div>
      </div>

      {/* === Visit report tab === */}
      {tab === "report" && (
        <div className="space-y-6">
          <section className="no-print card space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex-1">
                <label className="label" htmlFor="entry">
                  Pilih Kunjungan (sudah ada SOAP)
                </label>
                <select
                  id="entry"
                  className="input"
                  value={entryId}
                  onChange={(e) => setEntryId(e.target.value)}
                >
                  {reportableEntries.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.patientName} · {q.visitType} · {q.queueNumber}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                {isApproved && (
                  <StatusBadge tone="safe">Disetujui Dokter</StatusBadge>
                )}
                {canApprove && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() =>
                      setApprovedIds((prev) => ({
                        ...prev,
                        [entryId]: !prev[entryId],
                      }))
                    }
                  >
                    {isApproved ? "Batalkan Persetujuan" : "Setujui Laporan"}
                  </button>
                )}
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => window.print()}
                >
                  Cetak / Simpan PDF
                </button>
              </div>
            </div>
          </section>

          {reportData ? (
            <ReportPreview data={reportData} />
          ) : (
            <div className="card text-center text-sm text-gray-400">
              Belum ada kunjungan dengan catatan SOAP yang dapat dilaporkan.
            </div>
          )}
        </div>
      )}

      {/* === Certificate tab === */}
      {tab === "certificate" && (
        <div className="space-y-6">
          <section className="no-print card space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="certType">
                  Jenis Surat
                </label>
                <select
                  id="certType"
                  className="input"
                  value={certType}
                  onChange={(e) =>
                    changeCertType(e.target.value as CertificateType)
                  }
                >
                  <option value="Surat Keterangan Sakit">
                    Surat Keterangan Sakit
                  </option>
                  <option value="Surat Keterangan Sehat">
                    Surat Keterangan Sehat
                  </option>
                </select>
              </div>

              <div>
                <label className="label" htmlFor="source">
                  Prefill dari Contoh (opsional)
                </label>
                <select
                  id="source"
                  className="input"
                  value={sourceCertId}
                  onChange={(e) => applySource(e.target.value)}
                >
                  <option value="manual">— Isi Manual —</option>
                  {certsOfType.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.patientName} · {c.examinationDate}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label" htmlFor="certPatient">
                  Pasien (Anak)
                </label>
                <select
                  id="certPatient"
                  className="input"
                  value={patientId}
                  onChange={(e) => applyPatient(e.target.value)}
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} · {p.id}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label" htmlFor="ageLabel">
                  Usia
                </label>
                <input
                  id="ageLabel"
                  className="input"
                  value={ageLabel}
                  onChange={(e) => setAgeLabel(e.target.value)}
                />
              </div>

              <div>
                <label className="label" htmlFor="parentName">
                  Nama Orang Tua/Wali
                </label>
                <input
                  id="parentName"
                  className="input"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                />
              </div>

              <div>
                <label className="label" htmlFor="examDate">
                  Tanggal Pemeriksaan
                </label>
                <input
                  id="examDate"
                  type="date"
                  className="input"
                  value={examinationDate}
                  onChange={(e) => setExaminationDate(e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="label" htmlFor="purpose">
                  Keperluan
                </label>
                <input
                  id="purpose"
                  className="input"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="cth. Izin tidak masuk sekolah"
                />
              </div>

              {certType === "Surat Keterangan Sakit" && (
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="rest">
                    Rekomendasi Istirahat
                  </label>
                  <input
                    id="rest"
                    className="input"
                    value={restRecommendation}
                    onChange={(e) => setRestRecommendation(e.target.value)}
                    placeholder="cth. Istirahat selama 2 (dua) hari."
                  />
                </div>
              )}

              <div className="sm:col-span-2">
                <label className="label" htmlFor="notes">
                  Catatan Dokter
                </label>
                <input
                  id="notes"
                  className="input"
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="btn-primary"
                onClick={() => window.print()}
              >
                Cetak / Simpan PDF
              </button>
            </div>
          </section>

          <CertificatePreview data={certData} />
        </div>
      )}
    </div>
  );
}
