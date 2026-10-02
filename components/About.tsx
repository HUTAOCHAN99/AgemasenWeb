"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { Lines } from "@/components/ui/Lines";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { commandCount } from "@/lib/features";

export function About() {
  const { t } = useLanguage();
  const { stats: s } = t.about;
  const stats = [
    { value: `${commandCount}+`, ...s.commands },
    { value: "!", ...s.prefix },
    { value: "0", ...s.apps },
  ];

  return (
    <section id="about" className="relative border-t border-ag-line py-24 lg:py-36">
      <div className="shell">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-6">
            <SectionLabel index="02" label={t.about.label} />
            <h2 className="display-h mt-8">
              <Lines lines={t.about.heading} />
            </h2>
          </Reveal>

          <Reveal
            delay={0.1}
            className="space-y-5 text-[15px] leading-relaxed text-ag-muted lg:col-span-5 lg:col-start-8 lg:pt-16"
          >
            <p className="text-lg font-semibold leading-snug text-ag-fg sm:text-xl">
              {t.about.lead}
            </p>
            <p className="max-w-[52ch]">{t.about.body}</p>
          </Reveal>
        </div>

        <Reveal delay={0.05}>
          <dl className="mt-16 grid border-t border-ag-line sm:grid-cols-3 lg:mt-24">
            {stats.map((st) => (
              <div
                key={st.label}
                className="flex flex-col border-b border-ag-line py-8 sm:border-b-0 sm:border-l sm:px-8 sm:first:border-l-0 sm:first:pl-0"
              >
                <dt className="order-2 mt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-ag-muted">
                  {st.label}
                </dt>
                <dd className="font-display text-6xl leading-none tracking-[-0.03em]">
                  {st.value}
                </dd>
                <dd className="order-3 mt-4 text-[13px] font-medium leading-relaxed text-ag-muted">
                  {st.note}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
