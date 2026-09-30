"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NavClock } from "@/components/NavClock";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLanguage } from "@/components/LanguageProvider";
import { Button } from "@/components/ui/Button";
import { navLinks, site } from "@/lib/site";

function LogoMark() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className="size-8 shrink-0">
      <path d="M8 52 26 10h12l18 42h-11l-4-10H23l-4 10Zm18-20h12l-6-15Z" fill="#8B5CF6" />
      <path d="M44 52 53 30" stroke="#F472B6" strokeWidth="5" strokeLinecap="square" />
    </svg>
  );
}

// home=false dipakai di halaman selain landing (mis. admin): tautan section
// diarahkan ke "/#section" supaya tetap berfungsi dari halaman mana pun.
export function Navbar({ home = true }: { home?: boolean }) {
  const base = home ? "" : "/";
  const hrefOf = (l: { href: string; external?: boolean }) =>
    l.external ? l.href : base + l.href;
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = scrolled || open;

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        solid
          ? "border-ag-line bg-ag-ink/75 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav
        aria-label={t.nav.label}
        className="shell flex h-16 items-center justify-between gap-3 lg:gap-6"
      >
        <a
          href={`${base}#top`}
          className="flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <LogoMark />
          <span className="hidden flex-col leading-none min-[385px]:flex">
            <span className="font-display text-lg tracking-[-0.02em]">
              AGEMASEN
            </span>
            <span className="mt-1 hidden text-[9px] font-semibold uppercase tracking-[0.2em] text-ag-muted sm:block">
              {t.nav.tagline}
            </span>
          </span>
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <li key={link.key}>
              <a
                href={hrefOf(link)}
                {...(link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="text-[13px] font-medium text-ag-fg/70 transition-colors hover:text-ag-fg"
              >
                {t.nav[link.key]}
              </a>
            </li>
          ))}
          <li className="flex items-center gap-2">
            <LanguageSwitch />
            <ThemeToggle />
          </li>
          <li>
            <Button href={site.waUrl} external size="sm">
              {t.nav.addBot}
            </Button>
          </li>
        </ul>

        {/* Mobile: switch selalu terlihat di sebelah tombol menu */}
        <div className="-mr-2 ml-auto flex items-center gap-1.5 lg:hidden">
          <LanguageSwitch />
          <ThemeToggle />

          <button
            type="button"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="flex size-11 items-center justify-center"
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="shell border-t border-ag-line pb-6 pt-2 lg:hidden"
          >
            <ul>
              {navLinks.map((link) => (
                <li key={link.key} className="border-b border-ag-line">
                  <a
                    href={hrefOf(link)}
                    {...(link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    onClick={() => setOpen(false)}
                    className="flex min-h-14 items-center font-display text-xl uppercase tracking-[-0.01em]"
                  >
                    {t.nav[link.key]}
                  </a>
                </li>
              ))}
            </ul>
            <Button href={site.waUrl} external size="lg" block className="mt-6">
              {t.nav.addToWa}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    {!open && <NavClock />}
    </>
  );
}
