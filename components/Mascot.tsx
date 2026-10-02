"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { Lines } from "@/components/ui/Lines";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MascotArt } from "@/components/ui/MascotArt";


function Corners() {
  const c = "absolute size-4 border-ag-fg/60";
  return (
    <>
      <span aria-hidden className={`${c} left-0 top-0 border-l border-t`} />
      <span aria-hidden className={`${c} right-0 top-0 border-r border-t`} />
      <span aria-hidden className={`${c} bottom-0 left-0 border-b border-l`} />
      <span aria-hidden className={`${c} bottom-0 right-0 border-b border-r`} />
    </>
  );
}

export function Mascot({ art }: { art: string | null }) {
  const { t } = useLanguage();
  const { tags, profile, lines } = t.mascot;

  return (
    <section id="mascot" className="relative border-t border-ag-line py-24 lg:py-36">
      <div className="shell grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-6">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px] lg:max-w-none">
            <Corners />
            <p
              aria-hidden
              className="absolute left-4 top-4 z-10 text-[10px] font-semibold uppercase tracking-[0.22em] text-ag-fg/50"
            >
              Profile / 05
            </p>
            <p
              aria-hidden
              className="absolute right-4 top-4 z-10 text-[10px] font-semibold tracking-[0.22em] text-ag-fg/50"
            >
              スペシャルウィーク
            </p>
            <MascotArt
              src={art}
              alt={t.mascot.alt}
              kind="image"
              sizes="(min-width: 1024px) 50vw, 92vw"
              className="absolute inset-0 pt-10"
            />
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-6 lg:pl-6">
          <SectionLabel index="05" label={t.mascot.label} />
          <h2 className="display-h mt-8">
            <Lines lines={t.mascot.heading} />
          </h2>
          <p className="mt-8 text-2xl font-extrabold leading-[1.15] tracking-tight sm:text-3xl">
            <span className="block">{lines[0]}</span>
            <span className="block">{lines[1]}</span>
            <span className="block text-ag-pink">{lines[2]}</span>
          </p>
          <p className="mt-6 max-w-[50ch] text-[15px] leading-relaxed text-ag-muted">
            {t.mascot.body}
          </p>

          <ul className="mt-8 flex flex-wrap gap-2" aria-label={t.mascot.tagsLabel}>
            {tags.map((t) => (
              <li
                key={t}
                className="border border-ag-line px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ag-fg/80"
              >
                {t}
              </li>
            ))}
          </ul>

          <dl className="mt-10 grid grid-cols-3 border-y border-ag-line">
            {profile.map((p, i) => (
              <div key={p.k} className="border-l border-ag-line px-4 py-4 first:border-l-0 first:pl-0">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ag-muted">
                  {p.k}
                </dt>
                <dd className="mt-1.5 flex items-center gap-2 font-display text-base uppercase sm:text-lg">
                  {i === profile.length - 1 && (
                    <span
                      aria-hidden
                      className="animate-blink size-1.5 shrink-0 rounded-full bg-ag-pink"
                    />
                  )}
                  {p.v}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-8 max-w-[52ch] text-xs leading-relaxed text-ag-muted/80">
            {t.mascot.disclaimer}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
