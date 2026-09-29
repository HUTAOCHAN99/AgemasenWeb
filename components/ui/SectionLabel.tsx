import { SECTION_TOTAL } from "@/lib/site";

// Penanda posisi section: "02 / 06 ── ABOUT". Nomor = urutan section di halaman.
export function SectionLabel({
  index,
  label,
  className = "",
}: {
  index: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-ag-muted ${className}`}
    >
      <span className="tabular-nums text-ag-pink">
        {index}
        <span className="text-white/30"> / {SECTION_TOTAL}</span>
      </span>
      <span aria-hidden className="h-px w-10 bg-white/25 sm:w-14" />
      <span>{label}</span>
    </div>
  );
}
