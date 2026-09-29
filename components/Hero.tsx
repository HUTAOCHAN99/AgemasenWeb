"use client";

import { motion, type Variants } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MascotArt } from "@/components/ui/MascotArt";
import { commandCount } from "@/lib/features";
import { site } from "@/lib/site";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Satu urutan masuk saat halaman dibuka.
const stack: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const meta = [
  `${commandCount}+ commands`,
  "WhatsApp bot",
  "Community project",
];

export function Hero({ art }: { art: string | null }) {
  return (
    <section id="top" className="relative isolate overflow-clip">
      <div
        aria-hidden
        className="grid-lines pointer-events-none absolute inset-0 -z-10"
      />

      <div className="shell relative">
        <motion.div
          variants={stack}
          initial="hidden"
          animate="show"
          className="relative flex flex-col justify-center pb-6 pt-28 lg:min-h-[100svh] lg:pb-16 lg:pt-32"
        >
          <motion.div
            variants={rise}
            className="relative z-20 flex flex-wrap items-center gap-x-5 gap-y-3"
          >
            <span className="border border-ag-pink/40 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ag-pink">
              Anime community bot
            </span>
            <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-ag-muted">
              <span
                aria-hidden
                className="animate-blink size-1.5 rounded-full bg-ag-pink"
              />
              System ready
            </span>
          </motion.div>

          <motion.h1
            variants={rise}
            className="wordmark relative z-0 mt-6 font-display uppercase"
          >
            Agemasen
          </motion.h1>

          <div className="relative z-20 mt-8 max-w-[26rem] xl:max-w-[30rem]">
            <motion.p
              variants={rise}
              className="text-2xl font-extrabold leading-[1.1] tracking-tight sm:text-3xl xl:text-4xl"
            >
              <span className="block">Your favorite</span>
              <span className="block">WhatsApp bot,</span>
              <span className="block text-ag-pink">powered by chaos.</span>
            </motion.p>

            <motion.p
              variants={rise}
              className="mt-5 max-w-[42ch] text-[15px] leading-relaxed text-ag-muted"
            >
              Bikin stiker, download video, perbesar foto jadi HD, cari gambar
              dan GIF, sampai ngobrol dengan bot tsundere. Semuanya langsung
              dari chat WhatsApp.
            </motion.p>

            <motion.div
              variants={rise}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Button href={site.waUrl} external size="lg">
                <MessageCircle className="size-4" aria-hidden />
                Add to WhatsApp
              </Button>
              <Button href="#features" variant="ghost" size="lg">
                Explore features
              </Button>
            </motion.div>
          </div>

          <motion.ul
            variants={rise}
            className="relative z-20 mt-10 flex flex-wrap gap-x-8 gap-y-2 border-t border-ag-line pt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ag-muted lg:mt-14 lg:max-w-[26rem] xl:max-w-[30rem]"
          >
            {meta.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Artwork: di bawah teks pada mobile, menyatu dengan latar pada desktop */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease, delay: 0.25 }}
          className="relative z-10 mx-auto mt-6 aspect-[4/5] w-full max-w-[480px] lg:absolute lg:bottom-0 lg:right-[-3%] lg:top-20 lg:mx-0 lg:mt-0 lg:aspect-auto lg:max-w-none lg:w-[58%] xl:w-[62%]"
        >
          <MascotArt
            src={art}
            alt="Special Week, karakter Uma Musume yang menjadi maskot Agemasen"
            priority
            className="mask-fade-b absolute inset-0"
          />
        </motion.div>

        {/* Dekorasi UI game */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-12 top-24 z-20 hidden text-right text-[10px] font-semibold uppercase leading-relaxed tracking-[0.22em] text-white/50 lg:block"
        >
          <p className="tabular-nums text-ag-pink">01 / 06</p>
          <p>Featured bot</p>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-16 right-3 z-20 hidden items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40 [writing-mode:vertical-rl] lg:flex"
        >
          <span>WA / BOT</span>
          <span className="h-10 w-px bg-white/25" />
          <span>アゲマセン</span>
        </div>
        <p
          aria-hidden
          className="pointer-events-none absolute bottom-16 right-16 z-20 hidden text-right text-[10px] font-semibold uppercase leading-relaxed tracking-[0.22em] text-white/40 xl:block"
        >
          Lat 35.68
          <br />
          Lon 139.76
        </p>
      </div>
    </section>
  );
}
