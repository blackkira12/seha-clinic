export default function DummyNotice({ text }: { text?: string }) {
  return (
    <div className="mb-6 flex items-start gap-2 rounded-xl border border-warn-border bg-warn-bg px-4 py-3 text-xs text-warn-text">
      <span>⚠️</span>
      <p>
        {text ??
          "Informasi klinis pada halaman ini adalah data dummy untuk keperluan demonstrasi prototype saja."}
      </p>
    </div>
  );
}
