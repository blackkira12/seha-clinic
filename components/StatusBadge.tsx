import { ReactNode } from "react";

type Tone = "safe" | "warn" | "danger" | "info" | "neutral" | "online" | "offline";

const toneClasses: Record<Tone, string> = {
  safe: "bg-safe-bg text-safe-text border-safe-border",
  warn: "bg-warn-bg text-warn-text border-warn-border",
  danger: "bg-danger-bg text-danger-text border-danger-border",
  info: "bg-brand-50 text-brand-700 border-brand-200",
  neutral: "bg-gray-100 text-gray-600 border-gray-200",
  online: "bg-brand-50 text-brand-700 border-brand-200",
  offline: "bg-gray-100 text-gray-600 border-gray-200",
};

// Maps known domain status strings to a colour tone.
export function toneForStatus(status: string): Tone {
  const s = status.toLowerCase();
  if (["aman", "selesai", "sehat", "completed"].some((k) => s.includes(k))) return "safe";
  if (["menipis", "akan kadaluarsa", "pending", "menunggu", "siap"].some((k) => s.includes(k)))
    return "warn";
  if (["kadaluarsa", "sakit", "expired", "kritis"].some((k) => s.includes(k))) return "danger";
  if (s.includes("online")) return "online";
  if (s.includes("offline")) return "offline";
  return "info";
}

export default function StatusBadge({
  children,
  tone,
  status,
}: {
  children: ReactNode;
  tone?: Tone;
  status?: string;
}) {
  const resolved = tone ?? (status ? toneForStatus(status) : "neutral");
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${toneClasses[resolved]}`}
    >
      {children}
    </span>
  );
}
