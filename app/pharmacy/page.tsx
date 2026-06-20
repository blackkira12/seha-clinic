"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import DummyNotice from "@/components/DummyNotice";
import InventoryTable from "@/components/InventoryTable";
import { useRole } from "@/components/RoleContext";
import {
  inventory,
  compoundedMedicines as initialCompounds,
  deriveStatus,
} from "@/data/inventory";
import {
  stockMovements as initialMovements,
  movementTypes,
  applyMovement,
  StockMovement,
  MovementType,
} from "@/data/stockMovement";
import { queue } from "@/data/queue";
import {
  InventoryCategory,
  CompoundStatus,
  CompoundedMedicine,
  InventoryItem,
} from "@/data/types";

const CATEGORIES: InventoryCategory[] = [
  "Obat",
  "Vaksin / Imunisasi",
  "Bahan Habis Pakai",
  "Bahan Obat Racik",
];

type CategoryFilter = "Semua" | InventoryCategory;

const COMPOUND_FLOW: CompoundStatus[] = [
  "Menunggu",
  "Sedang Diracik",
  "Selesai Diracik",
  "Diserahkan",
];

function nextCompoundStatus(status: CompoundStatus): CompoundStatus {
  const idx = COMPOUND_FLOW.indexOf(status);
  if (idx < 0 || idx >= COMPOUND_FLOW.length - 1) return status;
  return COMPOUND_FLOW[idx + 1];
}

function compoundTone(status: CompoundStatus): "safe" | "warn" | "info" {
  if (status === "Diserahkan") return "safe";
  if (status === "Selesai Diracik") return "info";
  return "warn";
}

function movementTone(type: MovementType): "safe" | "danger" | "info" {
  if (type === "Penerimaan") return "safe";
  if (type === "Pemakaian") return "danger";
  return "info";
}

function movementSign(type: MovementType): string {
  if (type === "Penerimaan") return "+";
  if (type === "Pemakaian") return "−";
  return "=";
}

const TODAY_LABEL = "2026-06-19";

export default function PharmacyPage() {
  const { role, user } = useRole();
  const canManage =
    role === "pharmacist" || role === "admin" || role === "developer";

  const [filter, setFilter] = useState<CategoryFilter>("Semua");

  // Live inventory state so stock movements actually change the numbers.
  const [items, setItems] = useState<InventoryItem[]>(inventory);
  const [movements, setMovements] =
    useState<StockMovement[]>(initialMovements);

  // Movement form state.
  const [moveItemId, setMoveItemId] = useState<string>(inventory[0]?.id ?? "");
  const [moveType, setMoveType] = useState<MovementType>("Pemakaian");
  const [moveQty, setMoveQty] = useState<string>("");
  const [moveNote, setMoveNote] = useState<string>("");

  const prescriptions = useMemo(
    () =>
      queue.filter(
        (q) =>
          q.status === "Menunggu Farmasi" ||
          (q.soap?.medicationInstructions ?? "").trim().length > 0
      ),
    []
  );
  const [dispensed, setDispensed] = useState<Record<string, boolean>>({});

  const [compounds, setCompounds] =
    useState<CompoundedMedicine[]>(initialCompounds);

  // Derive everything reactively from the LIVE items state.
  const alerts = useMemo(() => {
    const low = items.filter((i) => i.status === "Stok Menipis");
    const expiring = items.filter((i) => i.status === "Akan Kadaluarsa");
    const expired = items.filter((i) => i.status === "Kadaluarsa");
    return { low, expiring, expired };
  }, [items]);

  const consumables = useMemo(
    () => items.filter((i) => i.category === "Bahan Habis Pakai"),
    [items]
  );

  const filtered = useMemo(
    () =>
      filter === "Semua"
        ? items
        : items.filter((i) => i.category === filter),
    [filter, items]
  );

  const hasWarnings =
    alerts.low.length + alerts.expiring.length + alerts.expired.length > 0;

  function toggleDispensed(id: string) {
    setDispensed((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function advanceCompound(id: string) {
    setCompounds((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: nextCompoundStatus(c.status) } : c
      )
    );
  }

  // Record a stock movement: updates the item's stock + status, logs the movement.
  function recordMovement(e: React.FormEvent) {
    e.preventDefault();
    const qty = Number(moveQty);
    if (!moveItemId || !Number.isFinite(qty) || qty <= 0) return;
    const target = items.find((i) => i.id === moveItemId);
    if (!target) return;

    const newStock = applyMovement(target.currentStock, moveType, qty);

    setItems((prev) =>
      prev.map((i) =>
        i.id === moveItemId
          ? {
              ...i,
              currentStock: newStock,
              status: deriveStatus({
                currentStock: newStock,
                minimumStock: i.minimumStock,
                expiryDate: i.expiryDate,
              }),
            }
          : i
      )
    );

    const newMovement: StockMovement = {
      id: `MOV-${String(movements.length + 1).padStart(3, "0")}-${moveItemId}`,
      date: TODAY_LABEL,
      itemId: target.id,
      itemName: target.name,
      type: moveType,
      qty,
      note: moveNote.trim() || "—",
      by: user.name,
    };
    setMovements((prev) => [newMovement, ...prev]);
    setMoveQty("");
    setMoveNote("");
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Farmasi & Inventory"
        description="Pantau stok obat, vaksin, dan bahan habis pakai, kelola penyerahan resep, obat racik, dan pergerakan stok."
      />

      <DummyNotice />

      {/* Alert summary cards */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="card border-warn-border bg-warn-bg/40">
          <p className="card-title text-warn-text">Stok Menipis</p>
          <p className="mt-1 text-2xl font-bold text-warn-text">
            {alerts.low.length}
          </p>
        </div>
        <div className="card border-warn-border bg-warn-bg/40">
          <p className="card-title text-warn-text">Akan Kadaluarsa</p>
          <p className="mt-1 text-2xl font-bold text-warn-text">
            {alerts.expiring.length}
          </p>
        </div>
        <div className="card border-danger-border bg-danger-bg/40">
          <p className="card-title text-danger-text">Kadaluarsa</p>
          <p className="mt-1 text-2xl font-bold text-danger-text">
            {alerts.expired.length}
          </p>
        </div>
      </section>

      {/* Warning banner */}
      {hasWarnings && (
        <section className="rounded-2xl border border-warn-border bg-warn-bg px-5 py-4 text-sm text-warn-text">
          <p className="font-semibold">⚠️ Perlu perhatian</p>
          <ul className="mt-2 space-y-1">
            {alerts.expired.map((i) => (
              <li key={i.id}>
                <span className="font-medium">{i.name}</span> — sudah kadaluarsa
                (batch {i.batchNumber}, exp {i.expiryDate}).
              </li>
            ))}
            {alerts.expiring.map((i) => (
              <li key={i.id}>
                <span className="font-medium">{i.name}</span> — akan kadaluarsa
                ({i.expiryDate}).
              </li>
            ))}
            {alerts.low.map((i) => (
              <li key={i.id}>
                <span className="font-medium">{i.name}</span> — stok menipis (
                {i.currentStock}/{i.minimumStock} {i.unit}).
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Prescriptions waiting at pharmacy */}
      <section className="space-y-4">
        <h2 className="section-title">Resep Menunggu</h2>
        {prescriptions.length === 0 ? (
          <div className="card text-center text-sm text-gray-400">
            Tidak ada resep yang menunggu penyerahan.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {prescriptions.map((q) => {
              const done = dispensed[q.id];
              return (
                <div key={q.id} className="card">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {q.patientName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {q.queueNumber} · {q.visitType}
                      </p>
                    </div>
                    <StatusBadge tone={done ? "safe" : "warn"}>
                      {done ? "Sudah Diserahkan" : "Menunggu Diserahkan"}
                    </StatusBadge>
                  </div>
                  <p className="rounded-xl bg-brand-50/60 px-3 py-2 text-sm text-gray-700">
                    {q.soap?.medicationInstructions ??
                      "Instruksi obat menyusul dari dokter."}
                  </p>
                  {canManage ? (
                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        className="btn-secondary px-3 py-1.5 text-xs"
                        onClick={() => toggleDispensed(q.id)}
                      >
                        {done ? "Batalkan" : "Tandai Diserahkan"}
                      </button>
                    </div>
                  ) : (
                    <p className="mt-3 text-right text-xs text-gray-400">
                      Hanya apoteker yang dapat menandai penyerahan.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Inventory with category filters */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="section-title">Daftar Inventory</h2>
          {!canManage && (
            <span className="text-xs text-gray-400">
              Mode lihat — ketersediaan stok (read-only).
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {(["Semua", ...CATEGORIES] as CategoryFilter[]).map((c) => {
            const active = filter === c;
            const count =
              c === "Semua"
                ? items.length
                : items.filter((i) => i.category === c).length;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setFilter(c)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {c} ({count})
              </button>
            );
          })}
        </div>

        <InventoryTable items={filtered} />
      </section>

      {/* Stock movement (pergerakan stok) */}
      <section className="space-y-4">
        <div className="flex flex-col gap-1">
          <h2 className="section-title">Pergerakan Stok (Stock Movement)</h2>
          <p className="text-sm text-gray-500">
            Catat barang masuk (penerimaan), keluar (pemakaian/penyerahan), atau
            penyesuaian stok opname. Perubahan langsung memperbarui jumlah & status
            stok di atas.
          </p>
        </div>

        {canManage && (
          <form
            onSubmit={recordMovement}
            className="card grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:items-end"
          >
            <div className="lg:col-span-2">
              <label className="label" htmlFor="mv-item">
                Item
              </label>
              <select
                id="mv-item"
                className="input"
                value={moveItemId}
                onChange={(e) => setMoveItemId(e.target.value)}
              >
                {items.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name} (sisa {i.currentStock} {i.unit})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="mv-type">
                Jenis
              </label>
              <select
                id="mv-type"
                className="input"
                value={moveType}
                onChange={(e) => setMoveType(e.target.value as MovementType)}
              >
                {movementTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="mv-qty">
                {moveType === "Penyesuaian" ? "Jumlah Akhir" : "Jumlah"}
              </label>
              <input
                id="mv-qty"
                type="number"
                min={1}
                className="input"
                value={moveQty}
                onChange={(e) => setMoveQty(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-4">
              <label className="label" htmlFor="mv-note">
                Catatan
              </label>
              <input
                id="mv-note"
                type="text"
                className="input"
                value={moveNote}
                onChange={(e) => setMoveNote(e.target.value)}
                placeholder="Mis. pemakaian imunisasi pagi"
              />
            </div>
            <div className="lg:col-span-1">
              <button type="submit" className="btn-primary w-full">
                Catat Pergerakan
              </button>
            </div>
          </form>
        )}

        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-400">
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 font-medium">Item</th>
                <th className="px-4 py-3 font-medium">Jenis</th>
                <th className="px-4 py-3 font-medium">Jumlah</th>
                <th className="px-4 py-3 font-medium">Oleh</th>
                <th className="px-4 py-3 font-medium">Catatan</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((m) => (
                <tr key={m.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3 text-gray-500">{m.date}</td>
                  <td className="px-4 py-3 font-medium text-gray-700">
                    {m.itemName}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge tone={movementTone(m.type)}>{m.type}</StatusBadge>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-700">
                    {movementSign(m.type)}
                    {m.qty}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{m.by}</td>
                  <td className="px-4 py-3 text-gray-500">{m.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Compounded medicines */}
      <section className="space-y-4">
        <h2 className="section-title">Obat Racik</h2>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {compounds.map((c) => {
            const isFinal = c.status === "Diserahkan";
            return (
              <div key={c.id} className="card">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {c.patientName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {c.id} · Disiapkan oleh {c.preparedBy}
                    </p>
                  </div>
                  <StatusBadge tone={compoundTone(c.status)}>
                    {c.status}
                  </StatusBadge>
                </div>
                <p className="text-sm text-gray-700">{c.recipe}</p>
                {canManage && (
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-40"
                      disabled={isFinal}
                      onClick={() => advanceCompound(c.id)}
                    >
                      {isFinal
                        ? "Selesai"
                        : `Lanjut: ${nextCompoundStatus(c.status)} →`}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Consumables summary */}
      <section className="space-y-4">
        <h2 className="section-title">Ringkasan Bahan Habis Pakai</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {consumables.map((i) => (
            <div key={i.id} className="card">
              <p className="card-title">{i.name}</p>
              <p className="mt-1 text-xl font-bold text-gray-800">
                {i.currentStock}{" "}
                <span className="text-sm font-normal text-gray-400">
                  {i.unit}
                </span>
              </p>
              <p className="mt-1 text-xs text-gray-400">
                min. {i.minimumStock} {i.unit}
              </p>
              <div className="mt-2">
                <StatusBadge status={i.status}>{i.status}</StatusBadge>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
