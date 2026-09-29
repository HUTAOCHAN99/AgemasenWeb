import { navLinks } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-ag-line">
      <div className="shell grid gap-10 py-14 md:grid-cols-3 md:gap-8">
        <div>
          <p className="font-display text-xl tracking-[-0.02em]">AGEMASEN</p>
          <p className="mt-2 text-sm text-ag-muted">WhatsApp Bot / Fan Project</p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 md:justify-center">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(link.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-sm leading-relaxed text-ag-muted md:text-right">
          <p className="font-semibold text-white/80">Fan Project</p>
          <p>Not affiliated with Cygames / Uma Musume.</p>
        </div>
      </div>

      <div className="border-t border-ag-line">
        <div className="shell flex flex-col gap-2 py-6 text-xs text-ag-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Agemasen.</p>
          <p>Made with curiosity &amp; caffeine.</p>
          <a href="/admin" className="hover:text-white">
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
}
