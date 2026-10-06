"use client";

import { useState, type ReactNode } from "react";

// Potongan UI yang dipakai bersama oleh Dashboard (ringkasan) dan daftar
// Grup/User, supaya tampilannya konsisten.

export function Panel({
  title,
  count,
  className = "",
  children,
}: {
  title: string;
  count?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[6px] border border-ag-line bg-ag-ink-2/80 ${className}`}
    >
      <div className="flex items-center gap-2.5 border-b border-ag-line bg-ag-fg/[0.04] px-4 py-3 sm:px-5">
        <span aria-hidden className="size-2 rounded-full bg-ag-pink" />
        <h2 className="text-[12px] font-extrabold uppercase tracking-[0.12em]">{title}</h2>
        {count != null && (
          <span className="ml-auto rounded-full border border-ag-line px-2.5 py-0.5 text-[10px] font-bold tabular-nums text-ag-muted">
            {count}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

export function Pill({ tone, children }: { tone: "ok" | "bad"; children: ReactNode }) {
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] ${
        tone === "ok"
          ? "border-emerald-400/40 text-emerald-400 light:text-emerald-700"
          : "border-ag-pink/40 text-ag-pink"
      }`}
    >
      {children}
    </span>
  );
}

export const th = "px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-ag-muted";
export const td = "px-5 py-3 align-middle";

export function Empty({ cols, text }: { cols: number; text: string }) {
  return (
    <tr>
      <td colSpan={cols} className="px-5 py-10 text-center text-sm text-ag-muted">
        {text}
      </td>
    </tr>
  );
}

// Foto profil bulat. URL PP dari WhatsApp bisa kosong (tidak ada PP / privasi)
// atau kedaluwarsa, jadi kalau gagal dimuat dipakai inisial nama.
export function Avatar({ src, name, alt }: { src?: string | null; name: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  const initial = (name.match(/[\p{L}\p{N}]/u)?.[0] ?? "#").toUpperCase();

  return (
    <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-ag-line bg-ag-fg/[0.08] text-[13px] font-extrabold text-ag-muted">
      {src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element -- URL dinamis dari WhatsApp
        <img
          src={src}
          alt={alt}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="size-full object-cover"
        />
      ) : (
        <span aria-hidden>{initial}</span>
      )}
    </span>
  );
}

export function SearchBox({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="border-b border-ag-line px-4 py-3 sm:px-5">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-10 w-full rounded-[6px] border border-ag-line bg-transparent px-3 text-[13px] outline-none transition-colors placeholder:text-ag-muted focus:border-ag-violet sm:max-w-xs"
      />
    </div>
  );
}

// Penanda bot (nomor WA) pada baris grup/user. Warna dibedakan per bot
// dari urutannya di daftar, supaya grup yang sama di dua bot mudah dibedakan.
const BOT_TONES = [
  "border-ag-violet/50 text-ag-violet",
  "border-ag-pink/50 text-ag-pink",
  "border-emerald-400/50 text-emerald-400 light:text-emerald-700",
  "border-amber-400/50 text-amber-400 light:text-amber-700",
];

export function BotBadge({
  label,
  number,
  index = 0,
}: {
  label?: string | null;
  number?: string | null;
  index?: number;
}) {
  if (!label) return null;
  return (
    <span
      title={number ? `${label} • +${number}` : label}
      className={`inline-block max-w-full truncate rounded-[4px] border px-1.5 py-0.5 align-middle text-[10px] font-extrabold tracking-wider ${BOT_TONES[index % BOT_TONES.length]}`}
    >
      {label}
      {number ? <span className="ml-1 font-mono font-semibold opacity-70">…{number.slice(-4)}</span> : null}
    </span>
  );
}
