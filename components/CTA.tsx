"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { Button } from "@/components/ui/Button";
import { Lines } from "@/components/ui/Lines";
import { MascotArt } from "@/components/ui/MascotArt";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/lib/site";

export function CTA() {
  const { t } = useLanguage();

  return (
    <section
      id="cta"
      className="relative isolate overflow-clip border-t border-ag-line"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#2b1259_0%,#1a0b3a_45%,#0d0a14_100%)] light:bg-[linear-gradient(135deg,#efe9ff_0%,#faf7ff_52%,#f7eaf1_100%)]"
      />
      <div
        aria-hidden
        className="animate-glow absolute -left-[10%] top-1/2 -z-10 size-[42rem] max-w-[120vw] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(192_38_211/0.35),transparent_70%)]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-[-3%] -z-10 hidden w-[42%] opacity-90 md:block"
      >
        <MascotArt
          src="/image/eyes.png"
          alt=""
          kind="image"
          float={false}
          sizes="40vw"
          className="absolute inset-0"
        />
      </div>

      <div className="shell py-24 lg:py-36">
        <Reveal className="max-w-[56rem]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ag-pink">
            {t.cta.eyebrow}
          </p>
          <h2 className="display-h mt-6">
            <Lines lines={t.cta.heading} />
          </h2>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button href={site.waUrl} external size="lg" className="w-full sm:w-auto">
              {t.cta.add}
            </Button>
            {site.githubUrl ? (
              <Button href={site.githubUrl} external variant="ghost" size="lg" className="w-full sm:w-auto">
                {t.cta.github}
              </Button>
            ) : (
              <Button href="/home" variant="ghost" size="lg" className="w-full sm:w-auto">
                {t.cta.viewCommands}
              </Button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
