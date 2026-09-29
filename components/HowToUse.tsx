import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

const steps = [
  {
    title: "Open WhatsApp",
    body: "Buka WhatsApp, lalu chat nomor Agemasen atau tambahkan bot ke grupmu.",
  },
  {
    title: "Send command",
    body: "Kirim command diawali tanda seru. Mulai dari !menu untuk melihat daftarnya.",
  },
  {
    title: "Enjoy",
    body: "Hasilnya datang di chat yang sama: stiker, video, foto HD, atau balasan galak yang membantu.",
  },
];

export function HowToUse() {
  return (
    <section id="how-to-use" className="relative border-t border-ag-line py-24 lg:py-36">
      <div className="shell">
        <Reveal>
          <SectionLabel index="05" label="Three steps" />
          <h2 className="display-h mt-8">How to use</h2>
        </Reveal>

        <Reveal delay={0.1}>
          <ol className="relative mt-16 grid gap-12 md:grid-cols-3 md:gap-8 lg:mt-24">
            {/* Garis penghubung: vertikal di mobile, horizontal di desktop */}
            <span
              aria-hidden
              className="absolute bottom-6 left-[21px] top-6 w-px bg-gradient-to-b from-ag-violet/70 via-white/20 to-ag-pink/70 md:hidden"
            />
            <span
              aria-hidden
              className="absolute left-6 right-6 top-[21px] hidden h-px bg-gradient-to-r from-ag-violet/70 via-white/20 to-ag-pink/70 md:block"
            />
            {steps.map((step, i) => (
              <li key={step.title} className="relative pl-16 md:pl-0 md:pt-16">
                <span className="absolute left-0 top-0 flex size-11 items-center justify-center border border-ag-line bg-ag-ink font-display text-sm tabular-nums text-ag-pink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-xl uppercase tracking-[-0.01em]">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-[34ch] text-[15px] leading-relaxed text-ag-muted">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
