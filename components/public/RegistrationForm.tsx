"use client";

import { useState } from "react";
import { buildRegistrationMessage, services } from "@/data/practice";

export default function RegistrationForm({ waNumber }: { waNumber: string }) {
  const [parentName, setParentName] = useState("");
  const [childName, setChildName] = useState("");
  const [service, setService] = useState(services[0]?.title ?? "");
  const [preferredDate, setPreferredDate] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const handleBuild = () => {
    const msg = buildRegistrationMessage({
      parentName: parentName.trim() || "(nama orang tua)",
      childName: childName.trim() || "(nama anak)",
      service,
      preferredDate: preferredDate || "(tanggal belum dipilih)",
    });
    setMessage(msg);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!message) return;
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

  const inputClass =
    "w-full rounded-xl border border-brand-100 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-100";
  const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Form */}
      <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
        <div className="grid gap-4">
          <div>
            <label htmlFor="parentName" className={labelClass}>
              Nama orang tua
            </label>
            <input
              id="parentName"
              type="text"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              placeholder="Contoh: Ibu Sari"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="childName" className={labelClass}>
              Nama anak
            </label>
            <input
              id="childName"
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="Contoh: Adik Bima"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="service" className={labelClass}>
              Layanan
            </label>
            <select
              id="service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className={inputClass}
            >
              {services.map((s) => (
                <option key={s.title} value={s.title}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="preferredDate" className={labelClass}>
              Tanggal diinginkan
            </label>
            <input
              id="preferredDate"
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              className={inputClass}
            />
          </div>
          <button
            onClick={handleBuild}
            className="mt-1 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Buat Pesan WhatsApp
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="flex flex-col rounded-2xl border border-brand-100 bg-brand-50/40 p-6">
        <p className="mb-2 text-sm font-medium text-gray-700">Pratinjau pesan</p>
        <textarea
          readOnly
          value={message}
          placeholder="Pesan WhatsApp akan muncul di sini setelah Anda menekan “Buat Pesan WhatsApp”."
          className="min-h-[140px] flex-1 resize-none rounded-xl border border-brand-100 bg-white px-3.5 py-3 text-sm leading-relaxed text-gray-700 outline-none"
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={handleCopy}
            disabled={!message}
            className="rounded-xl border border-brand-200 bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copied ? "Tersalin!" : "Salin Pesan"}
          </button>
          <a
            href={message ? waLink : undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!message}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors ${
              message
                ? "bg-brand-600 hover:bg-brand-700"
                : "pointer-events-none bg-brand-300"
            }`}
          >
            Kirim via WhatsApp
          </a>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-gray-500">
          Pendaftaran final dikonfirmasi melalui WhatsApp secara manual (prototype —
          bukan integrasi API nyata).
        </p>
      </div>
    </div>
  );
}
