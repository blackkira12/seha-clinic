"use client";

import { useMemo, useState } from "react";
import StatusBadge from "@/components/StatusBadge";
import { buildWhatsAppMessage } from "@/data/reminders";
import { Reminder, ReminderStatus } from "@/data/types";

interface ReminderCardProps {
  reminder: Reminder;
  // Optional callback so a parent page can persist status changes in its own state.
  onAdvanceStatus?: (id: string, next: ReminderStatus) => void;
}

// Status order used by the local "advance" control.
const STATUS_FLOW: ReminderStatus[] = [
  "Pending",
  "Siap Dihubungi",
  "Sudah Dihubungi Manual",
  "Selesai",
];

// Maps a reminder status to a colour tone for the badge.
function toneForReminderStatus(status: ReminderStatus) {
  switch (status) {
    case "Pending":
    case "Siap Dihubungi":
      return "warn" as const;
    case "Sudah Dihubungi Manual":
      return "info" as const;
    case "Selesai":
      return "safe" as const;
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ReminderCard({ reminder, onAdvanceStatus }: ReminderCardProps) {
  const [copied, setCopied] = useState(false);

  const message = useMemo(
    () =>
      buildWhatsAppMessage({
        parentName: reminder.parentName,
        patientName: reminder.patientName,
        type: reminder.type,
        dueDate: reminder.dueDate,
      }),
    [reminder.parentName, reminder.patientName, reminder.type, reminder.dueDate]
  );

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be unavailable (e.g. insecure context) — fail silently in prototype.
      setCopied(false);
    }
  }

  const statusIdx = STATUS_FLOW.indexOf(reminder.status);
  const nextStatus = statusIdx >= 0 && statusIdx < STATUS_FLOW.length - 1
    ? STATUS_FLOW[statusIdx + 1]
    : null;

  return (
    <div className="card flex h-full flex-col gap-3 transition hover:border-brand-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-gray-800">{reminder.patientName}</p>
          <p className="truncate text-xs text-gray-400">
            {reminder.parentName} · {reminder.parentPhone}
          </p>
        </div>
        <StatusBadge tone={toneForReminderStatus(reminder.status)}>
          {reminder.status}
        </StatusBadge>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge tone="info">{reminder.type}</StatusBadge>
        <span className="text-xs text-gray-500">Jatuh tempo: {formatDate(reminder.dueDate)}</span>
      </div>

      {reminder.note && <p className="text-sm text-gray-600">{reminder.note}</p>}

      <div>
        <p className="label">Pesan WhatsApp (manual)</p>
        <textarea
          readOnly
          value={message}
          rows={4}
          className="input resize-none bg-gray-50 text-xs text-gray-600"
          aria-label="Pratinjau pesan WhatsApp"
        />
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-2">
        <button type="button" className="btn-primary text-xs" onClick={handleCopy}>
          {copied ? "Tersalin!" : "Salin Pesan WhatsApp"}
        </button>
        {onAdvanceStatus && nextStatus && (
          <button
            type="button"
            className="btn-secondary text-xs"
            onClick={() => onAdvanceStatus(reminder.id, nextStatus)}
          >
            Tandai: {nextStatus} →
          </button>
        )}
        {onAdvanceStatus && !nextStatus && (
          <span className="text-xs text-safe-text">Selesai ditangani</span>
        )}
      </div>
    </div>
  );
}
