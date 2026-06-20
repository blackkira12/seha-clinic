"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { useRole } from "@/components/RoleContext";
import RoleSwitcher from "@/components/RoleSwitcher";
import PageHeader from "@/components/PageHeader";
import DashboardCard from "@/components/DashboardCard";
import StatusBadge from "@/components/StatusBadge";
import {
  CLINIC_NAME,
  PRODUCT_NAME,
  PRODUCT_TAGLINE,
  PRODUCT_VALUE_PROP,
  complianceBadges,
} from "@/data/users";
import { queue } from "@/data/queue";
import { inventory } from "@/data/inventory";
import { reminders } from "@/data/reminders";
import { RoleId } from "@/data/types";

// ── Derived operational figures (dummy data only) ──────────────────────────
const totalQueue = queue.length;
const onlineCount = queue.filter((q) => q.channel === "online").length;
const offlineCount = queue.filter((q) => q.channel === "offline").length;

const reportsReady = queue.filter(
  (q) => q.status === "Laporan Siap" || (q.status === "Selesai" && q.soap)
).length;

const reminderTasks = reminders.filter((r) => r.status !== "Selesai").length;

const expiringInventory = inventory.filter(
  (i) => i.status === "Akan Kadaluarsa" || i.status === "Kadaluarsa"
);
const lowStockInventory = inventory.filter((i) => i.status === "Stok Menipis");
const consumablesCount = inventory.filter(
  (i) => i.category === "Bahan Habis Pakai"
).length;

const waitingNurse = queue.filter((q) => q.status === "Menunggu Perawat");
const waitingDoctor = queue.filter((q) => q.status === "Menunggu Dokter");
const waitingPharmacy = queue.filter((q) => q.status === "Menunggu Farmasi");
const vitalsDone = queue.filter((q) => q.vitals);
const soapDrafts = queue.filter((q) => q.vitals && !q.soap);

const followUpToApprove = reminders.filter(
  (r) =>
    (r.type === "Pengingat Imunisasi" || r.type === "Pengingat Kontrol") &&
    r.status === "Pending"
);

// Items needing attention for the inventory alert list.
const inventoryAlerts = inventory.filter((i) => i.status !== "Aman");

// ── Small reusable quick-link tile ─────────────────────────────────────────
function QuickLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
    >
      <span className="text-lg">{icon}</span>
      {label}
    </Link>
  );
}

// ── Role-specific dashboard cards ──────────────────────────────────────────
function RoleCards({ role }: { role: RoleId }) {
  if (role === "admin" || role === "developer") {
    return (
      <>
        <DashboardCard
          title="Antrian Hari Ini"
          value={totalQueue}
          hint="Total pasien terdaftar hari ini"
          icon="🗓️"
        />
        <DashboardCard
          title="Online vs Offline"
          value={`${onlineCount} / ${offlineCount}`}
          hint="Pendaftaran online vs offline"
          tone="default"
          icon="🌐"
        />
        <DashboardCard
          title="Laporan Siap Unduh"
          value={reportsReady}
          hint="Hasil pemeriksaan / SOAP selesai"
          tone={reportsReady > 0 ? "safe" : "default"}
          icon="📄"
        />
        <DashboardCard
          title="Tugas Pengingat"
          value={reminderTasks}
          hint="Pengingat yang belum selesai"
          tone={reminderTasks > 0 ? "warn" : "safe"}
          icon="🔔"
        />
        <DashboardCard
          title="Peringatan Kadaluarsa"
          value={expiringInventory.length}
          hint="Item akan / sudah kadaluarsa"
          tone={expiringInventory.length > 0 ? "danger" : "safe"}
          icon="⚠️"
        />
      </>
    );
  }

  if (role === "doctor") {
    return (
      <>
        <DashboardCard
          title="Antrian Saat Ini"
          value={totalQueue}
          hint="Total pasien dalam antrian"
          icon="🗓️"
        />
        <DashboardCard
          title="Menunggu Dokter"
          value={waitingDoctor.length}
          hint="Pasien siap diperiksa"
          tone={waitingDoctor.length > 0 ? "warn" : "safe"}
          icon="🩺"
        />
        <DashboardCard
          title="Draft SOAP"
          value={soapDrafts.length}
          hint="Vital sudah diisi, SOAP belum"
          tone={soapDrafts.length > 0 ? "warn" : "safe"}
          icon="📝"
        />
        <DashboardCard
          title="Pengingat Perlu Disetujui"
          value={followUpToApprove.length}
          hint="Imunisasi / kontrol (Pending)"
          tone={followUpToApprove.length > 0 ? "warn" : "safe"}
          icon="🔔"
        />
      </>
    );
  }

  if (role === "nurse") {
    return (
      <>
        <DashboardCard
          title="Menunggu Perawat"
          value={waitingNurse.length}
          hint="Pasien menunggu pemeriksaan vital"
          tone={waitingNurse.length > 0 ? "warn" : "safe"}
          icon="🌡️"
        />
        <DashboardCard
          title="Vital Selesai"
          value={vitalsDone.length}
          hint="Pasien dengan data vital terisi"
          tone="safe"
          icon="✅"
        />
        <DashboardCard
          title="Total Antrian"
          value={totalQueue}
          hint="Seluruh pasien hari ini"
          icon="🗓️"
        />
        <DashboardCard
          title="Menunggu Dokter"
          value={waitingDoctor.length}
          hint="Sudah vital, menuju dokter"
          icon="🩺"
        />
      </>
    );
  }

  // pharmacist
  return (
    <>
      <DashboardCard
        title="Resep Menunggu"
        value={waitingPharmacy.length}
        hint="Pasien menunggu farmasi"
        tone={waitingPharmacy.length > 0 ? "warn" : "safe"}
        icon="💊"
      />
      <DashboardCard
        title="Stok Menipis"
        value={lowStockInventory.length}
        hint="Obat di bawah stok minimum"
        tone={lowStockInventory.length > 0 ? "warn" : "safe"}
        icon="📉"
      />
      <DashboardCard
        title="Obat Kadaluarsa"
        value={expiringInventory.length}
        hint="Akan / sudah kadaluarsa"
        tone={expiringInventory.length > 0 ? "danger" : "safe"}
        icon="⚠️"
      />
      <DashboardCard
        title="Bahan Habis Pakai"
        value={consumablesCount}
        hint="Jenis item habis pakai"
        icon="🧰"
      />
    </>
  );
}

// ── Quick links per role ───────────────────────────────────────────────────
function RoleQuickLinks({ role }: { role: RoleId }) {
  const links: Record<RoleId, { href: string; icon: string; label: string }[]> = {
    admin: [
      { href: "/management", icon: "📊", label: "Dashboard Manajemen" },
      { href: "/queue", icon: "🗂️", label: "Antrian" },
      { href: "/billing", icon: "🧾", label: "Kasir & Billing" },
      { href: "/pharmacy", icon: "💊", label: "Farmasi & Inventory" },
    ],
    doctor: [
      { href: "/management", icon: "📊", label: "Dashboard Manajemen" },
      { href: "/examination", icon: "🩺", label: "Pemeriksaan" },
      { href: "/growth", icon: "📈", label: "KMS Digital Anak" },
      { href: "/queue", icon: "🗂️", label: "Antrian" },
    ],
    nurse: [
      { href: "/queue", icon: "🗂️", label: "Antrian" },
      { href: "/examination", icon: "🌡️", label: "Pemeriksaan Awal" },
      { href: "/growth", icon: "📈", label: "KMS Digital Anak" },
    ],
    pharmacist: [
      { href: "/queue", icon: "🗂️", label: "Antrian" },
      { href: "/pharmacy", icon: "💊", label: "Farmasi & Inventory" },
    ],
    developer: [
      { href: "/queue", icon: "🗂️", label: "Antrian" },
      { href: "/growth", icon: "📈", label: "KMS Digital Anak" },
      { href: "/billing", icon: "🧾", label: "Kasir & Billing" },
      { href: "/pharmacy", icon: "💊", label: "Farmasi" },
    ],
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {links[role].map((l) => (
        <QuickLink key={l.href} href={l.href} icon={l.icon} label={l.label} />
      ))}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { role, user } = useRole();

  // Next few queue entries to surface in the operational summary.
  const upcomingQueue = queue
    .filter((q) => q.status !== "Selesai")
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Selamat datang, ${user.name}`}
        description={`${CLINIC_NAME} · Anda masuk sebagai ${user.roleLabel}.`}
      />

      {/* Product hero / branding banner */}
      <section className="overflow-hidden rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-600 to-brand-700 p-6 text-white shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-brand-100">
              {PRODUCT_NAME} · Clinic Operations System
            </p>
            <h2 className="mt-1 text-2xl font-bold">{PRODUCT_TAGLINE}</h2>
            <p className="mt-2 max-w-2xl text-sm text-brand-50">
              {PRODUCT_VALUE_PROP}
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {complianceBadges.map((b) => (
            <span
              key={b.label}
              title={b.note}
              className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium text-white"
            >
              {b.label}
            </span>
          ))}
        </div>
      </section>

      {/* Role switcher near the top */}
      <RoleSwitcher />

      {role === "developer" && (
        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm text-brand-700">
          Developer: akses konfigurasi sistem (ditampilkan sebagai peran, tanpa
          backend nyata).
        </div>
      )}

      {/* Role-specific cards */}
      <section>
        <h2 className="section-title mb-3">Ringkasan Peran</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <RoleCards role={role} />
        </div>
      </section>

      {/* Quick navigation */}
      <section>
        <h2 className="section-title mb-3">Akses Cepat</h2>
        <RoleQuickLinks role={role} />
      </section>

      {/* Operational summary */}
      <section>
        <h2 className="section-title mb-3">Ringkasan operasional hari ini</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Upcoming queue */}
          <div className="card">
            <div className="mb-3 flex items-center justify-between">
              <p className="card-title">Antrian Berikutnya</p>
              <Link
                href="/queue"
                className="text-xs font-medium text-brand-700 hover:underline"
              >
                Lihat semua →
              </Link>
            </div>
            <ul className="divide-y divide-gray-100">
              {upcomingQueue.length === 0 && (
                <li className="py-3 text-sm text-gray-400">
                  Tidak ada antrian aktif.
                </li>
              )}
              {upcomingQueue.map((q) => (
                <li
                  key={q.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="shrink-0 rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                      {q.queueNumber}
                    </span>
                    <span className="truncate text-sm font-medium text-gray-700">
                      {q.patientName}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <StatusBadge tone={q.channel === "online" ? "online" : "offline"}>
                      {q.channel === "online" ? "Online" : "Offline"}
                    </StatusBadge>
                    <StatusBadge status={q.status}>{q.status}</StatusBadge>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Inventory alerts */}
          <div className="card">
            <div className="mb-3 flex items-center justify-between">
              <p className="card-title">Peringatan Inventory</p>
              <Link
                href="/pharmacy"
                className="text-xs font-medium text-brand-700 hover:underline"
              >
                Kelola →
              </Link>
            </div>
            <ul className="divide-y divide-gray-100">
              {inventoryAlerts.length === 0 && (
                <li className="py-3 text-sm text-gray-400">
                  Semua stok aman. 🎉
                </li>
              )}
              {inventoryAlerts.map((i) => (
                <li
                  key={i.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-700">
                      {i.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {i.category} · Sisa {i.currentStock} {i.unit}
                    </p>
                  </div>
                  <StatusBadge status={i.status}>{i.status}</StatusBadge>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
