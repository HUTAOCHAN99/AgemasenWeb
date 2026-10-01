"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { Pill } from "@/components/admin/parts";

// Langganan satu grup / user, dikirim bot (data aslinya di Supabase).
// expiresAt = epoch ms. Status "habis" dihitung ulang dari waktu sekarang di
// browser, jadi hitung mundur tetap akurat walau data dari bot belum diperbarui.
export type SubInfo = { expiresAt: number; active: boolean };

const DAY_MS = 86_400_000;
const QUICK_DAYS = [7, 30, 90] as const;

// Jam yang "berdetak" supaya hitung mundur ikut berjalan. Dipanggil SEKALI di
// komponen daftar lalu dioper ke tiap baris (bukan satu timer per baris).
export function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

type Units = { d: string; h: string; m: string };

// "12 hari 3 jam" / "3 jam 20 menit" / "20 menit". full=true menambah menit
// saat masih ada hari ("12 hari 3 jam 20 menit").
export function formatRemaining(ms: number, u: Units, full = false) {
  const totalMin = Math.max(0, Math.ceil(ms / 60_000));
  const d = Math.floor(totalMin / 1440);
  const h = Math.floor((totalMin % 1440) / 60);
  const m = totalMin % 60;
  if (d > 0) return full ? `${d} ${u.d} ${h} ${u.h} ${m} ${u.m}` : `${d} ${u.d} ${h} ${u.h}`;
  if (h > 0) return `${h} ${u.h} ${m} ${u.m}`;
  return `${m} ${u.m}`;
}

// Sel di tabel daftar: sisa waktu, atau "Habis" / "Belum berlangganan".
export function SubCell({ sub, now }: { sub?: SubInfo | null; now: number }) {
  const { t } = useLanguage();
  const a = t.admin;
  if (!sub) return <span className="text-ag-muted">{a.subNone}</span>;
  const left = sub.expiresAt - now;
  if (left <= 0) return <Pill tone="bad">{a.subExpired}</Pill>;
  const warn = left < 3 * DAY_MS; // kurang dari 3 hari: beri warna peringatan
  return (
    <span
      className={`font-bold tabular-nums ${warn ? "text-amber-400 light:text-amber-700" : ""}`}
    >
      {formatRemaining(left, { d: a.unitDay, h: a.unitHour, m: a.unitMin })}
    </span>
  );
}

const btn =
  "h-9 rounded-[6px] border border-ag-line px-3 text-[12px] font-bold transition-colors hover:bg-ag-fg/[0.06] disabled:cursor-wait disabled:opacity-60";

// Panel di drawer detail: lihat sisa waktu + tambah hari / hentikan.
export function SubscriptionPanel({
  kind,
  id,
  sub,
  onChange,
}: {
  kind: "group" | "user";
  id: string;
  sub: SubInfo | null;
  onChange: (sub: SubInfo) => void;
}) {
  const { t } = useLanguage();
  const a = t.admin;
  const now = useNow(15_000);
  const [days, setDays] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const left = sub ? sub.expiresAt - now : 0;
  const running = !!sub && left > 0;
  const units = { d: a.unitDay, h: a.unitHour, m: a.unitMin };

  async function send(action: "add" | "expire", n?: number) {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const r = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: kind, id, action, days: n }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.sub) throw new Error(d.error || a.errSub);
      onChange(d.sub as SubInfo);
      setDays("");
    } catch (e) {
      setError((e as Error).message || a.errSub);
    } finally {
      setBusy(false);
    }
  }

  const custom = Number(days);
  const customOk = Number.isInteger(custom) && custom >= 1 && custom <= 3650;

  return (
    <div className="mt-4 rounded-[6px] border border-ag-line bg-ag-ink-2/80 p-4">
      <div className="flex items-center gap-3">
        <p className="text-[13px] font-bold">{a.subTitle}</p>
        <span className="ml-auto">
          {!sub ? (
            <span className="text-[12px] text-ag-muted">{a.subNone}</span>
          ) : (
            <Pill tone={running ? "ok" : "bad"}>{running ? a.subActive : a.subExpired}</Pill>
          )}
        </span>
      </div>

      {sub && (
        <dl className="mt-3 text-[13px]">
          <div className="flex items-start justify-between gap-6 border-b border-ag-line py-2">
            <dt className="text-ag-muted">{a.subLeft}</dt>
            <dd
              className={`text-right font-bold tabular-nums ${
                running && left < 3 * DAY_MS ? "text-amber-400 light:text-amber-700" : ""
              }`}
            >
              {running ? formatRemaining(left, units, true) : "-"}
            </dd>
          </div>
          <div className="flex items-start justify-between gap-6 py-2">
            <dt className="text-ag-muted">{a.subUntil}</dt>
            <dd className="text-right font-semibold tabular-nums">
              {new Date(sub.expiresAt).toLocaleString(a.locale, {
                timeZone: "Asia/Jakarta",
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </dd>
          </div>
        </dl>
      )}

      <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-ag-muted">
        {a.subAddDays}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {QUICK_DAYS.map((n) => (
          <button key={n} type="button" disabled={busy} onClick={() => send("add", n)} className={btn}>
            +{n} {a.unitDay}
          </button>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          type="number"
          inputMode="numeric"
          min={1}
          max={3650}
          value={days}
          onChange={(e) => setDays(e.target.value)}
          placeholder={a.subDaysPh}
          aria-label={a.subDaysPh}
          className="h-9 min-w-0 flex-1 rounded-[6px] border border-ag-line bg-transparent px-3 text-[13px] outline-none transition-colors placeholder:text-ag-muted focus:border-ag-violet"
        />
        <button
          type="button"
          disabled={busy || !customOk}
          onClick={() => send("add", custom)}
          className={btn}
        >
          {a.subAdd}
        </button>
      </div>

      {running && (
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            if (window.confirm(a.subStopConfirm)) send("expire");
          }}
          className={`${btn} mt-3 border-ag-pink/40 text-ag-pink`}
        >
          {a.subStop}
        </button>
      )}

      <p className="mt-3 text-[12px] leading-relaxed text-ag-muted">{a.subHint}</p>
      {error && (
        <p role="alert" className="mt-3 text-[12px] font-semibold text-ag-pink">
          {error}
        </p>
      )}
    </div>
  );
}
