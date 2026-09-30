"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { navLinks } from "@/lib/site";

export function Footer({ home = true }: { home?: boolean }) {
  const base = home ? "" : "/";
  const { t } = useLanguage();

  return (
    <footer className="border-t border-ag-line">
      <div className="shell grid gap-10 py-14 md:grid-cols-3 md:gap-8">
        <div>
          <p className="font-display text-xl tracking-[-0.02em]">AGEMASEN</p>
          <p className="mt-2 text-sm text-ag-muted">{t.footer.tagline}</p>
        </div>

        <nav aria-label={t.footer.nav}>
          <ul className="flex flex-wrap gap-x-6 gap-y-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-ag-fg/70 md:justify-center">
            {navLinks.map((link) => (
              <li key={link.key}>
                <a
                  href={link.external ? link.href : base + link.href}
                  {...(link.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="transition-colors hover:text-ag-fg"
                >
                  {t.nav[link.key]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-sm leading-relaxed text-ag-muted md:text-right">
          <p className="font-semibold text-ag-fg/80">{t.footer.fanTitle}</p>
          <p>{t.footer.fanNote}</p>
        </div>
      </div>

      <div className="border-t border-ag-line">
        <div className="shell flex flex-col gap-2 py-6 text-xs text-ag-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Agemasen.</p>
          <p>{t.footer.madeWith}</p>
        </div>
      </div>
    </footer>
  );
}
