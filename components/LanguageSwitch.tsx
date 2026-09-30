"use client";

import { LANGS } from "@/lib/i18n";
import { useLanguage } from "@/components/LanguageProvider";

// Tombol switch ID / EN. Segmen aktif diberi latar ungu.
export function LanguageSwitch({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t.lang.group}
      className={`inline-flex items-center border border-ag-line p-0.5 ${className}`}
    >
      {LANGS.map((code) => {
        const active = code === lang;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            aria-pressed={active}
            aria-label={t.lang[code]}
            title={t.lang[code]}
            onClick={() => setLang(code)}
            className={`h-8 min-w-8 px-2 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors duration-200 ${
              active
                ? "bg-[#7c3aed] text-white"
                : "text-ag-fg/60 hover:text-ag-fg"
            }`}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
