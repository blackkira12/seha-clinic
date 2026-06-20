"use client";

// Reusable percentile line chart drawn with inline SVG (no external chart lib).
// Illustrative only — reference bands are simplified dummy anchors.

interface RefBand {
  ageMonths: number;
  p3: number;
  p50: number;
  p97: number;
}

interface ChartPoint {
  ageMonths: number;
  value: number;
}

export default function GrowthChart({
  title,
  unit,
  refBands,
  points,
}: {
  title: string;
  unit: string;
  refBands: RefBand[];
  points: ChartPoint[];
}) {
  // ---- Geometry (viewBox units; rendered responsively via width 100%) ----
  const W = 480;
  const H = 320;
  const margin = { top: 24, right: 16, bottom: 44, left: 44 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;

  const bands = [...refBands].sort((a, b) => a.ageMonths - b.ageMonths);

  // ---- Domains (from ref bands + points, with padding) ----
  const ages = [
    ...bands.map((b) => b.ageMonths),
    ...points.map((p) => p.ageMonths),
  ];
  const values = [
    ...bands.flatMap((b) => [b.p3, b.p97]),
    ...points.map((p) => p.value),
  ];

  const xMin = 0;
  const xMax = Math.max(...ages, 1);
  const yRawMin = Math.min(...values);
  const yRawMax = Math.max(...values);
  const yPad = (yRawMax - yRawMin) * 0.08 || 1;
  const yMin = Math.max(0, yRawMin - yPad);
  const yMax = yRawMax + yPad;

  const xScale = (age: number) =>
    margin.left + ((age - xMin) / (xMax - xMin || 1)) * plotW;
  const yScale = (val: number) =>
    margin.top + plotH - ((val - yMin) / (yMax - yMin || 1)) * plotH;

  // ---- Path builders ----
  const linePath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  const p3Pts = bands.map((b) => ({ x: xScale(b.ageMonths), y: yScale(b.p3) }));
  const p50Pts = bands.map((b) => ({ x: xScale(b.ageMonths), y: yScale(b.p50) }));
  const p97Pts = bands.map((b) => ({ x: xScale(b.ageMonths), y: yScale(b.p97) }));
  const patientPts = [...points]
    .sort((a, b) => a.ageMonths - b.ageMonths)
    .map((p) => ({ x: xScale(p.ageMonths), y: yScale(p.value) }));

  // Shaded band between P97 (top) and P3 (bottom).
  const bandArea =
    linePath(p97Pts) +
    " " +
    p3Pts
      .slice()
      .reverse()
      .map((p) => `L${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(" ") +
    " Z";

  // ---- Ticks ----
  const xTicks = bands.map((b) => b.ageMonths);
  const yTickCount = 5;
  const yTicks = Array.from({ length: yTickCount + 1 }, (_, i) =>
    yMin + ((yMax - yMin) * i) / yTickCount
  );
  const yTickFmt = (v: number) =>
    Math.abs(v) >= 100 ? v.toFixed(0) : v.toFixed(1);

  return (
    <figure className="m-0">
      <figcaption className="section-title mb-2">{title}</figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        role="img"
        aria-label={`Kurva pertumbuhan ${title}`}
        className="block"
        style={{ maxWidth: "100%", height: "auto" }}
      >
        {/* Gridlines (horizontal) */}
        {yTicks.map((t, i) => (
          <line
            key={`gy-${i}`}
            x1={margin.left}
            x2={margin.left + plotW}
            y1={yScale(t)}
            y2={yScale(t)}
            stroke="#eef2f7"
            strokeWidth={1}
          />
        ))}
        {/* Gridlines (vertical) */}
        {xTicks.map((t, i) => (
          <line
            key={`gx-${i}`}
            x1={xScale(t)}
            x2={xScale(t)}
            y1={margin.top}
            y2={margin.top + plotH}
            stroke="#f4f6fa"
            strokeWidth={1}
          />
        ))}

        {/* Shaded P3–P97 band */}
        <path d={bandArea} fill="#2563eb" fillOpacity={0.06} stroke="none" />

        {/* P3 / P97 reference curves (thin gray) */}
        <path d={linePath(p3Pts)} fill="none" stroke="#9ca3af" strokeWidth={1.25} />
        <path d={linePath(p97Pts)} fill="none" stroke="#9ca3af" strokeWidth={1.25} />
        {/* P50 reference (dashed brand blue) */}
        <path
          d={linePath(p50Pts)}
          fill="none"
          stroke="#2563eb"
          strokeWidth={1.5}
          strokeDasharray="5 4"
        />

        {/* Patient line + dots */}
        {patientPts.length > 0 && (
          <path
            d={linePath(patientPts)}
            fill="none"
            stroke="#1d4ed8"
            strokeWidth={2}
          />
        )}
        {patientPts.map((p, i) => (
          <circle key={`pt-${i}`} cx={p.x} cy={p.y} r={3.5} fill="#1d4ed8" />
        ))}

        {/* Axes */}
        <line
          x1={margin.left}
          x2={margin.left}
          y1={margin.top}
          y2={margin.top + plotH}
          stroke="#cbd5e1"
          strokeWidth={1}
        />
        <line
          x1={margin.left}
          x2={margin.left + plotW}
          y1={margin.top + plotH}
          y2={margin.top + plotH}
          stroke="#cbd5e1"
          strokeWidth={1}
        />

        {/* X ticks + labels */}
        {xTicks.map((t, i) => (
          <g key={`xt-${i}`}>
            <line
              x1={xScale(t)}
              x2={xScale(t)}
              y1={margin.top + plotH}
              y2={margin.top + plotH + 4}
              stroke="#cbd5e1"
              strokeWidth={1}
            />
            <text
              x={xScale(t)}
              y={margin.top + plotH + 16}
              fontSize={9}
              textAnchor="middle"
              fill="#64748b"
            >
              {t}
            </text>
          </g>
        ))}
        <text
          x={margin.left + plotW / 2}
          y={H - 6}
          fontSize={10}
          textAnchor="middle"
          fill="#475569"
        >
          Usia (bulan)
        </text>

        {/* Y ticks + labels */}
        {yTicks.map((t, i) => (
          <g key={`yt-${i}`}>
            <line
              x1={margin.left - 4}
              x2={margin.left}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="#cbd5e1"
              strokeWidth={1}
            />
            <text
              x={margin.left - 6}
              y={yScale(t) + 3}
              fontSize={9}
              textAnchor="end"
              fill="#64748b"
            >
              {yTickFmt(t)}
            </text>
          </g>
        ))}
        <text
          x={14}
          y={margin.top + plotH / 2}
          fontSize={10}
          textAnchor="middle"
          fill="#475569"
          transform={`rotate(-90 14 ${margin.top + plotH / 2})`}
        >
          {unit}
        </text>
      </svg>

      {/* Legend */}
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-0.5 w-4 bg-gray-400" />
          P3
        </span>
        <span className="inline-flex items-center gap-1">
          <span
            className="inline-block h-0.5 w-4 bg-brand-600"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg,#2563eb 0 4px,transparent 4px 8px)",
            }}
          />
          P50
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-0.5 w-4 bg-gray-400" />
          P97
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-brand-700" />
          Anak
        </span>
      </div>
    </figure>
  );
}
