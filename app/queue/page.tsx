"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import QueueTable from "@/components/QueueTable";
import { useRole } from "@/components/RoleContext";
import { queue as initialQueue } from "@/data/queue";
import { patients } from "@/data/patients";
import { visitTypes, queueStatuses, channels, FAIRNESS_RULE } from "@/data/visits";
import {
  QueueEntry,
  QueueStatus,
  RegistrationChannel,
  VisitType,
} from "@/data/types";

type StatusFilter = "Semua" | QueueStatus;

// Visual representation of the 2 online : 1 offline fairness cycle.
function buildFairnessPattern(): RegistrationChannel[] {
  const pattern: RegistrationChannel[] = [];
  for (let cycle = 0; cycle < 2; cycle++) {
    for (let i = 0; i < FAIRNESS_RULE.onlinePerCycle; i++) pattern.push("online");
    for (let i = 0; i < FAIRNESS_RULE.offlinePerCycle; i++) pattern.push("offline");
  }
  return pattern;
}

export default function QueuePage() {
  const { role } = useRole();
  const canManage = role === "nurse" || role === "admin" || role === "developer";

  const [entries, setEntries] = useState<QueueEntry[]>(initialQueue);
  const [filter, setFilter] = useState<StatusFilter>("Semua");

  // Registration form state.
  const [patientId, setPatientId] = useState<string>(patients[0]?.id ?? "");
  const [channel, setChannel] = useState<RegistrationChannel>("online");
  const [visitType, setVisitType] = useState<VisitType>(visitTypes[0]);

  const counts = useMemo(() => {
    const byStatus: Record<string, number> = {};
    for (const q of entries) byStatus[q.status] = (byStatus[q.status] ?? 0) + 1;
    return {
      total: entries.length,
      online: entries.filter((q) => q.channel === "online").length,
      offline: entries.filter((q) => q.channel === "offline").length,
      byStatus,
    };
  }, [entries]);

  const filtered = useMemo(
    () => (filter === "Semua" ? entries : entries.filter((q) => q.status === filter)),
    [entries, filter]
  );

  // Generate the next queue number based on channel prefix (A = online, B = offline).
  function nextQueueNumber(ch: RegistrationChannel): string {
    const prefix = ch === "online" ? "A" : "B";
    const samePrefix = entries.filter((q) => q.queueNumber.startsWith(`${prefix}-`));
    const next = samePrefix.length + 1;
    return `${prefix}-${String(next).padStart(2, "0")}`;
  }

  function handleRegister() {
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;

    const now = new Date();
    const checkInTime = now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newEntry: QueueEntry = {
      id: `Q-NEW-${Date.now()}`,
      queueNumber: nextQueueNumber(channel),
      patientId: patient.id,
      patientName: patient.name,
      channel,
      visitType,
      status: "Menunggu Registrasi",
      priority: false,
      checkInTime,
      waitingMinutes: 0,
    };

    setEntries((prev) => [newEntry, ...prev]);
  }

  // Advance an entry to the next status in queueStatuses order (no-op if Selesai).
  function advanceStatus(id: string) {
    setEntries((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;
        const idx = queueStatuses.indexOf(q.status);
        if (idx < 0 || idx >= queueStatuses.length - 1) return q;
        return { ...q, status: queueStatuses[idx + 1] };
      })
    );
  }

  const fairnessPattern = buildFairnessPattern();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Registrasi & Antrean"
        description="Daftarkan kunjungan pasien dan kelola antrean harian klinik."
      />

      {/* Counts */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="card">
          <p className="card-title">Total Antrean</p>
          <p className="mt-1 text-2xl font-bold text-gray-800">{counts.total}</p>
        </div>
        <div className="card">
          <p className="card-title">Online</p>
          <p className="mt-1 text-2xl font-bold text-brand-700">{counts.online}</p>
        </div>
        <div className="card">
          <p className="card-title">Offline</p>
          <p className="mt-1 text-2xl font-bold text-gray-700">{counts.offline}</p>
        </div>
        <div className="card">
          <p className="card-title">Selesai</p>
          <p className="mt-1 text-2xl font-bold text-safe-text">
            {counts.byStatus["Selesai"] ?? 0}
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Registration panel */}
        <section className="card lg:col-span-1">
          <h2 className="section-title mb-4">Registrasi Pasien</h2>
          <div className="space-y-4">
            <div>
              <label className="label" htmlFor="patient">
                Pasien
              </label>
              <select
                id="patient"
                className="input"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} · {p.id}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label" htmlFor="channel">
                Kanal Pendaftaran
              </label>
              <select
                id="channel"
                className="input"
                value={channel}
                onChange={(e) => setChannel(e.target.value as RegistrationChannel)}
              >
                {channels.map((c) => (
                  <option key={c} value={c}>
                    {c === "online" ? "Online" : "Offline"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label" htmlFor="visitType">
                Jenis Kunjungan
              </label>
              <select
                id="visitType"
                className="input"
                value={visitType}
                onChange={(e) => setVisitType(e.target.value as VisitType)}
              >
                {visitTypes.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <button type="button" className="btn-primary w-full" onClick={handleRegister}>
              Tambahkan ke Antrean
            </button>
            <p className="text-xs text-gray-400">
              Simulasi — data antrean tersimpan sementara di halaman ini dan akan
              tereset saat halaman dimuat ulang.
            </p>
          </div>
        </section>

        {/* Fairness rule card */}
        <section className="card lg:col-span-2">
          <h2 className="section-title mb-2">Aturan Keadilan Antrean</h2>
          <p className="mb-4 text-sm text-gray-500">
            {FAIRNESS_RULE.description} ({FAIRNESS_RULE.onlinePerCycle} online :{" "}
            {FAIRNESS_RULE.offlinePerCycle} offline)
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {fairnessPattern.map((ch, i) => (
              <div key={i} className="flex items-center gap-2">
                {i > 0 && i % (FAIRNESS_RULE.onlinePerCycle + FAIRNESS_RULE.offlinePerCycle) === 0 && (
                  <span className="text-gray-300">|</span>
                )}
                <StatusBadge tone={ch === "online" ? "online" : "offline"}>
                  {ch === "online" ? "Online" : "Offline"}
                </StatusBadge>
              </div>
            ))}
            <span className="text-sm text-gray-400">…</span>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            Pola di atas menjaga giliran adil antara pasien daftar online dan offline.
          </p>
        </section>
      </div>

      {/* Live queue */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="section-title">Antrean Hari Ini</h2>
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap gap-2">
          {(["Semua", ...queueStatuses] as StatusFilter[]).map((s) => {
            const active = filter === s;
            const count = s === "Semua" ? counts.total : counts.byStatus[s] ?? 0;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setFilter(s)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {s} ({count})
              </button>
            );
          })}
        </div>

        <QueueTable
          entries={filtered}
          renderAction={
            canManage
              ? (entry) =>
                  entry.status === "Selesai" ? (
                    <span className="text-xs text-gray-300">—</span>
                  ) : (
                    <button
                      type="button"
                      className="btn-secondary px-3 py-1.5 text-xs"
                      onClick={() => advanceStatus(entry.id)}
                    >
                      Status berikutnya →
                    </button>
                  )
              : undefined
          }
        />
        {!canManage && (
          <p className="text-xs text-gray-400">
            Hanya perawat dan admin yang dapat memajukan status antrean.
          </p>
        )}
      </section>
    </div>
  );
}
