"use client";

import Link from "next/link";
import { useState } from "react";

const LINKS: { href: string; label: string }[] = [
  { href: "#beranda", label: "Beranda" },
  { href: "#tentang", label: "Tentang" },
  { href: "#layanan", label: "Layanan" },
  { href: "#jadwal", label: "Jadwal" },
  { href: "#lokasi", label: "Lokasi" },
  { href: "#faq", label: "FAQ" },
];

export default function Navbar({ waLink }: { waLink: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        {/* Logo / brand */}
        <a href="#beranda" className="flex items-center gap-2.5" aria-label="Ke beranda">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white">
            S
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold text-gray-800">SEHA</span>
            <span className="block text-[10px] text-gray-400">Praktik dr. Aisyah</span>
          </span>
        </a>

        {/* Desktop links */}
        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/"
            className="text-sm font-medium text-gray-500 transition-colors hover:text-brand-700"
          >
            Login Staf
          </Link>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
          >
            Daftar via WhatsApp
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="rounded-lg p-2 text-gray-600 hover:bg-brand-50 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Buka menu"
          aria-expanded={open}
        >
          <span className="text-lg">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="border-t border-brand-100 bg-white lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-700"
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-brand-50"
            >
              Login Staf
            </Link>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-xl bg-brand-600 px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-700"
            >
              Daftar via WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
