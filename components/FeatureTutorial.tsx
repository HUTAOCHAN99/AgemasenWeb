"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/components/LanguageProvider";
import { features } from "@/lib/features";
import type { FeatureKey } from "@/lib/i18n";
import { tutorials } from "@/lib/tutorials";

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function FeatureTutorial({
  activeKey,
  onSelect,
  onClose,
}: {
  activeKey: FeatureKey | null;
  onSelect: (key: FeatureKey) => void;
  onClose: () => void;
}) {
  const { t, lang } = useLanguage();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = activeKey !== null;

  // Portal baru dipasang setelah mount supaya tidak ada hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Kunci scroll halaman, tutup dengan Esc, jaga fokus tetap di dalam panel,
  // dan kembalikan fokus ke kartu yang tadi diklik saat panel ditutup.
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previous?.focus?.();
    };
  }, [open, onClose]);

  // Pindah fitur lewat shortcut: mulai lagi dari atas.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [activeKey]);

  const feature = features.find((f) => f.key === activeKey);
  const tt = t.features.tutorial;

  const content =
    feature && activeKey ? (
      <div
        key="tutorial"
        className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6"
        role="presentation"
      >
        <motion.div
          aria-hidden
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="relative flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[10px] border border-ag-line bg-ag-ink-2 sm:max-h-[86dvh] sm:rounded-[6px]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-start justify-between gap-4 border-b border-ag-line p-5 sm:p-6">
            <div className="flex items-center gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center border border-ag-line text-ag-pink">
                <feature.icon className="size-5" strokeWidth={1.75} aria-hidden />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ag-muted">
                  {tt.label}
                </p>
                <h3
                  id={titleId}
                  className="font-display text-xl uppercase leading-tight tracking-[-0.01em]"
                >
                  {t.features.items[activeKey].title}
                </h3>
              </div>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={tt.close}
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-ag-line transition hover:border-ag-pink hover:text-ag-pink"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain">
            <p className="px-5 pt-5 text-sm leading-relaxed text-ag-muted sm:px-6">
              {t.features.items[activeKey].description}
            </p>

            <ul className="divide-y divide-ag-line">
              {tutorials[lang][activeKey].map((c) => (
                <li key={c.cmd} className="p-5 sm:p-6">
                  <code className="inline-block border border-ag-violet/50 bg-ag-violet/10 px-2.5 py-1 font-mono text-[13px] text-ag-fg">
                    {c.cmd}
                  </code>
                  <p className="mt-3 text-[15px] leading-relaxed">{c.summary}</p>

                  <ol className="mt-4 space-y-2.5">
                    {c.steps.map((s, i) => (
                      <li key={i} className="flex gap-3 text-sm leading-relaxed text-ag-fg/85">
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-ag-line text-[11px] font-semibold tabular-nums text-ag-pink">
                          {i + 1}
                        </span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ol>

                  {c.example && (
                    <div className="mt-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ag-muted">
                        {tt.example}
                      </p>
                      <div className="mt-2 space-y-1.5">
                        {c.example.map((line) => (
                          <p
                            key={line}
                            className="overflow-x-auto whitespace-pre rounded-[4px] bg-[#5b21b6]/70 px-3 py-2 font-mono text-[13px] text-white light:bg-[#6d28d9]"
                          >
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {c.tip && (
                    <p className="mt-4 border-l-2 border-ag-pink/70 pl-3 text-[13px] leading-relaxed text-ag-muted">
                      <span className="font-semibold text-ag-fg/80">{tt.tip}: </span>
                      {c.tip}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-ag-line p-5 sm:px-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ag-muted">
              {tt.others}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {features
                .filter((f) => f.key !== activeKey)
                .map((f) => (
                  <li key={f.key}>
                    <button
                      type="button"
                      onClick={() => onSelect(f.key)}
                      className="inline-flex items-center gap-2 rounded-full border border-ag-line px-3 py-1.5 text-xs transition hover:border-ag-pink hover:text-ag-pink"
                    >
                      <f.icon className="size-3.5" strokeWidth={1.75} aria-hidden />
                      {t.features.items[f.key].title}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </motion.div>
      </div>
    ) : null;

  if (!mounted) return null;
  return createPortal(<AnimatePresence>{content}</AnimatePresence>, document.body);
}
