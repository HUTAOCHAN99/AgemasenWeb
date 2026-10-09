"use client";

import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { Pill } from "@/components/admin/parts";

// Bahasa bot untuk satu grup / user, dikirim bot (data aslinya di Supabase,
// tabel chat_settings). explicit=false artinya belum pernah diatur dan bot
// memakai bahasa bawaannya (`default`).
export type LangInfo = {
  lang: string;
  explicit: boolean;
  default: string;
  available: string[];
  enabled: boolean;
};

const btn =
  "h-9 flex-1 rounded-[6px] border px-3 text-[12px] font-bold transition-colors disabled:cursor-wait disabled:opacity-60";

// Panel di drawer detail: pilih bahasa balasan bot (sama dengan !lang di WA,
// tapi tanpa batas admin grup karena yang mengatur sudah admin dashboard).
export function LanguagePanel({
  botId,
  kind,
  id,
  info,
  onChange,
}: {
  botId?: string; // MULTI-BOT: bahasa diatur per bot (nomor WA)
  kind: "group" | "user";
  id: string;
  info: LangInfo;
  onChange: (info: LangInfo) => void;
}) {
  const { t } = useLanguage();
  const a = t.admin;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const name = (code: string) =>
    code === "id" ? a.langId : code === "en" ? a.langEn : code.toUpperCase();

  // Yang sedang terpilih di tombol: "default" kalau belum diatur manual.
  const selected = info.explicit ? info.lang : "default";
  const options = ["default", ...info.available];

  async function pick(lang: string) {
    if (busy || lang === selected) return;
    setBusy(true);
    setError(null);
    try {
      const r = await fetch("/api/language", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ botId, type: kind, id, lang }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.language) throw new Error(d.error || a.errLang);
      onChange(d.language as LangInfo);
    } catch (e) {
      setError((e as Error).message || a.errLang);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-4 rounded-[6px] border border-ag-line bg-ag-ink-2/80 p-4">
      <div className="flex items-center gap-3">
        <p className="text-[13px] font-bold">{a.langTitle}</p>
        <span className="ml-auto">
          <Pill tone="ok">{info.explicit ? a.langSet : a.langDefault}</Pill>
        </span>
      </div>

      <dl className="mt-3 text-[13px]">
        <div className="flex items-start justify-between gap-6 py-2">
          <dt className="text-ag-muted">{a.langCurrent}</dt>
          <dd className="text-right font-bold">{name(info.lang)}</dd>
        </div>
      </dl>

      <div className="mt-2 flex gap-2" role="group" aria-label={a.langTitle}>
        {options.map((code) => {
          const on = code === selected;
          return (
            <button
              key={code}
              type="button"
              disabled={busy || !info.enabled}
              aria-pressed={on}
              onClick={() => pick(code)}
              className={`${btn} ${
                on
                  ? "border-ag-violet bg-ag-violet/15"
                  : "border-ag-line hover:bg-ag-fg/[0.06]"
              }`}
            >
              {code === "default"
                ? a.langDefaultNow.replace("{lang}", name(info.default))
                : name(code)}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-[12px] leading-relaxed text-ag-muted">
        {kind === "group" ? a.langHintGroup : a.langHintUser}
      </p>
      {!info.enabled && (
        <p role="alert" className="mt-3 text-[12px] font-semibold text-ag-pink">
          {a.langOff}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-3 text-[12px] font-semibold text-ag-pink">
          {error}
        </p>
      )}
    </div>
  );
}
