"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { Avatar, Pill } from "@/components/admin/parts";

export type DetailKind = "group" | "user";

// Baris yang diklik di daftar: dipakai untuk tampilan awal selagi detail dimuat.
export type DetailTarget = {
  kind: DetailKind;
  id: string; // jid grup / nomor user
  name: string;
  pp?: string | null;
  disabled: boolean;
  members?: number;
};

type CmdInfo = {
  today: number;
  week: number;
  total: number;
  last: string | null;
  top: { command: string; n: number }[];
};
type Person = { name: string | null; number: string | null; super?: boolean };
type Detail = {
  pp?: string | null;
  disabled?: boolean;
  blocked?: boolean;
  name?: string | null;
  members?: number;
  created?: number | null;
  desc?: string | null;
  adminCount?: number;
  creator?: Person | null;
  onlyAdminsSend?: boolean;
  onlyAdminsEdit?: boolean;
  admins?: Person[];
  number?: string;
  messages?: number;
  firstSeen?: string | null;
  lastSeen?: string | null;
  commands?: CmdInfo;
};

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-ag-line py-3 text-[13px] last:border-b-0">
      <dt className="shrink-0 text-ag-muted">{label}</dt>
      <dd className="min-w-0 break-words text-right font-semibold tabular-nums">{children}</dd>
    </div>
  );
}

export function DetailDrawer({
  target,
  onClose,
  onToggled,
}: {
  target: DetailTarget | null;
  onClose: () => void;
  onToggled: (kind: DetailKind, id: string, disabled: boolean) => void;
}) {
  const { t } = useLanguage();
  const a = t.admin;
  const closeRef = useRef<HTMLButtonElement>(null);

  const [detail, setDetail] = useState<Detail | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toggleError, setToggleError] = useState<string | null>(null);

  const key = target ? `${target.kind}:${target.id}` : null;

  // Muat detail setiap kali target berganti.
  useEffect(() => {
    if (!target) return;
    setDetail(null);
    setLoadError(null);
    setToggleError(null);
    setDisabled(target.disabled);
    const ctrl = new AbortController();
    const qs = new URLSearchParams({ type: target.kind, id: target.id });
    fetch(`/api/detail?${qs}`, { cache: "no-store", signal: ctrl.signal })
      .then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(d.error || a.errDetail);
        setDetail(d);
        setDisabled(!!(d.disabled ?? d.blocked));
      })
      .catch((e: Error) => {
        if (e.name !== "AbortError") setLoadError(e.message || a.errDetail);
      });
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Esc menutup, halaman di belakang tidak ikut scroll, fokus ke tombol tutup.
  useEffect(() => {
    if (!target) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [target, onClose]);

  async function toggle() {
    if (!target || saving) return;
    const enabled = disabled; // sekarang nonaktif -> diaktifkan, dan sebaliknya
    setSaving(true);
    setToggleError(null);
    try {
      const r = await fetch("/api/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: target.kind, id: target.id, enabled }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || a.errToggle);
      setDisabled(!enabled);
      onToggled(target.kind, target.id, !enabled);
    } catch (e) {
      setToggleError((e as Error).message || a.errToggle);
    } finally {
      setSaving(false);
    }
  }

  const fmt = (n: number) => n.toLocaleString(a.locale);
  const when = (v?: string | number | null) =>
    v
      ? new Date(v).toLocaleString(a.locale, {
          timeZone: "Asia/Jakarta",
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "-";
  const person = (p: Person) =>
    p.name && p.number ? `${p.name} (+${p.number})` : p.name || (p.number ? `+${p.number}` : a.hidden);

  const isGroup = target?.kind === "group";
  const name = detail?.name || target?.name || "";
  const cmd = detail?.commands;
  const maxTop = Math.max(1, ...(cmd?.top ?? []).map((x) => x.n));

  return (
    <AnimatePresence>
      {target && (
        <div className="fixed inset-0 z-[60]">
          <motion.button
            type="button"
            aria-label={a.close}
            tabIndex={-1}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="detail-title"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-ag-line bg-ag-ink"
          >
            <div className="flex items-center gap-2.5 border-b border-ag-line bg-ag-fg/[0.04] px-5 py-3">
              <span aria-hidden className="size-2 rounded-full bg-ag-pink" />
              <h2 className="text-[12px] font-extrabold uppercase tracking-[0.12em]">
                {a.detail} · {isGroup ? a.navGroups : a.navUsers}
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label={a.close}
                className="-mr-2 ml-auto flex size-10 items-center justify-center"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-10 pt-6">
              {/* Identitas */}
              <div className="flex items-center gap-4">
                <span className="[&>span]:size-16 [&>span]:text-xl">
                  <Avatar src={detail?.pp ?? target.pp} name={name} alt={`${a.ppAlt}: ${name}`} />
                </span>
                <div className="min-w-0">
                  <h3 id="detail-title" className="break-words font-display text-xl leading-tight">
                    {name || "-"}
                  </h3>
                  <p className="mt-1.5 text-[12px] text-ag-muted tabular-nums">
                    {isGroup
                      ? `${fmt(detail?.members ?? target.members ?? 0)} ${a.members}`
                      : `+${target.id}`}
                  </p>
                </div>
              </div>

              {/* Saklar bot */}
              <div className="mt-6 rounded-[6px] border border-ag-line bg-ag-ink-2/80 p-4">
                <div className="flex items-center gap-3">
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold">
                      {isGroup ? a.botSwitchGroup : a.botSwitchUser}
                    </p>
                    <div className="mt-1.5">
                      <Pill tone={disabled ? "bad" : "ok"}>
                        {disabled ? a.switchOff : a.switchOn}
                      </Pill>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={!disabled}
                    aria-label={isGroup ? a.botSwitchGroup : a.botSwitchUser}
                    disabled={saving}
                    onClick={toggle}
                    className={`relative ml-auto h-7 w-12 shrink-0 rounded-full transition-colors disabled:cursor-wait disabled:opacity-60 ${
                      disabled ? "bg-ag-fg/20" : "bg-emerald-400"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`absolute left-0.5 top-0.5 size-6 rounded-full bg-white shadow transition-transform ${
                        disabled ? "" : "translate-x-5"
                      }`}
                    />
                  </button>
                </div>
                <p className="mt-3 text-[12px] leading-relaxed text-ag-muted">
                  {isGroup ? a.hintGroup : a.hintUser}
                </p>
                {toggleError && (
                  <p role="alert" className="mt-3 text-[12px] font-semibold text-ag-pink">
                    {toggleError}
                  </p>
                )}
              </div>

              {loadError ? (
                <p role="alert" className="mt-8 text-sm font-semibold text-ag-pink">
                  {loadError}
                </p>
              ) : !detail ? (
                <p role="status" className="mt-8 text-sm text-ag-muted">
                  {a.loading}
                </p>
              ) : (
                <>
                  {/* Info */}
                  <dl className="mt-6">
                    {isGroup ? (
                      <>
                        <Row label={a.colMembers}>{fmt(detail.members ?? 0)}</Row>
                        <Row label={a.fAdmins}>{fmt(detail.adminCount ?? 0)}</Row>
                        <Row label={a.fCreator}>{detail.creator ? person(detail.creator) : "-"}</Row>
                        <Row label={a.fCreated}>{when(detail.created)}</Row>
                        <Row label={a.fSend}>{detail.onlyAdminsSend ? a.onlyAdmins : a.allMembers}</Row>
                        <Row label={a.fEdit}>{detail.onlyAdminsEdit ? a.onlyAdmins : a.allMembers}</Row>
                      </>
                    ) : (
                      <>
                        <Row label={a.fNumber}>
                          <span className="font-mono">+{detail.number}</span>
                        </Row>
                        <Row label={a.fMsgs}>{fmt(detail.messages ?? 0)}</Row>
                        <Row label={a.fFirst}>{when(detail.firstSeen)}</Row>
                        <Row label={a.fLast}>{when(detail.lastSeen)}</Row>
                      </>
                    )}
                    {cmd && (
                      <>
                        <Row label={a.fCmdToday}>{fmt(cmd.today)}</Row>
                        <Row label={a.fCmd7}>{fmt(cmd.week)}</Row>
                        <Row label={a.fCmdTotal}>{fmt(cmd.total)}</Row>
                        <Row label={a.fCmdLast}>{when(cmd.last)}</Row>
                      </>
                    )}
                  </dl>
                  {!isGroup && (
                    <p className="mt-3 text-[11px] leading-relaxed text-ag-muted">{a.userCmdNote}</p>
                  )}

                  {isGroup && detail.desc && (
                    <section className="mt-8">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.14em] text-ag-muted">
                        {a.fDesc}
                      </h4>
                      <p className="mt-2 whitespace-pre-line break-words text-[13px] leading-relaxed">
                        {detail.desc}
                      </p>
                    </section>
                  )}

                  {/* Command terbanyak */}
                  <section className="mt-8">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.14em] text-ag-muted">
                      {a.fTop}
                    </h4>
                    {cmd?.top.length ? (
                      <ul className="mt-3 space-y-3">
                        {cmd.top.map((c) => (
                          <li key={c.command}>
                            <div className="flex items-center gap-3 text-[13px]">
                              <code className="min-w-0 truncate font-mono font-bold">{c.command}</code>
                              <span className="ml-auto shrink-0 font-bold tabular-nums">{fmt(c.n)}×</span>
                            </div>
                            <span aria-hidden className="mt-1.5 block h-1 overflow-hidden rounded-full bg-ag-fg/10">
                              <span
                                className="block h-full rounded-full bg-ag-violet"
                                style={{ width: `${Math.max(2, Math.round((c.n / maxTop) * 100))}%` }}
                              />
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-sm text-ag-muted">{a.noCmd}</p>
                    )}
                  </section>

                  {/* Daftar admin grup */}
                  {isGroup && !!detail.admins?.length && (
                    <section className="mt-8">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.14em] text-ag-muted">
                        {a.fAdmins} ({fmt(detail.adminCount ?? detail.admins.length)})
                      </h4>
                      <ul className="mt-3 divide-y divide-ag-line rounded-[6px] border border-ag-line">
                        {detail.admins.map((p, i) => (
                          <li key={`${p.number ?? "x"}-${i}`} className="px-3 py-2 text-[13px]">
                            {person(p)}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
