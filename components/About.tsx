import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { commandCount } from "@/lib/features";

const stats = [
  { value: `${commandCount}+`, label: "Commands", note: "Ketik !menu untuk daftar terbaru." },
  { value: "!", label: "One prefix", note: "Semua command diawali tanda seru." },
  { value: "0", label: "Apps to install", note: "Cukup WhatsApp yang sudah ada." },
];

export function About() {
  return (
    <section id="about" className="relative border-t border-ag-line py-24 lg:py-36">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-6">
            <SectionLabel index="02" label="About Agemasen" />
            <h2 className="display-h mt-8">
              Not just
              <br />a bot.
            </h2>
          </Reveal>

          <Reveal
            delay={0.1}
            className="space-y-5 text-[15px] leading-relaxed text-ag-muted lg:col-span-5 lg:col-start-8 lg:pt-16"
          >
            <p className="text-lg font-semibold leading-snug text-white sm:text-xl">
              Agemasen mengumpulkan alat harian di satu chat: stiker, unduhan,
              foto HD, pencarian gambar, sampai ringkasan obrolan grup.
            </p>
            <p className="max-w-[52ch]">
              Semuanya jalan langsung dari WhatsApp, di grup maupun chat
              pribadi. Sifatnya galak, tapi selalu bantuin.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.05}>
          <dl className="mt-16 grid border-t border-ag-line sm:grid-cols-3 lg:mt-24">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col border-b border-ag-line py-8 sm:border-b-0 sm:border-l sm:px-8 sm:first:border-l-0 sm:first:pl-0"
              >
                <dt className="order-2 mt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-ag-muted">
                  {s.label}
                </dt>
                <dd className="font-display text-6xl leading-none tracking-[-0.03em]">
                  {s.value}
                </dd>
                <dd className="order-3 mt-4 text-[13px] font-medium leading-relaxed text-ag-muted">
                  {s.note}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
