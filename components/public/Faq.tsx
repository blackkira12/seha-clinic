"use client";

import { useState } from "react";

export default function Faq({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {faqs.map((f, i) => {
        const isOpen = openIdx === i;
        return (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-brand-100 bg-white"
          >
            <button
              onClick={() => setOpenIdx(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-semibold text-gray-800 sm:text-base">
                {f.q}
              </span>
              <span
                className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition-transform ${
                  isOpen ? "rotate-45" : ""
                }`}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-sm leading-relaxed text-gray-600">
                {f.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
