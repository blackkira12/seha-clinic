"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import DummyNotice from "@/components/DummyNotice";
import ReceiptPreview from "@/components/ReceiptPreview";
import { useRole } from "@/components/RoleContext";
import {
  invoices as initialInvoices,
  tariffCatalogue,
  paymentMethods,
  invoiceTotal,
  Invoice,
  InvoiceLine,
  InvoiceStatus,
  PaymentMethod,
} from "@/data/billing";
import { patients } from "@/data/patients";
import { formatRupiah } from "@/data/pricing";

const TODAY = "2026-06-19";

// Map invoice status to a colour tone for the list badges.
function statusTone(status: InvoiceStatus): "safe" | "warn" | "danger" {
  if (status === "Lunas") return "safe";
  if (status === "Sebagian") return "warn";
  return "danger";
}

// Generate the next INV-2026-00XX id based on current invoice count.
function nextInvoiceId(existing: Invoice[]): string {
  const num = existing.length + 1;
  return `INV-2026-${String(num).padStart(4, "0")}`;
}

export default function BillingPage() {
  const { role } = useRole();
  const canEdit = role === "admin" || role === "developer";

  const [invoiceList, setInvoiceList] = useState<Invoice[]>(initialInvoices);
  const [selectedId, setSelectedId] = useState<string>(
    initialInvoices[0]?.id ?? ""
  );

  // ---- New invoice draft state (create panel) ----
  const [draftPatientId, setDraftPatientId] = useState<string>(
    patients[0]?.id ?? ""
  );
  const [draftVisitType, setDraftVisitType] = useState<string>("");
  const [draftLines, setDraftLines] = useState<InvoiceLine[]>([]);
  const [draftMethod, setDraftMethod] = useState<PaymentMethod>(
    paymentMethods[0]
  );
  const [tariffPick, setTariffPick] = useState<string>(
    tariffCatalogue[0]?.description ?? ""
  );

  const selected = invoiceList.find((inv) => inv.id === selectedId);

  // ---- Summary metrics ----
  const totalToday = useMemo(
    () => invoiceList.reduce((sum, inv) => sum + invoiceTotal(inv), 0),
    [invoiceList]
  );
  const countLunas = useMemo(
    () => invoiceList.filter((inv) => inv.status === "Lunas").length,
    [invoiceList]
  );
  const countBelum = useMemo(
    () => invoiceList.filter((inv) => inv.status === "Belum Dibayar").length,
    [invoiceList]
  );

  const draftTotal = useMemo(() => invoiceTotal({ lines: draftLines }), [
    draftLines,
  ]);

  // ---- Mutators ----
  function addTariffLine() {
    const item = tariffCatalogue.find((t) => t.description === tariffPick);
    if (!item) return;
    setDraftLines((prev) => [...prev, { ...item }]);
  }

  function removeLine(index: number) {
    setDraftLines((prev) => prev.filter((_, i) => i !== index));
  }

  function saveInvoice() {
    if (!canEdit) return;
    if (draftLines.length === 0) return;
    const patient = patients.find((p) => p.id === draftPatientId);
    if (!patient) return;

    const newInvoice: Invoice = {
      id: nextInvoiceId(invoiceList),
      date: TODAY,
      patientName: patient.name,
      parentName: patient.parentName,
      visitType: draftVisitType.trim() || "Konsultasi Umum",
      lines: draftLines,
      method: draftMethod,
      status: "Belum Dibayar",
    };

    setInvoiceList((prev) => [newInvoice, ...prev]);
    setSelectedId(newInvoice.id);
    // Reset draft.
    setDraftLines([]);
    setDraftVisitType("");
  }

  function markPaid(id: string) {
    if (!canEdit) return;
    setInvoiceList((prev) =>
      prev.map((inv) =>
        inv.id === id && inv.status !== "Lunas"
          ? { ...inv, status: "Lunas" }
          : inv
      )
    );
  }

  return (
    <div className="space-y-6">
      <div className="no-print">
        <PageHeader
          title="Kasir & Billing"
          description="Pembuatan invoice, pencatatan pembayaran, dan cetak kwitansi pasien."
        />

        <DummyNotice text="Data tagihan pada halaman ini adalah data dummy. Pembuatan invoice hanya simulasi sesi (tidak tersimpan permanen)." />
      </div>

      {/* SUMMARY CARDS */}
      <div className="no-print grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card border-safe-border">
          <p className="card-title text-gray-500">Total Tagihan Hari Ini</p>
          <p className="mt-1 text-2xl font-bold text-safe-text">
            {formatRupiah(totalToday)}
          </p>
          <p className="mt-1 text-xs text-gray-400">{invoiceList.length} invoice</p>
        </div>
        <div className="card border-safe-border">
          <p className="card-title text-gray-500">Invoice Lunas</p>
          <p className="mt-1 text-2xl font-bold text-safe-text">{countLunas}</p>
          <p className="mt-1 text-xs text-gray-400">sudah dibayar</p>
        </div>
        <div className="card border-danger-border">
          <p className="card-title text-gray-500">Belum Dibayar</p>
          <p className="mt-1 text-2xl font-bold text-danger-text">{countBelum}</p>
          <p className="mt-1 text-xs text-gray-400">menunggu pembayaran</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_minmax(0,1.1fr)]">
        {/* LEFT: list + create */}
        <div className="no-print space-y-6">
          {/* INVOICE LIST */}
          <section className="card">
            <h2 className="section-title mb-4">Daftar Invoice</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500">
                    <th className="py-2 pr-2 font-semibold">ID</th>
                    <th className="py-2 px-2 font-semibold">Pasien</th>
                    <th className="py-2 px-2 font-semibold">Kunjungan</th>
                    <th className="py-2 px-2 text-right font-semibold">Total</th>
                    <th className="py-2 px-2 font-semibold">Metode</th>
                    <th className="py-2 pl-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceList.map((inv) => {
                    const active = inv.id === selectedId;
                    return (
                      <tr
                        key={inv.id}
                        onClick={() => setSelectedId(inv.id)}
                        className={`cursor-pointer border-b border-gray-100 transition ${
                          active ? "bg-brand-50" : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="py-2 pr-2 font-medium text-gray-700">
                          {inv.id}
                        </td>
                        <td className="py-2 px-2 text-gray-800">
                          {inv.patientName}
                        </td>
                        <td className="py-2 px-2 text-gray-600">{inv.visitType}</td>
                        <td className="py-2 px-2 text-right text-gray-800">
                          {formatRupiah(invoiceTotal(inv))}
                        </td>
                        <td className="py-2 px-2 text-gray-600">{inv.method}</td>
                        <td className="py-2 pl-2">
                          <StatusBadge tone={statusTone(inv.status)}>
                            {inv.status}
                          </StatusBadge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-gray-400">
              Klik baris untuk menampilkan kwitansi di samping.
            </p>
          </section>

          {/* CREATE INVOICE */}
          <section className="card">
            <h2 className="section-title mb-4">Buat Invoice Baru</h2>

            {!canEdit ? (
              <p className="rounded-xl border border-warn-border bg-warn-bg px-4 py-3 text-sm text-warn-text">
                Mode hanya-baca. Hanya admin / developer yang dapat membuat invoice
                atau menandai pembayaran.
              </p>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="draftPatient">
                      Pasien
                    </label>
                    <select
                      id="draftPatient"
                      className="input"
                      value={draftPatientId}
                      onChange={(e) => setDraftPatientId(e.target.value)}
                    >
                      {patients.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {p.parentName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label" htmlFor="draftVisitType">
                      Jenis Kunjungan
                    </label>
                    <input
                      id="draftVisitType"
                      type="text"
                      className="input"
                      placeholder="mis. Imunisasi, Konsultasi Umum"
                      value={draftVisitType}
                      onChange={(e) => setDraftVisitType(e.target.value)}
                    />
                  </div>
                </div>

                {/* Add item from tariff catalogue */}
                <div className="mt-4">
                  <label className="label" htmlFor="tariffPick">
                    Tambah Item dari Tarif
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <select
                      id="tariffPick"
                      className="input"
                      value={tariffPick}
                      onChange={(e) => setTariffPick(e.target.value)}
                    >
                      {tariffCatalogue.map((t) => (
                        <option key={t.description} value={t.description}>
                          {t.description} — {formatRupiah(t.unitPrice)}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="btn-secondary whitespace-nowrap"
                      onClick={addTariffLine}
                    >
                      Tambah Item
                    </button>
                  </div>
                </div>

                {/* Draft line items */}
                <div className="mt-4">
                  {draftLines.length === 0 ? (
                    <p className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-400">
                      Belum ada item. Tambahkan minimal satu item tarif.
                    </p>
                  ) : (
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 text-left text-gray-500">
                          <th className="py-2 pr-2 font-semibold">Deskripsi</th>
                          <th className="py-2 px-2 text-center font-semibold">Qty</th>
                          <th className="py-2 px-2 text-right font-semibold">
                            Subtotal
                          </th>
                          <th className="py-2 pl-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {draftLines.map((line, idx) => (
                          <tr
                            key={`${line.description}-${idx}`}
                            className="border-b border-gray-100"
                          >
                            <td className="py-2 pr-2 text-gray-800">
                              {line.description}
                            </td>
                            <td className="py-2 px-2 text-center text-gray-700">
                              {line.qty}
                            </td>
                            <td className="py-2 px-2 text-right text-gray-800">
                              {formatRupiah(line.qty * line.unitPrice)}
                            </td>
                            <td className="py-2 pl-2 text-right">
                              <button
                                type="button"
                                className="text-xs font-medium text-danger-text hover:underline"
                                onClick={() => removeLine(idx)}
                              >
                                Hapus
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Payment method + live total */}
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="draftMethod">
                      Metode Pembayaran
                    </label>
                    <select
                      id="draftMethod"
                      className="input"
                      value={draftMethod}
                      onChange={(e) =>
                        setDraftMethod(e.target.value as PaymentMethod)
                      }
                    >
                      {paymentMethods.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <div className="w-full rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5">
                      <span className="text-xs text-gray-500">Total</span>
                      <p className="text-lg font-bold text-brand-700">
                        {formatRupiah(draftTotal)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={draftLines.length === 0}
                    onClick={saveInvoice}
                  >
                    Simpan Invoice
                  </button>
                </div>
              </>
            )}
          </section>
        </div>

        {/* RIGHT: receipt preview */}
        <div className="space-y-4">
          <div className="no-print flex flex-wrap items-center gap-3">
            <h2 className="section-title mr-auto">Kwitansi</h2>
            {selected && (
              <>
                {canEdit && selected.status !== "Lunas" && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => markPaid(selected.id)}
                  >
                    Tandai Lunas
                  </button>
                )}
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => window.print()}
                >
                  Cetak / Simpan PDF
                </button>
              </>
            )}
          </div>

          {selected ? (
            <ReceiptPreview invoice={selected} />
          ) : (
            <div className="no-print card text-sm text-gray-500">
              Pilih invoice dari daftar untuk menampilkan kwitansi.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
