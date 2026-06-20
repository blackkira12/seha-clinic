"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import PricingCard from "@/components/PricingCard";
import {
  pricingPackages,
  formatRupiah,
  PRICING_DISCLAIMER,
  BUILD_COST,
  BUILD_COST_NOTE,
  buildMilestones,
  annualCostModel,
  ANNUAL_HPP,
  OPERATIONAL_HPP,
  ANNUAL_MARGIN_PCT,
  RECOMMENDED_ANNUAL,
  ANNUAL_FLOOR,
  ANNUAL_PREMIUM,
  ONBOARDING_FEE,
  ANNUAL_PRICE_NOTE,
} from "@/data/pricing";

// Default assumption: midpoint of a package range, or 0 when custom-quote.
function midpoint(min: number | null, max: number | null): number {
  if (min === null || max === null) return 0;
  return Math.round((min + max) / 2);
}

export default function ProposalPage() {
  const [packageId, setPackageId] = useState<string>(pricingPackages[0]?.id ?? "");
  const selected =
    pricingPackages.find((p) => p.id === packageId) ?? pricingPackages[0];

  const [setupFee, setSetupFee] = useState<number>(
    midpoint(selected.setupFeeMin, selected.setupFeeMax)
  );
  const [monthlyFee, setMonthlyFee] = useState<number>(
    midpoint(selected.monthlyMin, selected.monthlyMax)
  );
  const [months, setMonths] = useState<number>(12);

  // When the chosen package changes, reset assumptions to that package's midpoint.
  function handlePackageChange(id: string) {
    setPackageId(id);
    const pkg = pricingPackages.find((p) => p.id === id);
    if (pkg) {
      setSetupFee(midpoint(pkg.setupFeeMin, pkg.setupFeeMax));
      setMonthlyFee(midpoint(pkg.monthlyMin, pkg.monthlyMax));
    }
  }

  const totalContractValue = useMemo(
    () => setupFee + monthlyFee * Math.max(0, months),
    [setupFee, monthlyFee, months]
  );

  // ── Single-practice (klien tunggal) calculator ──────────────────────────
  // Model A: build dibayar di muka (capital), langganan tahunan = operasional + margin.
  // Model B: build diamortisasi ke biaya tahunan selama N tahun (tanpa DP besar).
  const [scModel, setScModel] = useState<"A" | "B">("A");
  const [scBuild, setScBuild] = useState<number>(BUILD_COST);
  const [scYears, setScYears] = useState<number>(3);
  const [scMargin, setScMargin] = useState<number>(30);
  const [scOps, setScOps] = useState<number>(OPERATIONAL_HPP);

  const sc = useMemo(() => {
    const years = Math.max(1, scYears);
    const opsWithMargin = Math.round(scOps * (1 + scMargin / 100));
    const amortPerYear = Math.round(scBuild / years);
    if (scModel === "A") {
      // Build di muka; langganan = operasional + margin (build tidak masuk langganan)
      const annual = opsWithMargin;
      const year1 = scBuild + ONBOARDING_FEE + annual;
      const tco = scBuild + ONBOARDING_FEE + annual * years;
      return { opsWithMargin, amortPerYear, annual, year1, tco, years, avgPerYear: Math.round(tco / years) };
    }
    // Model B: amortisasi build (pass-through) + operasional+margin
    const annual = amortPerYear + opsWithMargin;
    const year1 = ONBOARDING_FEE + annual;
    const tco = ONBOARDING_FEE + annual * years;
    return { opsWithMargin, amortPerYear, annual, year1, tco, years, avgPerYear: Math.round(tco / years) };
  }, [scModel, scBuild, scYears, scMargin, scOps]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Proposal & Contract Estimator"
        description="Halaman internal: harga langganan tahunan klinik (cost-plus) dipisahkan dari biaya pengembangan one-time. Angka bersifat asumsi yang dapat diubah."
      />

      {/* Recommended ANNUAL price for the clinic (operational) — the headline */}
      <section className="overflow-hidden rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-600 to-brand-700 p-6 text-white shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-brand-100">
              Harga Langganan Tahunan untuk Klinik (Rekomendasi)
            </p>
            <p className="mt-1 text-4xl font-bold">
              {formatRupiah(RECOMMENDED_ANNUAL)}
              <span className="text-lg font-normal text-brand-100"> / tahun</span>
            </p>
            <p className="text-sm text-brand-100">
              ≈ {formatRupiah(Math.round(RECOMMENDED_ANNUAL / 12))} / bulan · all-in
              (hosting, domain, pemeliharaan, dukungan, update minor)
            </p>
            <p className="mt-2 max-w-2xl text-sm text-brand-50">{ANNUAL_PRICE_NOTE}</p>
          </div>
          <div className="shrink-0 rounded-xl bg-white/10 px-4 py-3 text-center">
            <p className="text-xs text-brand-100">Onboarding (sekali)</p>
            <p className="text-lg font-semibold">{formatRupiah(ONBOARDING_FEE)}</p>
            <p className="mt-1 text-[11px] text-brand-50">deploy · migrasi · pelatihan</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-white/10 p-3">
            <p className="text-xs text-brand-100">Lantai (margin tipis)</p>
            <p className="mt-1 text-base font-semibold">{formatRupiah(ANNUAL_FLOOR)}/thn</p>
          </div>
          <div className="rounded-xl border border-white/40 bg-white/20 p-3">
            <p className="text-xs text-brand-50">Rekomendasi</p>
            <p className="mt-1 text-base font-bold">{formatRupiah(RECOMMENDED_ANNUAL)}/thn</p>
          </div>
          <div className="rounded-xl bg-white/10 p-3">
            <p className="text-xs text-brand-100">Premium (support+)</p>
            <p className="mt-1 text-base font-semibold">{formatRupiah(ANNUAL_PREMIUM)}/thn</p>
          </div>
        </div>
      </section>

      {/* Cost-plus model behind the annual price */}
      <section className="card space-y-4">
        <div>
          <h2 className="section-title">Rincian HPP &amp; Penetapan Harga Tahunan</h2>
          <p className="mt-1 text-sm text-gray-500">
            Harga langganan dihitung <span className="font-medium">cost-plus</span>: biaya
            pokok operasional per tahun (HPP) ditambah margin sehat, tetap kompetitif untuk
            praktik mandiri solo.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-400">
                <th className="px-3 py-2 font-medium">Komponen Biaya (per tahun)</th>
                <th className="px-3 py-2 text-right font-medium">Biaya</th>
              </tr>
            </thead>
            <tbody>
              {annualCostModel.map((c) => (
                <tr key={c.component} className="border-b border-gray-100">
                  <td className="px-3 py-2 text-gray-700">
                    {c.component}
                    {c.note && (
                      <span className="ml-1 text-xs text-gray-400">({c.note})</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right text-gray-700">
                    {formatRupiah(c.annual)}
                  </td>
                </tr>
              ))}
              <tr className="border-b border-gray-200 font-semibold text-gray-800">
                <td className="px-3 py-2">Total HPP / tahun</td>
                <td className="px-3 py-2 text-right">{formatRupiah(ANNUAL_HPP)}</td>
              </tr>
              <tr className="text-gray-600">
                <td className="px-3 py-2">Margin (±{ANNUAL_MARGIN_PCT}%)</td>
                <td className="px-3 py-2 text-right">
                  {formatRupiah(RECOMMENDED_ANNUAL - ANNUAL_HPP)}
                </td>
              </tr>
              <tr className="bg-brand-50 font-bold text-brand-700">
                <td className="px-3 py-2">Harga jual rekomendasi / tahun</td>
                <td className="px-3 py-2 text-right">{formatRupiah(RECOMMENDED_ANNUAL)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Build cost (capital) — clearly separated, NOT the clinic's annual fee */}
      <section className="card space-y-4 border-gray-200 bg-gray-50">
        <div className="flex flex-col gap-1">
          <h2 className="section-title">Biaya Pengembangan (Capital / One-time)</h2>
          <p className="text-sm text-gray-500">{BUILD_COST_NOTE}</p>
        </div>
        <p className="text-2xl font-bold text-gray-800">
          {formatRupiah(BUILD_COST)}{" "}
          <span className="text-sm font-normal text-gray-400">one-time (biaya membangun)</span>
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {buildMilestones.map((m, i) => (
            <div key={m.label} className="rounded-xl border border-gray-200 bg-white p-3">
              <p className="text-xs text-gray-400">
                Termin {i + 1} · {m.percent}%
              </p>
              <p className="mt-1 text-base font-semibold text-gray-800">
                {formatRupiah(m.amount)}
              </p>
              <p className="mt-1 text-[11px] leading-tight text-gray-500">{m.label}</p>
            </div>
          ))}
        </div>
        <p className="rounded-lg bg-warn-bg px-3 py-2 text-xs text-warn-text">
          Penting: angka Rp108jt ini adalah biaya <strong>membangun</strong> aplikasi
          (dibayar ke pengembang / diamortisasi ke banyak klinik), <strong>bukan</strong>
          tarif yang dibayar dr. Aisyah setiap tahun untuk memakai aplikasi.
        </p>
      </section>

      {/* Single-practice calculator — when there is only ONE clinic */}
      <section className="card space-y-5 border-brand-200">
        <div>
          <h2 className="section-title">Kalkulator Klien Tunggal (Satu Praktik Mandiri)</h2>
          <p className="mt-1 text-sm text-gray-500">
            Jika untuk saat ini <span className="font-medium">hanya satu praktik</span>,
            biaya build tidak bisa dibagi ke klinik lain — seluruhnya ditanggung dr. Aisyah.
            Pilih model pembayaran untuk melihat dampaknya.
          </p>
        </div>

        {/* Model toggle */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setScModel("A")}
            className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
              scModel === "A"
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Model A · Build dibayar di muka
          </button>
          <button
            type="button"
            onClick={() => setScModel("B")}
            className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
              scModel === "B"
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Model B · Build diamortisasi ke biaya tahunan
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="label" htmlFor="sc-build">Biaya Build (Rp)</label>
            <input id="sc-build" type="number" min={0} className="input"
              value={scBuild} onChange={(e) => setScBuild(Number(e.target.value) || 0)} />
          </div>
          <div>
            <label className="label" htmlFor="sc-ops">HPP Operasional / thn (Rp)</label>
            <input id="sc-ops" type="number" min={0} className="input"
              value={scOps} onChange={(e) => setScOps(Number(e.target.value) || 0)} />
          </div>
          <div>
            <label className="label" htmlFor="sc-years">
              {scModel === "A" ? "Horizon Kontrak (tahun)" : "Durasi Amortisasi (tahun)"}
            </label>
            <input id="sc-years" type="number" min={1} className="input"
              value={scYears} onChange={(e) => setScYears(Number(e.target.value) || 1)} />
          </div>
          <div>
            <label className="label" htmlFor="sc-margin">Margin Layanan (%)</label>
            <input id="sc-margin" type="number" min={0} className="input"
              value={scMargin} onChange={(e) => setScMargin(Number(e.target.value) || 0)} />
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 lg:col-span-2">
            <p className="card-title mb-2">Rincian</p>
            <ul className="space-y-1.5 text-sm text-gray-700">
              <li className="flex justify-between">
                <span>HPP operasional + margin {scMargin}%</span>
                <span className="font-medium">{formatRupiah(sc.opsWithMargin)}/thn</span>
              </li>
              {scModel === "A" ? (
                <>
                  <li className="flex justify-between">
                    <span>Biaya build (di muka, sekali)</span>
                    <span className="font-medium">{formatRupiah(scBuild)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Onboarding (sekali)</span>
                    <span className="font-medium">{formatRupiah(ONBOARDING_FEE)}</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex justify-between">
                    <span>Amortisasi build ({sc.years} thn)</span>
                    <span className="font-medium">{formatRupiah(sc.amortPerYear)}/thn</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Onboarding (sekali)</span>
                    <span className="font-medium">{formatRupiah(ONBOARDING_FEE)}</span>
                  </li>
                </>
              )}
              <li className="mt-1 flex justify-between border-t border-gray-200 pt-2 text-gray-500">
                <span>Tahun pertama (termasuk biaya sekali)</span>
                <span className="font-semibold">{formatRupiah(sc.year1)}</span>
              </li>
              <li className="flex justify-between text-gray-500">
                <span>Total {sc.years} tahun (TCO)</span>
                <span className="font-semibold">{formatRupiah(sc.tco)}</span>
              </li>
              <li className="flex justify-between text-gray-500">
                <span>Rata-rata per tahun (TCO ÷ {sc.years})</span>
                <span className="font-semibold">{formatRupiah(sc.avgPerYear)}</span>
              </li>
            </ul>
          </div>
          <div className="card flex flex-col justify-center gap-1 bg-brand-50">
            <p className="card-title text-brand-700">
              {scModel === "A" ? "Langganan / Tahun (thn ke-2 dst)" : "Biaya / Tahun"}
            </p>
            <p className="text-3xl font-bold text-brand-700">{formatRupiah(sc.annual)}</p>
            <p className="text-xs text-gray-500">
              ≈ {formatRupiah(Math.round(sc.annual / 12))}/bulan
            </p>
            <p className="mt-2 text-[11px] leading-snug text-gray-500">
              {scModel === "A"
                ? "dr. Aisyah membayar build di muka (bisa dicicil termin), lalu langganan operasional yang ringan."
                : "Tanpa DP besar, tapi biaya tahunan jauh lebih tinggi karena seluruh build ditanggung satu klinik."}
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-warn-bg px-3 py-2 text-xs text-warn-text">
          Realita klien tunggal: biaya build mendominasi. Untuk satu praktik solo,
          paling sehat adalah <strong>Model A</strong> (build sebagai proyek terpisah, bisa
          dicicil termin) + langganan operasional ±{formatRupiah(Math.round(OPERATIONAL_HPP * 1.3))}/tahun.
          Alternatif: turunkan scope build agar lebih terjangkau, atau perpanjang horizon
          amortisasi (Model B, 5 tahun) untuk meringankan biaya tahunan.
        </div>
      </section>

      {/* Package cards */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {pricingPackages.map((pkg) => (
          <PricingCard key={pkg.id} pkg={pkg} />
        ))}
      </section>

      {/* Editable estimator */}
      <section className="card space-y-5">
        <div>
          <h2 className="section-title">Estimator Nilai Kontrak</h2>
          <p className="mt-1 text-sm text-gray-500">
            Sesuaikan asumsi di bawah untuk menghitung estimasi total nilai kontrak.
            Seluruh angka bersifat <span className="font-medium">asumsi yang dapat diubah</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="label" htmlFor="package">
              Paket
            </label>
            <select
              id="package"
              className="input"
              value={packageId}
              onChange={(e) => handlePackageChange(e.target.value)}
            >
              {pricingPackages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="months">
              Durasi Kontrak (bulan)
            </label>
            <input
              id="months"
              type="number"
              min={0}
              className="input"
              value={months}
              onChange={(e) => setMonths(Number(e.target.value) || 0)}
            />
          </div>

          <div>
            <label className="label" htmlFor="setupFee">
              Biaya Setup (asumsi, Rp)
            </label>
            <input
              id="setupFee"
              type="number"
              min={0}
              className="input"
              value={setupFee}
              onChange={(e) => setSetupFee(Number(e.target.value) || 0)}
            />
          </div>

          <div>
            <label className="label" htmlFor="monthlyFee">
              Biaya Maintenance / bulan (asumsi, Rp)
            </label>
            <input
              id="monthlyFee"
              type="number"
              min={0}
              className="input"
              value={monthlyFee}
              onChange={(e) => setMonthlyFee(Number(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* Live preview using overrides + computed total */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PricingCard
              pkg={selected}
              setupOverride={setupFee}
              monthlyOverride={monthlyFee}
            />
          </div>
          <div className="card flex flex-col justify-center gap-2 bg-brand-50">
            <p className="card-title text-brand-700">Estimasi Total Nilai Kontrak</p>
            <p className="text-3xl font-bold text-brand-700">
              {formatRupiah(totalContractValue)}
            </p>
            <p className="text-xs text-gray-500">
              Setup {formatRupiah(setupFee)} + ({formatRupiah(monthlyFee)} ×{" "}
              {Math.max(0, months)} bulan)
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Disclaimer Harga
        </p>
        <p className="mt-1 text-sm text-gray-600">{PRICING_DISCLAIMER}</p>
      </section>
    </div>
  );
}
