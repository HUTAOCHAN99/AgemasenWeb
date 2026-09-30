"use client";

import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import type { Feature } from "@/lib/features";

// Kartu fitur: klik membuka panel tutorial (lihat FeatureTutorial).
// Isinya hanya <span> karena <button> tidak boleh berisi elemen blok.
export function FeatureCard({
  feature,
  index,
  onOpen,
}: {
  feature: Feature;
  index: number;
  onOpen: () => void;
}) {
  const { t } = useLanguage();
  const Icon = feature.icon;
  const text = t.features.items[feature.key];
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label={`${text.title}: ${t.features.cardLink}`}
      className="group relative flex h-full min-h-[280px] w-full flex-col overflow-hidden rounded-[4px] border border-ag-line bg-ag-ink-2/60 p-6 text-left transition duration-300 hover:-translate-y-1 hover:border-ag-violet/70 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(140deg,rgb(139_92_246/0.22),rgb(192_38_211/0.07)_55%,transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <span className="relative flex w-full items-start justify-between">
        <span className="text-xs font-semibold tabular-nums tracking-[0.2em] text-ag-muted">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="flex size-11 items-center justify-center border border-ag-line text-ag-pink transition duration-300 group-hover:-rotate-6 group-hover:translate-x-1 group-hover:border-ag-violet/60 motion-reduce:transition-none motion-reduce:group-hover:transform-none">
          <Icon className="size-5" strokeWidth={1.75} aria-hidden />
        </span>
      </span>

      <span className="relative mt-10 block">
        <span className="block font-display text-lg uppercase leading-tight tracking-[-0.01em]">
          {text.title}
        </span>
        <span className="mt-3 block max-w-[34ch] text-sm leading-relaxed text-ag-muted">
          {text.description}
        </span>
      </span>

      <span className="relative mt-auto flex w-full items-end justify-between gap-4 pt-8">
        <span className="flex flex-wrap gap-1.5">
          <span className="sr-only">{t.features.commandList}: </span>
          {feature.commands.map((cmd) => (
            <span
              key={cmd}
              className="border border-ag-line px-2 py-0.5 font-mono text-[11px] text-ag-fg/70"
            >
              {cmd}
            </span>
          ))}
        </span>
        <span
          aria-hidden
          className="flex size-8 shrink-0 items-center justify-center rounded-full border border-ag-line transition duration-300 group-hover:border-ag-pink group-hover:bg-ag-pink group-hover:text-ag-ink"
        >
          <ArrowUpRight className="size-4" />
        </span>
      </span>
    </button>
  );
}
