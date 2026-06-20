"use client";

import StatusBadge from "@/components/StatusBadge";
import { Invoice, InvoiceStatus, invoiceTotal } from "@/data/billing";
import { formatRupiah } from "@/data/pricing";
import { CLINIC_NAME } from "@/data/users";

// Map invoice status to a colour tone for the badge.
function statusTone(status: InvoiceStatus): "safe" | "warn" | "danger" {
  if (status === "Lunas") return "safe";
  if (status === "Sebagian") return "warn";
  return "danger";
}

export default function ReceiptPreview({ invoice }: { invoice: Invoice }) {
  const total = invoiceTotal(invoice);

  return (
    <div className="print-area mx-auto max-w-[800px] rounded-2xl border border-gray-200 bg-white p-10 text-sm leading-relaxed text-gray-800 shadow-sm">
      {/* Letterhead */}
      <header className="border-b-2 border-brand-600 pb-4 text-center">
        <h2 className="text-lg font-bold text-brand-700">{CLINIC_NAME}</h2>
        <p className="mt-1 text-xs text-gray-500">
          Praktik Dokter Spesialis Anak · Yogyakarta
        </p>
      </header>

      <h3 className="mt-8 text-center text-lg font-bold uppercase tracking-wide text-gray-800 underline">
        Kwitansi Pembayaran
      </h3>

      {/* Invoice meta + patient */}
      <section className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="space-y-1.5">
          <div className="flex gap-2">
            <span className="w-32 shrink-0 text-gray-500">No. Invoice</span>
            <span className="text-gray-800">: {invoice.id}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-32 shrink-0 text-gray-500">Tanggal</span>
            <span className="text-gray-800">: {invoice.date}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-32 shrink-0 text-gray-500">Jenis Kunjungan</span>
            <span className="text-gray-800">: {invoice.visitType}</span>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex gap-2">
            <span className="w-32 shrink-0 text-gray-500">Nama Anak</span>
            <span className="text-gray-800">: An. {invoice.patientName}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-32 shrink-0 text-gray-500">Orang Tua/Wali</span>
            <span className="text-gray-800">: {invoice.parentName}</span>
          </div>
        </div>
      </section>

      {/* Line items */}
      <section className="mt-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-300 text-left text-gray-500">
              <th className="py-2 pr-2 font-semibold">Deskripsi</th>
              <th className="py-2 px-2 text-center font-semibold">Qty</th>
              <th className="py-2 px-2 text-right font-semibold">Harga Satuan</th>
              <th className="py-2 pl-2 text-right font-semibold">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lines.map((line, idx) => (
              <tr key={`${line.description}-${idx}`} className="border-b border-gray-100">
                <td className="py-2 pr-2 text-gray-800">{line.description}</td>
                <td className="py-2 px-2 text-center text-gray-700">{line.qty}</td>
                <td className="py-2 px-2 text-right text-gray-700">
                  {formatRupiah(line.unitPrice)}
                </td>
                <td className="py-2 pl-2 text-right text-gray-800">
                  {formatRupiah(line.qty * line.unitPrice)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="py-3 pr-2 text-right text-base font-bold text-gray-800">
                TOTAL
              </td>
              <td className="py-3 pl-2 text-right text-base font-bold text-brand-700">
                {formatRupiah(total)}
              </td>
            </tr>
          </tfoot>
        </table>
      </section>

      {/* Payment method + status */}
      <section className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <span className="text-gray-500">Metode Pembayaran</span>
          <span className="text-gray-800">: {invoice.method}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Status</span>
          <StatusBadge tone={statusTone(invoice.status)}>{invoice.status}</StatusBadge>
        </div>
      </section>

      {/* Signature / cap placeholder */}
      <section className="mt-10 flex justify-end">
        <div className="text-center text-sm">
          <p className="text-gray-600">Kasir,</p>
          <div className="h-16" />
          <p className="text-gray-700">(................................)</p>
          <p className="mt-1 font-semibold text-gray-800">Kasir Klinik</p>
        </div>
      </section>

      <p className="mt-8 text-center text-[10px] text-gray-400">
        Dokumen ini dihasilkan dari prototype SEHA — data dummy untuk demonstrasi.
      </p>
    </div>
  );
}
