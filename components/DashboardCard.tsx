import { ReactNode } from "react";

export default function DashboardCard({
  title,
  value,
  hint,
  tone = "default",
  icon,
  children,
}: {
  title: string;
  value?: ReactNode;
  hint?: string;
  tone?: "default" | "safe" | "warn" | "danger";
  icon?: ReactNode;
  children?: ReactNode;
}) {
  const toneRing: Record<string, string> = {
    default: "border-gray-100",
    safe: "border-safe-border",
    warn: "border-warn-border",
    danger: "border-danger-border",
  };
  return (
    <div className={`rounded-2xl border bg-white p-5 shadow-sm ${toneRing[tone]}`}>
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      {value !== undefined && (
        <p className="mt-2 text-3xl font-semibold text-gray-800">{value}</p>
      )}
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
