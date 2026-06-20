"use client";

// Inline-SVG finance chart (no external chart lib).
// Revenue drawn as bars, expense as an overlaid line, with a net-profit hint
// per month. Y axis is formatted in juta ("Rp52jt"). "ongoing" months are
// rendered with reduced opacity + hatch and tagged "(berjalan)".

interface FinanceDatum {
  month: string;
  revenue: number;
  expense: number;
  ongoing?: boolean;
}

const JT = 1_000_000;

export default function RevenueChart({ data }: { data: FinanceDatum[] }) {
  // ---- Geometry ----
  const W = 520;
  const H = 300;
  const margin = { top: 24, right: 16, bottom: 44, left: 52 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;

  // ---- Y domain (covers both revenue & expense) ----
  const maxVal = Math.max(
    1,
    ...data.map((d) => Math.max(d.revenue, d.expense))
  );
  const yMaxJt = niceMaxJt(maxVal / JT);
  const yMax = yMaxJt * JT;

  const yScale = (v: number) => margin.top + plotH - (v / yMax) * plotH;

  // ---- X layout ----
  const band = plotW / data.length;
  const barW = band * 0.42;
  const xCenter = (i: number) => margin.left + i * band + band / 2;

  // ---- Y ticks (in juta) ----
  const tickCount = 4;
  const yTicks = Array.from({ length: tickCount + 1 }, (_, i) =>
    Math.round((yMaxJt * i) / tickCount)
  );

  const expensePts = data.map((d, i) => ({
    x: xCenter(i),
    y: yScale(d.expense),
  }));
  const linePath = expensePts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        role="img"
        aria-label="Grafik pendapatan dan biaya bulanan"
        className="block"
        style={{ maxWidth: "100%", height: "auto" }}
      >
        <defs>
          <pattern
            id="rev-hatch"
            width="5"
            height="5"
            patternTransform="rotate(45)"
            patternUnits="userSpaceOnUse"
          >
            <line x1="0" y1="0" x2="0" y2="5" stroke="#fff" strokeWidth="1.5" />
          </pattern>
        </defs>

        {/* Gridlines + Y ticks (Rp..jt) */}
        {yTicks.map((t, i) => (
          <g key={`gy-${i}`}>
            <line
              x1={margin.left}
              x2={margin.left + plotW}
              y1={yScale(t * JT)}
              y2={yScale(t * JT)}
              stroke="#eef2f7"
              strokeWidth={1}
            />
            <text
              x={margin.left - 6}
              y={yScale(t * JT) + 3}
              fontSize={9}
              textAnchor="end"
              fill="#64748b"
            >
              Rp{t}jt
            </text>
          </g>
        ))}

        {/* Revenue bars */}
        {data.map((d, i) => {
          const x = xCenter(i) - barW / 2;
          const h = plotH - (yScale(d.revenue) - margin.top);
          const profit = d.revenue - d.expense;
          return (
            <g key={`rev-${i}`}>
              <rect
                x={x}
                y={yScale(d.revenue)}
                width={barW}
                height={Math.max(0, h)}
                rx={2}
                fill="#2563eb"
                fillOpacity={d.ongoing ? 0.5 : 0.92}
              />
              {d.ongoing && (
                <rect
                  x={x}
                  y={yScale(d.revenue)}
                  width={barW}
                  height={Math.max(0, h)}
                  rx={2}
                  fill="url(#rev-hatch)"
                />
              )}
              {/* Net profit hint above bar (in jt) */}
              <text
                x={xCenter(i)}
                y={yScale(d.revenue) - 5}
                fontSize={8}
                textAnchor="middle"
                fill="#15803d"
              >
                +{Math.round(profit / JT)}jt
              </text>

              {/* X label */}
              <text
                x={xCenter(i)}
                y={margin.top + plotH + 14}
                fontSize={9}
                textAnchor="middle"
                fill="#475569"
              >
                {d.month}
              </text>
              {d.ongoing && (
                <text
                  x={xCenter(i)}
                  y={margin.top + plotH + 25}
                  fontSize={7.5}
                  textAnchor="middle"
                  fill="#94a3b8"
                >
                  (berjalan)
                </text>
              )}
            </g>
          );
        })}

        {/* Expense line */}
        <path d={linePath} fill="none" stroke="#f59e0b" strokeWidth={2} />
        {expensePts.map((p, i) => (
          <circle key={`exp-${i}`} cx={p.x} cy={p.y} r={3} fill="#f59e0b" />
        ))}

        {/* Axis line */}
        <line
          x1={margin.left}
          x2={margin.left + plotW}
          y1={margin.top + plotH}
          y2={margin.top + plotH}
          stroke="#cbd5e1"
          strokeWidth={1}
        />
      </svg>

      {/* Legend */}
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-brand-600" />
          Pendapatan
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-0.5 w-4 rounded-full"
            style={{ backgroundColor: "#f59e0b" }}
          />
          Biaya
        </span>
      </div>
    </figure>
  );
}

// Round a juta value up to a clean axis bound (multiple of 10 / 20).
function niceMaxJt(v: number): number {
  if (v <= 20) return Math.ceil(v / 5) * 5;
  return Math.ceil(v / 10) * 10;
}
