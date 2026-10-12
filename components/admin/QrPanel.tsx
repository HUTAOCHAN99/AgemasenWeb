"use client";

import { QRCodeSVG } from "qrcode.react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { Panel, Pill } from "@/components/admin/parts";
import { ActionButton } from "@/components/ui/ActionButton";

// Bentuk respons /api/qr (lihat api/qr.js).
type QrBot = {
  id: string;
  label: string;
  reachable: boolean;
  error?: string;
  status?: string;
  qr?: string | null;
  qrAt?: number | null;
  number?: string | null;
};

const POLL_MS = 2500;

// Menampilkan QR login tiap bot supaya bisa discan langsung dari web.
// Polling /api/qr tiap beberapa detik (berhenti saat tab browser tersembunyi).
// Dipisah dari /api/stats supaya tetap jalan walau bot belum login.
export function QrPanel({ onUnauthorized }: { onUnauthorized: () => void }) {
  const { t } = useLanguage();
  const a = t.admin;
  const [bots, setBots] = useState<QrBot[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const alive = useRef(true);

  const poll = useCallback(async () => {
    try {
      const r = await fetch("/api/qr", { cache: "no-store" });
      if (r.status === 401) return onUnauthorized();
      const d = await r.json().catch(() => ({}));
      if (!alive.current) return;
      if (!r.ok) setError(d.error || a.errLoad);
      else {
        setError(null);
        setBots(d.bots ?? []);
      }
    } catch {
      if (alive.current) setError(a.errNetwork);
    }
    if (alive.current && !document.hidden) timer.current = setTimeout(poll, POLL_MS);
  }, [a.errLoad, a.errNetwork, onUnauthorized]);

  useEffect(() => {
    alive.current = true;
    poll();
    const onVis = () => {
      if (!document.hidden) {
        if (timer.current) clearTimeout(timer.current);
        poll();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      alive.current = false;
      if (timer.current) clearTimeout(timer.current);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [poll]);

  async function act(botId: string, action: "restart" | "reset") {
    if (action === "reset" && !window.confirm(a.qrResetConfirm)) return;
    setBusy(botId + action);
    setNote(null);
    try {
      const r = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ botId, action }),
      });
      const d = await r.json().catch(() => ({}));
      setNote(r.ok ? a.qrRestartDone : d.error || a.qrActionFail);
      if (r.ok) setTimeout(poll, 1500);
    } catch {
      setNote(a.qrActionFail);
    }
    setBusy(null);
  }

  const statusOf = (b: QrBot): { text: string; tone: "ok" | "bad" } => {
    if (!b.reachable) return { text: a.qrStatusUnreachable, tone: "bad" };
    switch (b.status) {
      case "connected": return { text: a.qrStatusConnected, tone: "ok" };
      case "qr": return { text: a.qrStatusWaiting, tone: "bad" };
      case "connecting": return { text: a.qrStatusConnecting, tone: "bad" };
      case "closed": return { text: a.qrStatusClosed, tone: "bad" };
      case "logged_out": return { text: a.qrStatusLoggedOut, tone: "bad" };
      case "replaced": return { text: a.qrStatusReplaced, tone: "bad" };
      default: return { text: a.qrStatusStarting, tone: "bad" };
    }
  };

  return (
    <section aria-labelledby="admin-title" className="relative pb-20 pt-28 lg:pb-28 lg:pt-32">
      <div className="shell">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ag-pink">{a.eyebrow}</p>
        <h1 id="admin-title" className="display-h mt-4 text-[clamp(2rem,5.4vw,3.75rem)]">
          {a.qrTitle}
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-ag-muted">{a.qrLead}</p>

        {error && (
          <p role="alert" className="mt-8 text-sm font-semibold text-ag-pink">
            {error}
          </p>
        )}
        {!bots && !error && (
          <p role="status" className="mt-8 text-sm text-ag-muted">
            {a.loading}
          </p>
        )}
        {bots && bots.length === 0 && <p className="mt-8 text-sm text-ag-muted">{a.qrEmpty}</p>}
        {note && (
          <p role="status" className="mt-6 text-sm text-ag-muted">
            {note}
          </p>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {(bots ?? []).map((b) => {
            const st = statusOf(b);
            return (
              <Panel key={b.id} title={b.label}>
                <div className="flex flex-col items-center gap-4 px-5 py-6 text-center">
                  <Pill tone={st.tone}>{st.text}</Pill>

                  {b.reachable && b.status === "qr" && b.qr ? (
                    <>
                      {/* Latar putih + quiet zone wajib supaya QR terbaca kamera HP, juga di dark mode. */}
                      <div className="rounded-[6px] bg-white p-3">
                        <QRCodeSVG
                          value={b.qr}
                          size={248}
                          level="L"
                          marginSize={2}
                          bgColor="#ffffff"
                          fgColor="#000000"
                          title={`QR ${b.label}`}
                        />
                      </div>
                      <p className="text-xs text-ag-muted">{a.qrAutoRefresh}</p>
                    </>
                  ) : b.reachable && b.status === "connected" ? (
                    <p className="text-sm">
                      {a.qrConnectedAs}{" "}
                      <span className="font-mono font-bold">{b.number ? `+${b.number}` : "—"}</span>
                    </p>
                  ) : !b.reachable ? (
                    <p className="text-sm text-ag-muted">{b.error}</p>
                  ) : (
                    <p role="status" className="text-sm text-ag-muted">
                      {st.text}
                    </p>
                  )}

                  {b.reachable && (
                    <div className="mt-2 flex flex-wrap justify-center gap-2">
                      <ActionButton
                        variant="ghost"
                        size="sm"
                        disabled={busy !== null}
                        onClick={() => act(b.id, "restart")}
                      >
                        {a.qrRestart}
                      </ActionButton>
                      <ActionButton
                        variant="ghost"
                        size="sm"
                        disabled={busy !== null}
                        onClick={() => act(b.id, "reset")}
                      >
                        {a.qrReset}
                      </ActionButton>
                    </div>
                  )}
                </div>
              </Panel>
            );
          })}
        </div>
      </div>
    </section>
  );
}
