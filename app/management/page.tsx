"use client";

import Link from "next/link";
import { useMemo } from "react";
import PageHeader from "@/components/PageHeader";
import DashboardCard from "@/components/DashboardCard";
import DummyNotice from "@/components/DummyNotice";
import { useRole } from "@/components/RoleContext";
import GroupedBarChart from "@/components/charts/GroupedBarChart";
import RevenueChart from "@/components/charts/RevenueChart";
import HBars from "@/components/charts/HBars";
import {
  monthlyVisits,
  monthlyFinance,
  newPatientsMonthly,
  immunizationMonthly,
  visitTypeBreakdown,
  topDiagnoses,
  sumVisits,
  netProfit,
  currentMonth,
  previousMonth,
  currentFinance,
  previousFinance,
  ytdRevenue,
  ytdExpense,
  pctChange,
} from "@/data/analytics";
import { invoices, invoiceTotal } from "@/data/billing";
import { inventory } from "@/data/inventory";
import { stockMovements } from "@/data/stockMovement";
import { reminders } from "@/data/reminders";
import { formatRupiah } from "@/data/pricing";

// Renders a percentage-change hint with an arrow + tone-coloured text.
function ChangeHint({ pct, suffix }: { pct: number; suffix?: string }) {
  const up = pct >= 0;
  const color = up ? "text-safe-text" : "text-warn-text";
  const arrow = up ? "▲" : "▼";
  return (
    <span className={color}>
      {arrow} {Math.abs(pct)}% vs bulan lalu{suffix ? ` ${suffix}` : ""}
    </span>
  );
}

export default function ManagementPage() {
  const { role, user } = useRole();
  const canView = role === "doctor" || role === "admin" || role === "developer";

  // ---- Derived metrics (memoised) ----
  const metrics = useMemo(() => {
    const visitsNow = sumVisits(currentMonth);
    const visitsPctChange = pctChange(visitsNow, sumVisits(previousMonth));
    const revenuePctChange = pctChange(
      currentFinance.revenue,
      previousFinance.revenue
    );

    const unpaid = invoices.filter((inv) => inv.status === "Belum Dibayar");
    const unpaidTotal = unpaid.reduce((s, inv) => s + invoiceTotal(inv), 0);

    const stockBy = (status: string) =>
      inventory.filter((it) => it.status === status).length;

    const movementQty = (type: string) =>
      stockMovements
        .filter((m) => m.type === type)
        .reduce((s, m) => s + m.qty, 0);

    const openReminders = reminders.filter((r) => r.status !== "Selesai").length;

    return {
      visitsNow,
      visitsPctChange,
      revenuePctChange,
      unpaidCount: unpaid.length,
      unpaidTotal,
      stockTotal: inventory.length,
      stockMenipis: stockBy("Stok Menipis"),
      stockAkanKadaluarsa: stockBy("Akan Kadaluarsa"),
      stockKadaluarsa: stockBy("Kadaluarsa"),
      penerimaanQty: movementQty("Penerimaan"),
      pemakaianQty: movementQty("Pemakaian"),
      openReminders,
    };
  }, []);

  // ---- Access gate (still inside AppShell) ----
  if (!canView) {
    return (
      <div className="mx-auto max-w-3xl">
        <PageHeader
          title="Dashboard Manajemen Praktik"
          description="Ringkasan bulanan praktik."
        />
        <div className="card text-center">
          <p className="text-4xl">🔒</p>
          <p className="mt-3 text-base font-semibold text-gray-800">
            Dashboard manajemen hanya untuk pemilik praktik & admin.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Halo {user.name}, akses peran {user.roleLabel} belum mencakup laporan
            manajemen. Silakan hubungi dokter atau admin bila memerlukan data ini.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Dashboard Manajemen Praktik"
        description="Ringkasan bulanan kunjungan, keuangan, stok obat, diagnosis, dan imunisasi dalam satu tampilan."
        action={
          <button
            type="button"
            onClick={() => window.print()}
            className="btn-secondary no-print"
          >
            🖨️ Cetak / Ekspor PDF
          </button>
        }
      />

      <DummyNotice />

      {/* ===== KPI ROW ===== */}
      <section className="mt-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <DashboardCard
            title="Kunjungan Bulan Ini"
            value={metrics.visitsNow}
            icon="🧒"
          >
            <p className="text-xs">
              <ChangeHint pct={metrics.visitsPctChange} suffix="(berjalan)" />
            </p>
          </DashboardCard>

          <DashboardCard
            title="Pendapatan Bulan Ini"
            value={formatRupiah(currentFinance.revenue)}
            icon="💰"
          >
            <p className="text-xs">
              <ChangeHint pct={metrics.revenuePctChange} />
            </p>
          </DashboardCard>

          <DashboardCard
            title="Laba Bersih Bulan Ini"
            value={formatRupiah(netProfit(currentFinance))}
            tone="safe"
            icon="📈"
            hint="Pendapatan dikurangi biaya operasional."
          />

          <DashboardCard
            title="Tagihan Belum Dibayar"
            value={formatRupiah(metrics.unpaidTotal)}
            tone={metrics.unpaidTotal > 0 ? "danger" : "default"}
            icon="🧾"
            hint={`${metrics.unpaidCount} tagihan menunggu pembayaran`}
          />
        </div>
      </section>

      {/* ===== TREN KUNJUNGAN PASIEN ===== */}
      <section className="mt-8">
        <h2 className="section-title">Tren Kunjungan Pasien</h2>
        <p className="mt-1 text-sm text-gray-500">
          Online vs Offline, 6 bulan terakhir.
        </p>
        <div className="card mt-3">
          <GroupedBarChart
            data={monthlyVisits.map((m) => ({
              label: m.month,
              a: m.online,
              b: m.offline,
              ongoing: m.ongoing,
            }))}
            aLabel="Online"
            bLabel="Offline"
          />
        </div>
      </section>

      {/* ===== RINGKASAN KEUANGAN ===== */}
      <section className="mt-8">
        <h2 className="section-title">Ringkasan Keuangan</h2>
        <p className="mt-1 text-sm text-gray-500">
          Pendapatan, biaya, dan laba bersih per bulan.
        </p>
        <div className="card mt-3">
          <RevenueChart data={monthlyFinance} />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <DashboardCard
            title="YTD Pendapatan"
            value={formatRupiah(ytdRevenue)}
            icon="💵"
          />
          <DashboardCard
            title="YTD Biaya"
            value={formatRupiah(ytdExpense)}
            tone="warn"
            icon="🧮"
          />
          <DashboardCard
            title="YTD Laba"
            value={formatRupiah(ytdRevenue - ytdExpense)}
            tone="safe"
            icon="📊"
          />
        </div>
      </section>

      {/* ===== JENIS KUNJUNGAN & DIAGNOSIS ===== */}
      <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <h2 className="section-title">Jenis Kunjungan</h2>
          <p className="mt-1 text-sm text-gray-500">
            Komposisi kunjungan bulan berjalan.
          </p>
          <div className="card mt-3">
            <HBars items={visitTypeBreakdown} tone="brand" />
          </div>
        </div>
        <div>
          <h2 className="section-title">Diagnosis Terbanyak (ICD-10)</h2>
          <p className="mt-1 text-sm text-gray-500">Diagnosis paling sering bulan ini.</p>
          <div className="card mt-3">
            <HBars
              items={topDiagnoses.map((d) => ({
                label: `${d.code} · ${d.label}`,
                value: d.count,
              }))}
              tone="safe"
            />
          </div>
        </div>
      </section>

      {/* ===== PERTUMBUHAN & IMUNISASI ===== */}
      <section className="mt-8">
        <h2 className="section-title">Pertumbuhan & Imunisasi</h2>
        <p className="mt-1 text-sm text-gray-500">
          Pasien baru dan imunisasi yang diberikan tiap bulan.
        </p>
        <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="card">
            <p className="card-title mb-2">Pasien Baru / Bulan</p>
            <GroupedBarChart
              data={newPatientsMonthly.map((m) => ({
                label: m.label,
                a: m.value,
              }))}
              aLabel="Pasien Baru"
            />
          </div>
          <div className="card">
            <p className="card-title mb-2">Imunisasi / Bulan</p>
            <GroupedBarChart
              data={immunizationMonthly.map((m) => ({
                label: m.label,
                a: m.value,
              }))}
              aLabel="Imunisasi"
            />
          </div>
        </div>
      </section>

      {/* ===== RINGKASAN STOK OBAT ===== */}
      <section className="mt-8">
        <div className="flex items-center justify-between gap-3">
          <h2 className="section-title">Ringkasan Stok Obat</h2>
          <Link href="/pharmacy" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            Kelola stok →
          </Link>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <DashboardCard
            title="Total Item"
            value={metrics.stockTotal}
            icon="📦"
          />
          <DashboardCard
            title="Stok Menipis"
            value={metrics.stockMenipis}
            tone={metrics.stockMenipis > 0 ? "warn" : "default"}
            icon="⚠️"
          />
          <DashboardCard
            title="Akan Kadaluarsa"
            value={metrics.stockAkanKadaluarsa}
            tone={metrics.stockAkanKadaluarsa > 0 ? "warn" : "default"}
            icon="⏳"
          />
          <DashboardCard
            title="Kadaluarsa"
            value={metrics.stockKadaluarsa}
            tone={metrics.stockKadaluarsa > 0 ? "danger" : "default"}
            icon="🚫"
          />
        </div>
        <div className="card mt-4">
          <p className="card-title mb-3">Pergerakan stok bulan ini</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-safe-border bg-safe-bg p-3">
              <p className="text-xs font-medium text-safe-text">Penerimaan (masuk)</p>
              <p className="mt-1 text-2xl font-semibold text-safe-text">
                +{metrics.penerimaanQty}
              </p>
            </div>
            <div className="rounded-xl border border-warn-border bg-warn-bg p-3">
              <p className="text-xs font-medium text-warn-text">Pemakaian (keluar)</p>
              <p className="mt-1 text-2xl font-semibold text-warn-text">
                −{metrics.pemakaianQty}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PENGINGAT & TINDAK LANJUT ===== */}
      <section className="mt-8 mb-4">
        <h2 className="section-title">Pengingat & Tindak Lanjut</h2>
        <div className="card mt-3 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-3xl font-semibold text-gray-800">
              {metrics.openReminders}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              pengingat belum selesai (imunisasi, kontrol, lanjutan obat).
            </p>
          </div>
          <Link href="/reminders" className="btn-secondary no-print">
            Buka pengingat →
          </Link>
        </div>
      </section>
    </div>
  );
}
