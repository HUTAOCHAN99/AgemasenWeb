import { FeatureCard } from "@/components/ui/FeatureCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { features } from "@/lib/features";

export function Features() {
  return (
    <section id="features" className="relative border-t border-ag-line py-24 lg:py-36">
      <div className="shell">
        <Reveal className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <SectionLabel index="03" label="Features" />
            <h2 className="display-h mt-8">
              One bot.
              <br />
              Many things
              <br />
              to do.
            </h2>
          </div>
          <p className="max-w-[38ch] text-[15px] leading-relaxed text-ag-muted">
            Setiap kartu menuju daftar command-nya. Untuk versi paling baru,
            ketik <code className="font-mono text-white">!menu</code> di chat.
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-4 md:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {features.map((feature, i) => (
            <li key={feature.title}>
              <Reveal delay={(i % 3) * 0.07} className="h-full">
                <FeatureCard feature={feature} index={i} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
