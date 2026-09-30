"use client";

import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import type { Feature } from "@/lib/features";

export function FeatureCard({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}) {
  const { t } = useLanguage();
  const Icon = feature.icon;
  const text = t.features.items[feature.key];
  return (
    <a
      href="/home"
      aria-label={`${text.title}: ${t.features.cardLink}`}
      className="group relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-[4px] border border-ag-line bg-ag-ink-2/60 p-6 transition duration-300 hover:-translate-y-1 hover:border-ag-violet/70 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(140deg,rgb(139_92_246/0.22),rgb(192_38_211/0.07)_55%,transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="relative flex items-start justify-between">
        <span className="text-xs font-semibold tabular-nums tracking-[0.2em] text-ag-muted">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="flex size-11 items-center justify-center border border-ag-line text-ag-pink transition duration-300 group-hover:-rotate-6 group-hover:translate-x-1 group-hover:border-ag-violet/60 motion-reduce:transition-none motion-reduce:group-hover:transform-none">
          <Icon className="size-5" strokeWidth={1.75} aria-hidden />
        </span>
      </div>

      <div className="relative mt-10">
        <h3 className="font-display text-lg uppercase leading-tight tracking-[-0.01em]">
          {text.title}
        </h3>
        <p className="mt-3 max-w-[34ch] text-sm leading-relaxed text-ag-muted">
          {text.description}
        </p>
      </div>

      <div className="relative mt-auto flex items-end justify-between gap-4 pt-8">
        <ul className="flex flex-wrap gap-1.5" aria-label={t.features.commandList}>
          {feature.commands.map((cmd) => (
            <li
              key={cmd}
              className="border border-ag-line px-2 py-0.5 font-mono text-[11px] text-ag-fg/70"
            >
              {cmd}
            </li>
          ))}
        </ul>
        <span
          aria-hidden
          className="flex size-8 shrink-0 items-center justify-center rounded-full border border-ag-line transition duration-300 group-hover:border-ag-pink group-hover:bg-ag-pink group-hover:text-ag-ink"
        >
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </a>
  );
}
