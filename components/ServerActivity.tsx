"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Clock, Cpu, Hexagon, Layers, MemoryStick, Monitor, Server } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { LiveTime } from "@/components/NavClock";
import { Reveal } from "@/components/ui/Reveal";
import { categoryCount, commandCount } from "@/lib/features";
import type { Lang } from "@/lib/i18n";

// Bentuk respons /api/pulse (lihat api/pulse.js). Field opsional bernilai null
// kalau bot belum mengirimnya; kartunya lalu disembunyikan.
type Pulse = {
  online: boolean;
  perSec: number | null;
  peak: number | null;
  received: number | null;
  sent: number | null;
  sessionsActive: number | null;
  sessionsTotal: number | null;
  today: number | null;
  load: number | null;
  uptimeSec: number | null;
  system: {
    cpuPercent: number | null;
    cpuModel: string | null;
    cpuCores: number | null;
    totalMem: number | null;
    heapUsed: number | null;
    heapTotal: number | null;
    external: number | null;
    arrayBuffers: number | null;
    node: string | null;
    os: string | null;
    arch: string | null;
  } | null;
  top: { command: string; n: number }[];
  series: number[] | null;
};

const POLL_MS = 5000;
const MAX_POINTS = 40;

// 7900 -> "7,9rb" (id) / "7.9k" (en). Di bawah 1000 ditulis apa adanya.
function compact(n: number, lang: Lang) {
  if (n < 1000) return String(Math.round(n));
  const v = (n / 1000).toFixed(1).replace(/\.0$/, "");
  return lang === "id" ? `${v.replace(".", ",")}rb` : `${v}k`;
}

// Kurva halus lewat titik tengah antar sampel.
function smoothPath(values: number[], w: number, h: number, top = 8) {
  const max = Math.max(1, ...values);
  const step = w / Math.max(1, values.length - 1);
  const pts = values.map((v, i) => [i * step, h - (v / max) * (h - top) - 2] as const);
  if (pts.length < 2) return { line: `M0 ${h - 2} L${w} ${h - 2}`, area: "" };
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1];
    const [x, y] = pts[i];
    const mx = (px + x) / 2;
    d += ` C${mx} ${py} ${mx} ${y} ${x} ${y}`;
  }
  return { line: d, area: `${d} L${w} ${h} L0 ${h} Z` };
}

// Byte -> "1021.62 MB" atau "1.24 GB" (2 desimal).
function bytes(b: number) {
  return b >= 1024 ** 3
    ? `${(b / 1024 ** 3).toFixed(2)} GB`
    : `${(b / 1024 ** 2).toFixed(2)} MB`;
}

// Detik -> "1H 23J 16M" (id) / "1d 23h 16m" (en).
function uptime(sec: number, u: { d: string; h: string; m: string }) {
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return [d ? `${d}${u.d}` : "", d || h ? `${h}${u.h}` : "", `${m}${u.m}`]
    .filter(Boolean)
    .join(" ");
}

function SysCard({
  icon,
  label,
  note,
  value,
  bar,
  className = "",
}: {
  icon: ReactNode;
  label: string;
  note?: string;
  value: string;
  bar?: number | null;
  className?: string;
}) {
  return (
    <div className={`rounded-[6px] border border-ag-line bg-ag-ink-2/80 p-5 ${className}`}>
      <p className="flex items-center gap-2.5 text-[13px] font-bold">
        <span aria-hidden className="text-ag-muted">{icon}</span>
        {label}
      </p>
      {bar != null && (
        <span
          role="progressbar"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(bar)}
          className="mt-3 block h-2 overflow-hidden rounded-full bg-ag-fg/10"
        >
          <span
            className="block h-full rounded-full bg-ag-pink transition-[width] duration-700"
            style={{ width: `${Math.min(100, Math.max(bar > 0 ? 2 : 0, bar))}%` }}
          />
        </span>
      )}
      {note && <p className="mt-3 truncate text-xs text-ag-muted">{note}</p>}
      <p className="mt-3 font-display text-2xl leading-tight tabular-nums sm:text-[1.7rem]">
        {value}
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-r border-ag-line px-5 py-4 sm:px-6 sm:py-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ag-muted">
        {label}
      </p>
      <p className="mt-1 font-display text-xl leading-tight tabular-nums sm:text-[1.7rem]">
        {value}
      </p>
    </div>
  );
}

export function ServerActivity() {
  const { t, lang } = useLanguage();
  const a = t.activity;

  const [pulse, setPulse] = useState<Pulse | null>(null);
  const [failed, setFailed] = useState(false);
  const [history, setHistory] = useState<number[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let dead = false;
    const ctrl = new AbortController();

    async function tick() {
      try {
        const r = await fetch("/api/pulse", { cache: "no-store", signal: ctrl.signal });
        if (!r.ok) throw new Error(String(r.status));
        const d: Pulse = await r.json();
        if (dead) return;
        setPulse(d);
        setFailed(false);
        setHistory((h) => {
          if (d.series && d.series.length > 1) return d.series.slice(-MAX_POINTS);
          if (d.perSec == null) return h;
          return [...h, d.perSec].slice(-MAX_POINTS);
        });
      } catch {
        if (!dead && !ctrl.signal.aborted) setFailed(true);
      } finally {
        // Berhenti polling saat tab tersembunyi; lanjut lagi saat kembali.
        if (!dead) {
          timer.current = setTimeout(
            () => (document.hidden ? wait() : tick()),
            POLL_MS,
          );
        }
      }
    }
    function wait() {
      const onVisible = () => {
        if (!document.hidden) {
          document.removeEventListener("visibilitychange", onVisible);
          tick();
        }
      };
      document.addEventListener("visibilitychange", onVisible);
    }

    tick();
    return () => {
      dead = true;
      ctrl.abort();
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const chart = useMemo(() => smoothPath(history, 600, 110), [history]);

  const online = !!pulse?.online && !failed;
  const status = pulse ? (online ? a.live : a.offline) : failed ? a.offline : a.connecting;

  const stats: { label: string; value: string }[] = [];
  if (pulse?.sent != null) stats.push({ label: a.sent, value: compact(pulse.sent, lang) });
  if (pulse?.sessionsActive != null) {
    const total = pulse.sessionsTotal != null ? `/${pulse.sessionsTotal}` : "";
    stats.push({ label: a.sessions, value: `${pulse.sessionsActive}${total}` });
  }
  if (pulse?.today != null) stats.push({ label: a.today, value: compact(pulse.today, lang) });
  stats.push({ label: a.features, value: String(commandCount) });
  stats.push({ label: a.categories, value: String(categoryCount) });
  if (pulse?.top[0]) stats.push({ label: a.topCommand, value: pulse.top[0].command });

  const sys = pulse?.system ?? null;
  const cpu = sys?.cpuPercent != null ? Math.min(100, Math.max(0, sys.cpuPercent)) : null;
  const heapPct =
    sys?.heapUsed != null && sys.heapTotal ? (sys.heapUsed / sys.heapTotal) * 100 : null;
  const osText = sys?.os
    ? `${sys.os.charAt(0).toUpperCase()}${sys.os.slice(1)}${sys.arch ? ` (${sys.arch.toUpperCase()})` : ""}`
    : null;
  const nodeText = sys?.node ? (sys.node.startsWith("v") ? sys.node : `v${sys.node}`) : null;
  const cpuNote = sys?.cpuModel
    ? `${sys.cpuModel}${sys.cpuCores ? ` (${sys.cpuCores} ${a.cores})` : ""}`
    : undefined;
  const ic = "size-[18px]";

  const load = pulse?.load != null ? Math.min(100, Math.max(0, pulse.load)) : null;

  return (
    <section
      id="activity"
      aria-labelledby="activity-title"
      className="relative border-t border-ag-line py-16 lg:py-24"
    >
      <div className="shell">
        <Reveal>
          <div className="overflow-hidden rounded-[6px] border border-ag-line bg-ag-ink-2/80">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-ag-line bg-ag-fg/[0.04] px-4 py-3 sm:px-5">
              <h2
                id="activity-title"
                className="flex items-center gap-2.5 text-[12px] font-extrabold uppercase tracking-[0.12em]"
              >
                <span
                  aria-hidden
                  className={`size-2 rounded-full ${
                    online ? "animate-blink bg-emerald-400" : "bg-ag-muted"
                  }`}
                />
                {a.title}
              </h2>
              <span
                role="status"
                className="rounded-full border border-ag-line px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ag-muted"
              >
                {status}
                <LiveTime className="ml-2 border-l border-ag-line pl-2 text-ag-fg" />
              </span>
            </div>

            {failed && !pulse ? (
              <p className="px-5 py-10 text-center text-sm text-ag-muted">{a.unavailable}</p>
            ) : (
              <>
                {/* Ringkasan + grafik */}
                <div className="grid gap-6 border-b border-ag-line px-5 py-5 sm:px-6 md:grid-cols-[minmax(0,240px)_1fr] md:items-center md:gap-10">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ag-muted">
                      {a.perHit}
                    </p>
                    <p className="font-display text-6xl leading-none tabular-nums sm:text-7xl">
                      {pulse?.perSec != null ? compact(pulse.perSec, lang) : "–"}
                    </p>
                    {(pulse?.received != null || pulse?.sent != null) && (
                      <p className="mt-3 flex gap-4 text-xs font-bold tabular-nums text-ag-muted">
                        {pulse?.received != null && (
                          <span>
                            <span aria-hidden>↓</span> {compact(pulse.received, lang)}
                          </span>
                        )}
                        {pulse?.sent != null && (
                          <span>
                            <span aria-hidden>↑</span> {compact(pulse.sent, lang)}
                          </span>
                        )}
                      </p>
                    )}
                    {pulse?.peak != null && (
                      <p className="mt-2 text-[11px] font-semibold text-ag-muted">
                        {a.peak} {compact(pulse.peak, lang)}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    {pulse?.perSec != null && (
                      <p className="mb-1 text-right text-[11px] font-semibold text-ag-muted tabular-nums">
                        <b className="font-display text-base text-ag-fg">
                          {compact(pulse.perSec, lang)}
                        </b>{" "}
                        MSG/s
                        {pulse.peak != null && <> / {compact(pulse.peak, lang)} peak</>}
                      </p>
                    )}
                    <svg
                      role="img"
                      aria-label={a.chartLabel}
                      viewBox="0 0 600 110"
                      preserveAspectRatio="none"
                      className="h-24 w-full sm:h-28"
                    >
                      <defs>
                        <linearGradient id="act-fill" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0" stopColor="var(--ag-violet)" stopOpacity="0.35" />
                          <stop offset="1" stopColor="var(--ag-violet)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {chart.area && <path d={chart.area} fill="url(#act-fill)" />}
                      <path
                        d={chart.line}
                        fill="none"
                        stroke="var(--ag-pink)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </div>
                </div>

                {/* Kartu angka */}
                <div className="overflow-hidden border-b border-ag-line">
                  <div className="-mb-px -mr-px grid grid-cols-2 sm:grid-cols-3">
                    {stats.map((s) => (
                      <Stat key={s.label} {...s} />
                    ))}
                  </div>
                </div>

                {/* Terpakai hari ini */}
                {pulse && pulse.top.length > 0 && (
                  <>
                    <div className="flex flex-wrap items-center gap-2 border-b border-ag-line px-5 py-3.5 sm:px-6">
                      <span className="mr-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ag-muted">
                        {a.usedToday}
                      </span>
                      {pulse.top.map((c) => (
                        <span
                          key={c.command}
                          className="rounded-[4px] border border-ag-line bg-ag-fg/[0.05] px-2 py-1 font-mono text-[11px] font-bold tabular-nums"
                        >
                          [ {c.command} {compact(c.n, lang)}× ]
                        </span>
                      ))}
                    </div>
                    <ul>
                      {pulse.top.map((c) => (
                        <li
                          key={c.command}
                          className="flex items-center gap-3 border-b border-ag-line px-5 py-2.5 text-[13px] last:border-b-0 sm:px-6"
                        >
                          <span className="rounded-[4px] border border-ag-line px-1.5 py-0.5 text-[10px] font-extrabold tracking-wider text-ag-muted">
                            CMD
                          </span>
                          <code className="font-mono font-bold">{c.command}</code>
                          <span className="min-w-0 truncate text-ag-muted tabular-nums">
                            {c.n.toLocaleString(lang === "id" ? "id-ID" : "en-US")}× {a.usedTodayLabel}
                          </span>
                          <span className="ml-auto shrink-0 text-[11px] text-ag-muted/70">
                            {a.justNow}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between gap-4 border-t border-ag-line bg-ag-fg/[0.04] px-4 py-3 sm:px-5">
                  <span className="rounded-full border border-ag-line px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em]">
                    <span aria-hidden>● </span>
                    {a.server}
                  </span>
                  {load != null && (
                    <div className="flex items-center gap-3 text-[11px] font-bold">
                      {pulse?.today != null && (
                        <span className="hidden tabular-nums sm:inline">
                          {compact(pulse.today, lang)} {a.commandsShort}
                        </span>
                      )}
                      <span className="font-medium text-ag-muted">{a.load}</span>
                      <span
                        role="progressbar"
                        aria-label={a.load}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(load)}
                        className="h-1.5 w-24 overflow-hidden rounded-full bg-ag-fg/10 sm:w-32"
                      >
                        <span
                          className="block h-full rounded-full bg-ag-pink transition-[width] duration-700"
                          style={{ width: `${load}%` }}
                        />
                      </span>
                      <span className="tabular-nums">{Math.round(load)}%</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </Reveal>

        {sys && !failed && (
          <Reveal delay={0.05}>
            <div className="mt-14 text-center">
              <h3 className="font-display text-2xl sm:text-3xl">{a.sysTitle}</h3>
              <p className="mt-2 text-sm text-ag-muted">{a.sysSub}</p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {cpu != null && (
                <SysCard
                  icon={<Cpu className={ic} />}
                  label={a.cpu}
                  bar={cpu}
                  note={cpuNote}
                  value={`${Math.round(cpu)}%`}
                />
              )}
              {sys.heapUsed != null && sys.heapTotal != null && (
                <SysCard
                  icon={<MemoryStick className={ic} />}
                  label={a.heap}
                  bar={heapPct}
                  note={sys.totalMem ? `${a.totalMem} : ${bytes(sys.totalMem)}` : undefined}
                  value={`${bytes(sys.heapUsed)} / ${bytes(sys.heapTotal)}`}
                />
              )}
              {sys.external != null && (
                <SysCard
                  icon={<Server className={ic} />}
                  label={a.external}
                  note={a.externalNote}
                  value={bytes(sys.external)}
                />
              )}
              {sys.arrayBuffers != null && (
                <SysCard
                  icon={<Layers className={ic} />}
                  label={a.arrayBuffer}
                  value={bytes(sys.arrayBuffers)}
                />
              )}
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {pulse?.uptimeSec != null && (
                <SysCard
                  icon={<Clock className={ic} />}
                  label={a.uptime}
                  value={uptime(pulse.uptimeSec, { d: a.uDay, h: a.uHour, m: a.uMin })}
                />
              )}
              {nodeText && (
                <SysCard icon={<Hexagon className={ic} />} label={a.node} value={nodeText} />
              )}
              {osText && (
                <SysCard icon={<Monitor className={ic} />} label={a.os} value={osText} />
              )}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
