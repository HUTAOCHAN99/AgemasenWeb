"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
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

export function Navbar() {
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
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        solid
          ? "border-ag-line bg-ag-ink/75 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav
        aria-label="Navigasi utama"
        className="shell flex h-16 items-center justify-between gap-6"
      >
        <a
          href="#top"
          className="flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <LogoMark />
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg tracking-[-0.02em]">
              AGEMASEN
            </span>
            <span className="mt-1 hidden text-[9px] font-semibold uppercase tracking-[0.2em] text-ag-muted sm:block">
              WhatsApp bot / community assistant
            </span>
          </span>
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                {...(link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="text-[13px] font-medium text-white/70 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Button href={site.waUrl} external size="sm">
              Add bot
            </Button>
          </li>
        </ul>

        <button
          type="button"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 flex size-11 items-center justify-center lg:hidden"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
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
                <li key={link.label} className="border-b border-ag-line">
                  <a
                    href={link.href}
                    {...(link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    onClick={() => setOpen(false)}
                    className="flex min-h-14 items-center font-display text-xl uppercase tracking-[-0.01em]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <Button href={site.waUrl} external size="lg" block className="mt-6">
              Add to WhatsApp
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
