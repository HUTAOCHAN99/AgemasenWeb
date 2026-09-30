"use client";

import { Clock, Cpu, Hexagon, Layers, LogOut, MemoryStick, Monitor, Server } from "lucide-react";
import type { ReactNode } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { Stat, SysCard, bytes, uptime } from "@/components/ServerActivity";
import { ActionButton } from "@/components/ui/ActionButton";
import { Reveal } from "@/components/ui/Reveal";

// Bentuk respons /api/stats (lihat api/stats.js). Semua field dibaca dengan
// nilai cadangan supaya bot yang belum mengirim field tertentu tidak membuat
// halaman error.
export type Stats = {
  botOnline?: boolean;
  uptimeSec?: number;
  today?: number;
  week?: number;
  totalMembers?: number;
  groups?: { name: string; members: number; cmd7: number; disabled?: boolean }[];
  users?: {
    name?: string;
    number: string;
    count: number;
    lastSeen?: string | number | null;
    blocked?: boolean;
  }[];
  daily?: { d: string; n: number }[];
  top?: { command: string; n: number }[];
  system?: {
    cpuPercent?: number;
    cpuModel?: string;
    cpuCores?: number;
    totalMem?: number;
    heapUsed?: number;
    heapTotal?: number;
    external?: number;
    arrayBuffers?: number;
    node?: string;
    os?: string;
    arch?: string;
  };
};

function Panel({
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

function Pill({ tone, children }: { tone: "ok" | "bad"; children: ReactNode }) {
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

const th = "px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-ag-muted";
const td = "px-5 py-3 align-middle";

function Empty({ cols, text }: { cols: number; text: string }) {
  return (
    <tr>
      <td colSpan={cols} className="px-5 py-10 text-center text-sm text-ag-muted">
        {text}
      </td>
    </tr>
  );
}

export function Dashboard({
  data,
  error,
  onLogout,
  onRetry,
}: {
  data: Stats | null;
  error: string | null;
  onLogout: () => void;
  onRetry: () => void;
}) {
  const { t } = useLanguage();
  const a = t.admin;
  const ac = t.activity;
  const fmt = (n: number) => n.toLocaleString(a.locale);

  const when = (v?: string | number | null) =>
    v
      ? new Date(v).toLocaleString(a.locale, {
          timeZone: "Asia/Jakarta",
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "-";

  const groups = data?.groups ?? [];
  const users = data?.users ?? [];
  const daily = data?.daily ?? [];
  const top = data?.top ?? [];
  const sys = data?.system ?? null;
  const online = !!data?.botOnline;
  const up = data?.uptimeSec != null
    ? uptime(data.uptimeSec, { d: ac.uDay, h: ac.uHour, m: ac.uMin })
    : null;

  const maxDaily = Math.max(1, ...daily.map((x) => x.n));
  const maxTop = Math.max(1, ...top.map((x) => x.n));
  // "2026-09-30" -> "09-30"; format lain dipakai apa adanya.
  const dayLabel = (d: string) => (/^\d{4}-\d{2}-\d{2}/.test(d) ? d.slice(5, 10) : d);

  const cpu = sys?.cpuPercent != null ? Math.min(100, Math.max(0, sys.cpuPercent)) : null;
  const heapPct =
    sys?.heapUsed != null && sys.heapTotal ? (sys.heapUsed / sys.heapTotal) * 100 : null;
  const osText = sys?.os
    ? `${sys.os.charAt(0).toUpperCase()}${sys.os.slice(1)}${sys.arch ? ` (${sys.arch.toUpperCase()})` : ""}`
    : null;
  const nodeText = sys?.node ? (sys.node.startsWith("v") ? sys.node : `v${sys.node}`) : null;
  const cpuNote = sys?.cpuModel
    ? `${sys.cpuModel}${sys.cpuCores ? ` (${sys.cpuCores} ${ac.cores})` : ""}`
    : undefined;
  const ic = "size-[18px]";

  return (
    <section
      aria-labelledby="admin-title"
      className="relative pb-20 pt-28 lg:pb-28 lg:pt-32"
    >
      <div className="shell">
        {/* Header halaman */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ag-pink">
              {a.eyebrow}
            </p>
            <h1
              id="admin-title"
              className="display-h mt-4 text-[clamp(2rem,5.4vw,3.75rem)]"
            >
              {a.title}
            </h1>
          </div>
          <ActionButton variant="ghost" size="md" onClick={onLogout} className="self-start sm:self-auto">
            <LogOut className="size-4" aria-hidden />
            {a.logout}
          </ActionButton>
        </div>

        {error ? (
          <div className="mt-10 rounded-[6px] border border-ag-line bg-ag-ink-2/80 px-5 py-12 text-center">
            <p role="alert" className="text-sm font-semibold text-ag-pink">
              {error}
            </p>
            <div className="mt-6 flex justify-center">
              <ActionButton variant="ghost" onClick={onRetry}>
                {a.retry}
              </ActionButton>
            </div>
          </div>
        ) : !data ? (
          <p role="status" className="mt-10 text-sm text-ag-muted">
            {a.loading}
          </p>
        ) : (
          <>
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ag-muted">
              <span
                role="status"
                className="inline-flex items-center gap-2.5 rounded-full border border-ag-line px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em]"
              >
                <span
                  aria-hidden
                  className={`size-2 rounded-full ${
                    online ? "animate-blink bg-emerald-400" : "bg-ag-muted"
                  }`}
                />
                {online ? a.botOnline : a.botOffline}
              </span>
              {up && (
                <span className="tabular-nums">
                  {a.uptime} {up}
                </span>
              )}
              <span>{a.weekNote}</span>
            </div>

            {/* Angka ringkas */}
            <Reveal>
              <div className="mt-8 overflow-hidden rounded-[6px] border border-ag-line bg-ag-ink-2/80">
                <div className="-mb-px -mr-px grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
                  <Stat label={a.kGroups} value={fmt(groups.length)} />
                  <Stat label={a.kMembers} value={fmt(data.totalMembers ?? 0)} />
                  <Stat label={a.kUsers} value={fmt(users.length)} />
                  <Stat label={a.kToday} value={fmt(data.today ?? 0)} />
                  <Stat label={a.kWeek} value={fmt(data.week ?? 0)} />
                </div>
              </div>
            </Reveal>

            {/* Sistem */}
            {sys && (
              <Reveal delay={0.05}>
                <h2 className="mt-14 font-display text-2xl uppercase sm:text-3xl">{a.sysTitle}</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {cpu != null && (
                    <SysCard
                      icon={<Cpu className={ic} />}
                      label={ac.cpu}
                      bar={cpu}
                      note={cpuNote}
                      value={`${Math.round(cpu)}%`}
                    />
                  )}
                  {sys.heapUsed != null && sys.heapTotal != null && (
                    <SysCard
                      icon={<MemoryStick className={ic} />}
                      label={ac.heap}
                      bar={heapPct}
                      note={sys.totalMem ? `${ac.totalMem} : ${bytes(sys.totalMem)}` : undefined}
                      value={`${bytes(sys.heapUsed)} / ${bytes(sys.heapTotal)}`}
                    />
                  )}
                  {sys.external != null && (
                    <SysCard
                      icon={<Server className={ic} />}
                      label={ac.external}
                      note={ac.externalNote}
                      value={bytes(sys.external)}
                    />
                  )}
                  {sys.arrayBuffers != null && (
                    <SysCard
                      icon={<Layers className={ic} />}
                      label={ac.arrayBuffer}
                      value={bytes(sys.arrayBuffers)}
                    />
                  )}
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  {data.uptimeSec != null && (
                    <SysCard
                      icon={<Clock className={ic} />}
                      label={ac.uptime}
                      value={uptime(data.uptimeSec, { d: ac.uDay, h: ac.uHour, m: ac.uMin })}
                    />
                  )}
                  {nodeText && (
                    <SysCard icon={<Hexagon className={ic} />} label={ac.node} value={nodeText} />
                  )}
                  {osText && (
                    <SysCard icon={<Monitor className={ic} />} label={ac.os} value={osText} />
                  )}
                </div>
              </Reveal>
            )}

            {/* Tabel grup & user */}
            <Reveal delay={0.05} className="mt-14 space-y-6">
              <Panel title={a.groupsTitle} count={groups.length}>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left text-[13px]">
                    <thead>
                      <tr className="border-b border-ag-line">
                        <th className={th}>{a.colGroup}</th>
                        <th className={`${th} text-right`}>{a.colMembers}</th>
                        <th className={`${th} text-right`}>{a.colCmd7}</th>
                        <th className={`${th} text-right`}>{a.colStatus}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ag-line">
                      {groups.length ? (
                        groups.map((g, i) => (
                          <tr key={`${g.name}-${i}`}>
                            <td className={`${td} font-bold`}>{g.name}</td>
                            <td className={`${td} text-right tabular-nums`}>{fmt(g.members)}</td>
                            <td className={`${td} text-right tabular-nums`}>{fmt(g.cmd7)}</td>
                            <td className={`${td} text-right`}>
                              <Pill tone={g.disabled ? "bad" : "ok"}>
                                {g.disabled ? a.disabled : a.active}
                              </Pill>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <Empty cols={4} text={a.emptyGroups} />
                      )}
                    </tbody>
                  </table>
                </div>
              </Panel>

              <Panel title={a.usersTitle} count={users.length}>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-[13px]">
                    <thead>
                      <tr className="border-b border-ag-line">
                        <th className={th}>{a.colName}</th>
                        <th className={`${th} text-right`}>{a.colNumber}</th>
                        <th className={`${th} text-right`}>{a.colMessages}</th>
                        <th className={`${th} text-right`}>{a.colLast}</th>
                        <th className={`${th} text-right`}>{a.colStatus}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ag-line">
                      {users.length ? (
                        users.map((u, i) => (
                          <tr key={`${u.number}-${i}`}>
                            <td className={`${td} font-bold`}>{u.name || "-"}</td>
                            <td className={`${td} text-right font-mono tabular-nums`}>
                              +{u.number}
                            </td>
                            <td className={`${td} text-right tabular-nums`}>{fmt(u.count)}</td>
                            <td className={`${td} text-right tabular-nums text-ag-muted`}>
                              {when(u.lastSeen)}
                            </td>
                            <td className={`${td} text-right`}>
                              <Pill tone={u.blocked ? "bad" : "ok"}>
                                {u.blocked ? a.blocked : a.active}
                              </Pill>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <Empty cols={5} text={a.emptyUsers} />
                      )}
                    </tbody>
                  </table>
                </div>
              </Panel>
            </Reveal>

            {/* Grafik harian & command teratas */}
            <Reveal delay={0.05} className="mt-6 grid gap-6 lg:grid-cols-2">
              <Panel title={a.dailyTitle}>
                {daily.length ? (
                  <div role="img" aria-label={a.chartLabel} className="px-5 pb-4 pt-6 sm:px-6">
                    <div className="flex h-40 items-end gap-2">
                      {daily.map((x) => (
                        <div
                          key={x.d}
                          title={`${x.d}: ${x.n}`}
                          className="flex h-full flex-1 flex-col justify-end gap-1.5"
                        >
                          <span className="text-center text-[10px] font-bold tabular-nums text-ag-muted">
                            {fmt(x.n)}
                          </span>
                          <span
                            className="block min-h-[3px] rounded-t-[2px] bg-[linear-gradient(to_top,var(--ag-violet),var(--ag-pink))]"
                            style={{ height: `${Math.round((x.n / maxDaily) * 100)}%`, maxHeight: "calc(100% - 1.5rem)" }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 flex gap-2 border-t border-ag-line pt-2">
                      {daily.map((x) => (
                        <span
                          key={x.d}
                          className="flex-1 text-center text-[10px] font-semibold tabular-nums text-ag-muted"
                        >
                          {dayLabel(x.d)}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="px-5 py-10 text-center text-sm text-ag-muted">{a.emptyTop}</p>
                )}
              </Panel>

              <Panel title={a.topTitle} count={top.length}>
                {top.length ? (
                  <ul>
                    {top.map((c) => (
                      <li
                        key={c.command}
                        className="border-b border-ag-line px-5 py-3 last:border-b-0 sm:px-6"
                      >
                        <div className="flex items-center gap-3 text-[13px]">
                          <span className="rounded-[4px] border border-ag-line px-1.5 py-0.5 text-[10px] font-extrabold tracking-wider text-ag-muted">
                            CMD
                          </span>
                          <code className="min-w-0 truncate font-mono font-bold">{c.command}</code>
                          <span className="ml-auto shrink-0 font-bold tabular-nums">
                            {fmt(c.n)}×
                          </span>
                        </div>
                        <span
                          aria-hidden
                          className="mt-2 block h-1 overflow-hidden rounded-full bg-ag-fg/10"
                        >
                          <span
                            className="block h-full rounded-full bg-ag-violet"
                            style={{ width: `${Math.max(2, Math.round((c.n / maxTop) * 100))}%` }}
                          />
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-5 py-10 text-center text-sm text-ag-muted">{a.emptyTop}</p>
                )}
              </Panel>
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}
