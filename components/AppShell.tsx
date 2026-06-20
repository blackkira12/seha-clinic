"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useRole } from "./RoleContext";
import RoleSwitcher from "./RoleSwitcher";
import { RoleId } from "@/data/types";
import { CLINIC_NAME } from "@/data/users";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  roles: RoleId[]; // roles allowed to see this nav item
}

const NAV: NavItem[] = [
  { href: "/", label: "Dashboard", icon: "🏠", roles: ["admin", "doctor", "nurse", "pharmacist", "developer"] },
  { href: "/management", label: "Dashboard Manajemen", icon: "📊", roles: ["admin", "doctor", "developer"] },
  { href: "/queue", label: "Antrean", icon: "📋", roles: ["admin", "doctor", "nurse", "developer"] },
  { href: "/patients", label: "Pasien", icon: "👶", roles: ["admin", "doctor", "nurse", "developer"] },
  { href: "/examination", label: "Pemeriksaan", icon: "🩺", roles: ["admin", "doctor", "nurse", "developer"] },
  { href: "/growth", label: "KMS Digital Anak", icon: "📈", roles: ["admin", "doctor", "nurse", "developer"] },
  { href: "/pharmacy", label: "Farmasi & Inventory", icon: "💊", roles: ["admin", "doctor", "pharmacist", "developer"] },
  { href: "/billing", label: "Kasir & Billing", icon: "🧾", roles: ["admin", "developer"] },
  { href: "/reports", label: "Laporan & Sertifikat", icon: "📄", roles: ["admin", "doctor", "developer"] },
  { href: "/reminders", label: "Reminder Center", icon: "🔔", roles: ["admin", "developer"] },
  { href: "/access-control", label: "Hak Akses", icon: "🔐", roles: ["admin", "developer"] },
  { href: "/proposal", label: "Proposal & Harga", icon: "💼", roles: ["admin", "developer"] },
  { href: "/profil", label: "Website Publik", icon: "🌐", roles: ["admin", "doctor", "developer"] },
  { href: "/about", label: "Tentang", icon: "ℹ️", roles: ["admin", "doctor", "nurse", "pharmacist", "developer"] },
];

// Public, patient-facing routes render WITHOUT the staff sidebar/header.
const PUBLIC_ROUTES = ["/profil"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role } = useRole();
  const [open, setOpen] = useState(false);

  // The public website controls its own full-page layout.
  if (PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"))) {
    return <>{children}</>;
  }

  const items = NAV.filter((item) => item.roles.includes(role));

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-gray-100 bg-white transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-gray-100 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-base font-bold text-white">
            S
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-gray-800">SEHA</p>
            <p className="text-[10px] text-gray-400">Clinic Operations</p>
          </div>
        </div>
        <nav className="space-y-1 p-3">
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand-50 text-brand-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 pb-4">
          <RoleSwitcher compact />
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-100 bg-white/80 px-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Buka menu"
            >
              ☰
            </button>
            <p className="hidden text-sm font-medium text-gray-500 sm:block">
              {CLINIC_NAME}
            </p>
          </div>
          <div className="w-56">
            <RoleSwitcher compact />
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
        <footer className="border-t border-gray-100 px-4 py-3 text-center text-[11px] text-gray-400 lg:px-8">
          Prototype menggunakan data dummy. Bukan sistem rekam medis tersertifikasi.
        </footer>
      </div>
    </div>
  );
}
