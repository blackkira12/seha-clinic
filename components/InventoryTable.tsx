"use client";

import StatusBadge from "@/components/StatusBadge";
import { InventoryItem, InventoryStatus } from "@/data/types";
import { daysUntilExpiry } from "@/data/inventory";

// Maps an inventory status to a StatusBadge tone.
function toneForInventoryStatus(
  status: InventoryStatus
): "safe" | "warn" | "danger" {
  if (status === "Aman") return "safe";
  if (status === "Kadaluarsa") return "danger";
  // "Stok Menipis" & "Akan Kadaluarsa"
  return "warn";
}

// Human-readable expiry helper based on daysUntilExpiry.
function expiryLabel(days: number): string {
  if (days < 0) return `Kadaluarsa ${Math.abs(days)} hari lalu`;
  if (days === 0) return "Kadaluarsa hari ini";
  return `${days} hari lagi`;
}

interface InventoryTableProps {
  items: InventoryItem[];
}

export default function InventoryTable({ items }: InventoryTableProps) {
  if (items.length === 0) {
    return (
      <div className="card text-center text-sm text-gray-400">
        Tidak ada item pada kategori ini.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-400">
            <th className="px-4 py-3">Nama</th>
            <th className="px-4 py-3">Kategori</th>
            <th className="px-4 py-3">Stok</th>
            <th className="px-4 py-3">Batch</th>
            <th className="px-4 py-3">Kadaluarsa</th>
            <th className="px-4 py-3">Supplier</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {items.map((item) => {
            const days = daysUntilExpiry(item.expiryDate);
            const expiringSoon = days >= 0 && days <= 90;
            return (
              <tr key={item.id} className="align-middle hover:bg-brand-50/40">
                <td className="px-4 py-3">
                  <span className="font-medium text-gray-800">{item.name}</span>
                  <span className="block text-xs text-gray-400">{item.id}</span>
                </td>
                <td className="px-4 py-3 text-gray-600">{item.category}</td>
                <td className="px-4 py-3 text-gray-700">
                  <span
                    className={
                      item.currentStock <= item.minimumStock
                        ? "font-semibold text-warn-text"
                        : "font-medium text-gray-800"
                    }
                  >
                    {item.currentStock} / {item.minimumStock}
                  </span>{" "}
                  <span className="text-xs text-gray-400">{item.unit}</span>
                </td>
                <td className="px-4 py-3 text-gray-600">{item.batchNumber}</td>
                <td className="px-4 py-3">
                  <span className="block text-gray-700">{item.expiryDate}</span>
                  <span
                    className={`text-xs ${
                      days < 0
                        ? "text-danger-text"
                        : expiringSoon
                        ? "text-warn-text"
                        : "text-gray-400"
                    }`}
                  >
                    {expiryLabel(days)}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{item.supplier}</td>
                <td className="px-4 py-3">
                  <StatusBadge tone={toneForInventoryStatus(item.status)}>
                    {item.status}
                  </StatusBadge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
