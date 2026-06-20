import StatusBadge from "@/components/StatusBadge";
import { formatRupiah } from "@/data/pricing";
import { PricingPackage } from "@/data/types";

interface PricingCardProps {
  pkg: PricingPackage;
  // Optional overrides used by the estimator to show adjusted assumptions.
  setupOverride?: number;
  monthlyOverride?: number;
}

function rangeLabel(min: number | null, max: number | null): string | null {
  if (min === null || max === null) return null;
  if (min === max) return formatRupiah(min);
  return `${formatRupiah(min)} – ${formatRupiah(max)}`;
}

export default function PricingCard({
  pkg,
  setupOverride,
  monthlyOverride,
}: PricingCardProps) {
  const setupLabel = rangeLabel(pkg.setupFeeMin, pkg.setupFeeMax);
  const monthlyLabel = rangeLabel(pkg.monthlyMin, pkg.monthlyMax);

  return (
    <div
      className={`card flex h-full flex-col gap-4 ${
        pkg.recommended ? "border-brand-400 ring-2 ring-brand-200" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="section-title">{pkg.name}</h3>
          <p className="mt-1 text-sm text-gray-500">{pkg.tagline}</p>
        </div>
        {pkg.recommended && <StatusBadge tone="info">Direkomendasikan</StatusBadge>}
      </div>

      <ul className="space-y-1.5 text-sm text-gray-700">
        {pkg.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className="mt-0.5 shrink-0 text-safe-text">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto space-y-2 border-t border-gray-100 pt-4 text-sm">
        {pkg.customQuote ? (
          <p className="rounded-lg bg-gray-50 px-3 py-2 text-gray-600">
            Custom Quotation / biaya integrasi terpisah
          </p>
        ) : (
          <>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-gray-400">Setup</span>
              <span className="font-semibold text-gray-800">
                {setupOverride !== undefined ? formatRupiah(setupOverride) : setupLabel}
              </span>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-gray-400">Maintenance/bulan</span>
              <span className="font-semibold text-gray-800">
                {monthlyOverride !== undefined
                  ? formatRupiah(monthlyOverride)
                  : monthlyLabel}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
