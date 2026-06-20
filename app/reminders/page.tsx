"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import ReminderCard from "@/components/ReminderCard";
import { reminders as initialReminders } from "@/data/reminders";
import { Reminder, ReminderStatus, ReminderType } from "@/data/types";

const REMINDER_TYPES: ReminderType[] = [
  "Pengingat Imunisasi",
  "Pengingat Kontrol",
  "Pengingat Lanjutan Obat",
];

const REMINDER_STATUSES: ReminderStatus[] = [
  "Pending",
  "Siap Dihubungi",
  "Sudah Dihubungi Manual",
  "Selesai",
];

type TypeFilter = "Semua" | ReminderType;
type StatusFilter = "Semua" | ReminderStatus;

export default function RemindersPage() {
  const [items, setItems] = useState<Reminder[]>(initialReminders);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("Semua");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Semua");

  const counts = useMemo(() => {
    const byStatus: Record<string, number> = {};
    for (const r of items) byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
    return { total: items.length, byStatus };
  }, [items]);

  const filtered = useMemo(
    () =>
      items.filter(
        (r) =>
          (typeFilter === "Semua" || r.type === typeFilter) &&
          (statusFilter === "Semua" || r.status === statusFilter)
      ),
    [items, typeFilter, statusFilter]
  );

  function advanceStatus(id: string, next: ReminderStatus) {
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, status: next } : r)));
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Reminder Center"
        description="Pusat pengingat pasien — hanya kontak manual. Tidak ada blast WhatsApp otomatis; admin menyalin pesan lalu mengirim sendiri."
      />

      {/* Summary counts by status */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="card">
          <p className="card-title">Total Pengingat</p>
          <p className="mt-1 text-2xl font-bold text-gray-800">{counts.total}</p>
        </div>
        <div className="card">
          <p className="card-title">Pending</p>
          <p className="mt-1 text-2xl font-bold text-warn-text">
            {counts.byStatus["Pending"] ?? 0}
          </p>
        </div>
        <div className="card">
          <p className="card-title">Siap Dihubungi</p>
          <p className="mt-1 text-2xl font-bold text-warn-text">
            {counts.byStatus["Siap Dihubungi"] ?? 0}
          </p>
        </div>
        <div className="card">
          <p className="card-title">Selesai</p>
          <p className="mt-1 text-2xl font-bold text-safe-text">
            {counts.byStatus["Selesai"] ?? 0}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="space-y-3">
        <div>
          <p className="label">Filter jenis pengingat</p>
          <div className="flex flex-wrap gap-2">
            {(["Semua", ...REMINDER_TYPES] as TypeFilter[]).map((t) => {
              const active = typeFilter === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTypeFilter(t)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    active
                      ? "border-brand-600 bg-brand-600 text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="label">Filter status</p>
          <div className="flex flex-wrap gap-2">
            {(["Semua", ...REMINDER_STATUSES] as StatusFilter[]).map((s) => {
              const active = statusFilter === s;
              const count = s === "Semua" ? counts.total : counts.byStatus[s] ?? 0;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
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
        </div>
      </section>

      {/* Reminder grid */}
      {filtered.length > 0 ? (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((r) => (
            <ReminderCard key={r.id} reminder={r} onAdvanceStatus={advanceStatus} />
          ))}
        </section>
      ) : (
        <p className="card text-sm text-gray-500">
          Tidak ada pengingat yang cocok dengan filter saat ini.
        </p>
      )}

      <p className="text-xs text-gray-400">
        Simulasi — perubahan status tersimpan sementara di halaman ini dan akan tereset
        saat halaman dimuat ulang.
      </p>
    </div>
  );
}
