"use client";

import { useEffect, useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");
const fmt = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

// Jam live (waktu perangkat pengunjung). Diisi setelah mount supaya tidak beda
// dengan HTML server (hydration).
export function useClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(fmt(new Date()));
    tick();
    // Sejajarkan ke pergantian detik, lalu update tiap 1 detik.
    let iv: ReturnType<typeof setInterval> | undefined;
    const first = setTimeout(() => {
      tick();
      iv = setInterval(tick, 1000);
    }, 1000 - (Date.now() % 1000));
    return () => {
      clearTimeout(first);
      if (iv) clearInterval(iv);
    };
  }, []);

  return time ?? "--:--:--";
}

// Teks jam saja, tanpa pembungkus (dipakai di panel Aktivitas Server).
export function LiveTime({ className = "" }: { className?: string }) {
  const time = useClock();
  return (
    <time className={`font-mono font-bold tabular-nums ${className}`}>{time}</time>
  );
}

// Tab trapesium kaca tepat di bawah navbar.
// Sengaja fixed & di LUAR <header>: header punya backdrop-blur saat di-scroll, dan
// backdrop-filter yang bersarang di dalamnya tidak bisa mem-blur konten halaman.
export function NavClock() {
  const time = useClock();

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-1/2 top-16 z-50 flex h-[34px] w-[150px] -translate-x-1/2 items-start justify-center bg-ag-fg/[0.06] pt-1.5 backdrop-blur-md backdrop-saturate-150 [clip-path:polygon(0_0,100%_0,86%_100%,14%_100%)]"
    >
      <span className="rounded-full border border-ag-line bg-ag-fg/[0.06] px-3 py-0.5 font-mono text-[12px] font-bold leading-4 tracking-wider tabular-nums">
        {time}
      </span>
    </div>
  );
}
