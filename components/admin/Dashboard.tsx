"use client";

import { Clock, Cpu, Hexagon, Layers, MemoryStick, Monitor, Server } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { Stat, SysCard, bytes, uptime } from "@/components/ServerActivity";
import { ActionButton } from "@/components/ui/ActionButton";
import { GroupList, UserList, type GroupRow, type UserRow } from "@/components/admin/Lists";
import { Panel } from "@/components/admin/parts";
import type { SubInfo } from "@/components/admin/Subscription";
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
  groups?: GroupRow[];
  users?: UserRow[];
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

export type Tab = "overview" | "system" | "groups" | "users";

export function Dashboard({
  data,
  error,
  tab,
  onRetry,
  onToggled,
  onSubscribed,
}: {
  data: Stats | null;
  error: string | null;
  tab: Tab;
  onRetry: () => void;
  onToggled: (kind: "group" | "user", id: string, disabled: boolean) => void;
  onSubscribed: (kind: "group" | "user", id: string, sub: SubInfo) => void;
}) {
  const { t } = useLanguage();
  const a = t.admin;
  const ac = t.activity;
  const fmt = (n: number) => n.toLocaleString(a.locale);

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
  const heading = {
    overview: a.title,
    system: a.sysTitle,
    groups: a.groupsTitle,
    users: a.usersTitle,
  }[tab];

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
              {heading}
            </h1>
          </div>
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

            {tab === "overview" && (
              <>
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

              </>
            )}

            {tab === "system" && sys && (
              <>
            {/* Sistem */}
            {sys && (
              <Reveal delay={0.05}>
                <div className="mt-8 grid gap-4 md:grid-cols-2">
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

              </>
            )}

            {tab === "system" && !sys && (
              <p className="mt-10 text-sm text-ag-muted">{a.emptyTop}</p>
            )}

            {tab === "groups" && (
              <Reveal className="mt-8">
                <GroupList groups={groups} onToggled={onToggled} onSubscribed={onSubscribed} />
              </Reveal>
            )}

            {tab === "users" && (
              <Reveal className="mt-8">
                <UserList users={users} onToggled={onToggled} onSubscribed={onSubscribed} />
              </Reveal>
            )}

            {tab === "overview" && (
              <>
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

          </>
        )}
      </div>
    </section>
  );
}
