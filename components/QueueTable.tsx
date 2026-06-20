"use client";

import { ReactNode } from "react";
import StatusBadge from "@/components/StatusBadge";
import { QueueEntry, QueueStatus } from "@/data/types";

// Maps a queue status to a StatusBadge tone.
// Selesai -> safe (green); waiting / report-ready -> warn (amber).
function toneForQueueStatus(status: QueueStatus): "safe" | "warn" | "info" {
  if (status === "Selesai") return "safe";
  if (status.startsWith("Menunggu") || status === "Laporan Siap") return "warn";
  return "info";
}

interface QueueTableProps {
  entries: QueueEntry[];
  // Optional per-row action (e.g. "advance status" button for nurse/admin).
  renderAction?: (entry: QueueEntry) => ReactNode;
}

function ChannelBadge({ channel }: { channel: QueueEntry["channel"] }) {
  return channel === "online" ? (
    <StatusBadge tone="online">Online</StatusBadge>
  ) : (
    <StatusBadge tone="offline">Offline</StatusBadge>
  );
}

export default function QueueTable({ entries, renderAction }: QueueTableProps) {
  if (entries.length === 0) {
    return (
      <div className="card text-center text-sm text-gray-400">
        Tidak ada pasien pada antrian ini.
      </div>
    );
  }

  return (
    <div>
      {/* Table view — lg and up */}
      <div className="hidden overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm lg:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-400">
              <th className="px-4 py-3">No.</th>
              <th className="px-4 py-3">Pasien</th>
              <th className="px-4 py-3">Kanal</th>
              <th className="px-4 py-3">Jenis Kunjungan</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Menunggu</th>
              {renderAction && <th className="px-4 py-3 text-right">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {entries.map((q) => (
              <tr key={q.id} className="align-middle hover:bg-brand-50/40">
                <td className="px-4 py-3">
                  <span className="rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                    {q.queueNumber}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">{q.patientName}</span>
                    {q.priority && (
                      <StatusBadge tone="danger">Prioritas</StatusBadge>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">{q.patientId}</span>
                </td>
                <td className="px-4 py-3">
                  <ChannelBadge channel={q.channel} />
                </td>
                <td className="px-4 py-3 text-gray-600">{q.visitType}</td>
                <td className="px-4 py-3">
                  <StatusBadge tone={toneForQueueStatus(q.status)}>
                    {q.status}
                  </StatusBadge>
                </td>
                <td className="px-4 py-3 text-gray-600">{q.waitingMinutes} mnt</td>
                {renderAction && (
                  <td className="px-4 py-3 text-right">{renderAction(q)}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stacked card view — below lg */}
      <div className="space-y-3 lg:hidden">
        {entries.map((q) => (
          <div key={q.id} className="card">
            <div className="mb-2 flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                  {q.queueNumber}
                </span>
                <div>
                  <p className="font-medium text-gray-800">{q.patientName}</p>
                  <p className="text-xs text-gray-400">{q.patientId}</p>
                </div>
              </div>
              <ChannelBadge channel={q.channel} />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge tone={toneForQueueStatus(q.status)}>
                {q.status}
              </StatusBadge>
              {q.priority && <StatusBadge tone="danger">Prioritas</StatusBadge>}
              <span className="text-xs text-gray-500">· {q.visitType}</span>
              <span className="text-xs text-gray-500">· {q.waitingMinutes} mnt</span>
            </div>

            {renderAction && (
              <div className="mt-3 flex justify-end">{renderAction(q)}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
