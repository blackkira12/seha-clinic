"use client";

// Inline-SVG monthly bar chart (no external chart lib).
// Supports one or two series per month: when bLabel is given, series are
// drawn as grouped (side-by-side) bars; otherwise a single bar per month.
// "ongoing" months (partial/current) are rendered with a subtle hatch +
// reduced opacity and tagged "(berjalan)".

interface BarDatum {
  label: string;
  a: number;
  b?: number;
  ongoing?: boolean;
}

export default function GroupedBarChart({
  data,
  aLabel,
  bLabel,
}: {
  data: BarDatum[];
  aLabel: string;
  bLabel?: string;
}) {
  const hasB = bLabel !== undefined;

  // ---- Geometry (viewBox units; rendered responsively via width 100%) ----
  const W = 480;
  const H = 280;
  const margin = { top: 24, right: 14, bottom: 40, left: 40 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;

  // ---- Y domain ----
  const maxVal = Math.max(
    1,
    ...data.map((d) => Math.max(d.a, hasB ? d.b ?? 0 : 0))
  );
  // Round up to a "nice" headroom value.
  const yMax = niceMax(maxVal);

  const yScale = (v: number) => margin.top + plotH - (v / yMax) * plotH;

  // ---- X layout (band per month) ----
  const band = plotW / data.length;
  const groupPad = band * 0.18; // padding between month groups
  const innerW = band - groupPad;
  const barW = hasB ? innerW / 2.4 : innerW * 0.6;
  const gap = hasB ? innerW / 2 - barW : 0;

  const xGroup = (i: number) => margin.left + i * band + groupPad / 2;

  // ---- Y ticks ----
  const tickCount = 4;
  const yTicks = Array.from({ length: tickCount + 1 }, (_, i) =>
    Math.round((yMax * i) / tickCount)
  );

  const hatchId = `hatch-${aLabel.replace(/\s+/g, "")}`;

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        role="img"
        aria-label={`Grafik batang ${aLabel}${hasB ? " vs " + bLabel : ""}`}
        className="block"
        style={{ maxWidth: "100%", height: "auto" }}
      >
        <defs>
          <pattern
            id={hatchId}
            width="5"
            height="5"
            patternTransform="rotate(45)"
            patternUnits="userSpaceOnUse"
          >
            <rect width="5" height="5" fill="#fff" fillOpacity="0.45" />
            <line x1="0" y1="0" x2="0" y2="5" stroke="#fff" strokeWidth="1.5" />
          </pattern>
        </defs>

        {/* Gridlines + Y ticks */}
        {yTicks.map((t, i) => (
          <g key={`gy-${i}`}>
            <line
              x1={margin.left}
              x2={margin.left + plotW}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="#eef2f7"
              strokeWidth={1}
            />
            <text
              x={margin.left - 6}
              y={yScale(t) + 3}
              fontSize={9}
              textAnchor="end"
              fill="#64748b"
            >
              {t}
            </text>
          </g>
        ))}

        {/* Bars */}
        {data.map((d, i) => {
          const gx = xGroup(i);
          const aXPos = hasB ? gx + innerW / 2 - barW - gap / 2 : gx + (innerW - barW) / 2;
          const bXPos = gx + innerW / 2 + gap / 2;
          const aH = plotH - (yScale(d.a) - margin.top);
          const bH = hasB ? plotH - (yScale(d.b ?? 0) - margin.top) : 0;
          return (
            <g key={`bar-${i}`}>
              {/* Series A */}
              <rect
                x={aXPos}
                y={yScale(d.a)}
                width={barW}
                height={Math.max(0, aH)}
                rx={2}
                fill="#2563eb"
                fillOpacity={d.ongoing ? 0.55 : 1}
              />
              {d.ongoing && (
                <rect
                  x={aXPos}
                  y={yScale(d.a)}
                  width={barW}
                  height={Math.max(0, aH)}
                  rx={2}
                  fill={`url(#${hatchId})`}
                />
              )}
              <text
                x={aXPos + barW / 2}
                y={yScale(d.a) - 3}
                fontSize={8.5}
                textAnchor="middle"
                fill="#1e3a8a"
              >
                {d.a}
              </text>

              {/* Series B */}
              {hasB && (
                <>
                  <rect
                    x={bXPos}
                    y={yScale(d.b ?? 0)}
                    width={barW}
                    height={Math.max(0, bH)}
                    rx={2}
                    fill="#93c5fd"
                    fillOpacity={d.ongoing ? 0.55 : 1}
                  />
                  {d.ongoing && (
                    <rect
                      x={bXPos}
                      y={yScale(d.b ?? 0)}
                      width={barW}
                      height={Math.max(0, bH)}
                      rx={2}
                      fill={`url(#${hatchId})`}
                    />
                  )}
                  <text
                    x={bXPos + barW / 2}
                    y={yScale(d.b ?? 0) - 3}
                    fontSize={8.5}
                    textAnchor="middle"
                    fill="#1e40af"
                  >
                    {d.b}
                  </text>
                </>
              )}

              {/* X label */}
              <text
                x={gx + innerW / 2}
                y={margin.top + plotH + 14}
                fontSize={9}
                textAnchor="middle"
                fill="#475569"
              >
                {d.label}
              </text>
              {d.ongoing && (
                <text
                  x={gx + innerW / 2}
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
          {aLabel}
        </span>
        {hasB && (
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-brand-300" />
            {bLabel}
          </span>
        )}
      </div>
    </figure>
  );
}

// Round a max value up to a clean axis bound.
function niceMax(v: number): number {
  if (v <= 10) return Math.ceil(v / 2) * 2;
  const mag = Math.pow(10, Math.floor(Math.log10(v)));
  return Math.ceil(v / (mag / 2)) * (mag / 2);
}
