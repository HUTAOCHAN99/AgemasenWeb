"use client";

import { motion, type Variants } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import { Button } from "@/components/ui/Button";
import { Lines } from "@/components/ui/Lines";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.35, delayChildren: 0.15 } },
};
const pop: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
};

function Bubble({
  from,
  children,
}: {
  from: "me" | "bot";
  children: React.ReactNode;
}) {
  const me = from === "me";
  return (
    <motion.li
      variants={pop}
      className={`max-w-[88%] px-3.5 py-2.5 text-sm leading-relaxed sm:max-w-[80%] ${
        me
          ? "self-end rounded-lg rounded-br-sm bg-[#5b21b6]/70 font-mono text-[13px] text-white light:bg-[#6d28d9]"
          : "self-start rounded-lg rounded-bl-sm border border-ag-line bg-ag-fg/5 text-ag-fg/90"
      }`}
    >
      {children}
    </motion.li>
  );
}

export function CommandPreview() {
  const { t } = useLanguage();
  const p = t.preview;

  return (
    <section id="preview" className="relative border-t border-ag-line py-24 lg:py-36">
      <div className="shell grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-5">
          <SectionLabel index="06" label={p.label} />
          <h2 className="display-h mt-8">
            <Lines lines={p.heading} />
          </h2>
          <p className="mt-8 max-w-[40ch] text-[15px] leading-relaxed text-ag-muted">
            {p.body}
          </p>
          <div className="mt-8">
            <Button href="/home" variant="ghost">
              {p.seeAll}
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-7">
          <div className="overflow-hidden rounded-[6px] border border-ag-line bg-ag-ink-2/80">
            <div className="flex items-center gap-3 border-b border-ag-line px-4 py-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-ag-violet/20 font-display text-xs text-ag-pink">
                A
              </span>
              <div className="leading-tight">
                <p className="text-sm font-bold">Agemasen</p>
                <p className="text-[11px] text-ag-muted">{p.botStatus}</p>
              </div>
              <span aria-hidden className="ml-auto flex gap-1.5">
                <i className="size-1.5 rounded-full bg-ag-fg/25" />
                <i className="size-1.5 rounded-full bg-ag-fg/25" />
                <i className="size-1.5 rounded-full bg-ag-fg/25" />
              </span>
            </div>

            <motion.ol
              variants={list}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              aria-label={p.chatLabel}
              className="flex min-h-[420px] flex-col gap-3 p-4 sm:p-6"
            >
              <Bubble from="me">!menu</Bubble>
              <Bubble from="bot">
                <span className="block font-mono text-[13px] font-bold tracking-wide">
                  AGEMASEN
                </span>
                <span aria-hidden className="block font-mono text-[13px] text-ag-fg/30">
                  ━━━━━━━━━━━━
                </span>
                {p.menu.map((m) => (
                  <span key={m} className="block font-mono text-[13px] uppercase text-ag-fg/75">
                    {m}
                  </span>
                ))}
              </Bubble>
              <Bubble from="me">{p.hdCmd}</Bubble>
              <Bubble from="bot">{p.hdReply}</Bubble>
              <Bubble from="me">{p.dlCmd}</Bubble>
              <Bubble from="bot">{p.dlReply}</Bubble>
            </motion.ol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
