"use client";

import { useCallback, useState } from "react";
import { FeatureTutorial } from "@/components/FeatureTutorial";
import { useLanguage } from "@/components/LanguageProvider";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Lines } from "@/components/ui/Lines";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { features } from "@/lib/features";
import type { FeatureKey } from "@/lib/i18n";

export function Features() {
  const { t } = useLanguage();
  const [active, setActive] = useState<FeatureKey | null>(null);
  const close = useCallback(() => setActive(null), []);

  return (
    <section id="features" className="relative border-t border-ag-line py-24 lg:py-36">
      <div className="shell">
        <Reveal className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <SectionLabel index="03" label={t.features.label} />
            <h2 className="display-h mt-8">
              <Lines lines={t.features.heading} />
            </h2>
          </div>
          <p className="max-w-[38ch] text-[15px] leading-relaxed text-ag-muted">
            {t.features.noteBefore}
            <code className="font-mono text-ag-fg">!menu</code>
            {t.features.noteAfter}
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-4 md:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {features.map((feature, i) => (
            <li key={feature.key}>
              <Reveal delay={(i % 3) * 0.07} className="h-full">
                <FeatureCard
                  feature={feature}
                  index={i}
                  onOpen={() => setActive(feature.key)}
                />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      <FeatureTutorial activeKey={active} onSelect={setActive} onClose={close} />
    </section>
  );
}
