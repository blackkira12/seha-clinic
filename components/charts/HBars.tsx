"use client";

// Simple horizontal bar list for breakdowns (no external chart lib).
// Each row: label, a proportional bar (width = value / max), and the value.

interface HBarItem {
  label: string;
  value: number;
}

export default function HBars({
  items,
  tone = "brand",
}: {
  items: HBarItem[];
  tone?: "brand" | "safe";
}) {
  const max = Math.max(1, ...items.map((i) => i.value));
  const barColor = tone === "safe" ? "bg-safe-text" : "bg-brand-500";
  const trackColor = tone === "safe" ? "bg-safe-bg" : "bg-brand-50";

  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item, i) => {
        const pct = Math.round((item.value / max) * 100);
        return (
          <li key={`${item.label}-${i}`} className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between gap-2">
              <span className="truncate text-sm text-gray-700">{item.label}</span>
              <span className="shrink-0 text-sm font-semibold text-gray-800 tabular-nums">
                {item.value}
              </span>
            </div>
            <div className={`h-2.5 w-full overflow-hidden rounded-full ${trackColor}`}>
              <div
                className={`h-full rounded-full ${barColor}`}
                style={{ width: `${Math.max(4, pct)}%` }}
                aria-hidden
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
