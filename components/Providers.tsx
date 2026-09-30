"use client";

import { MotionConfig } from "framer-motion";
import { LanguageProvider } from "@/components/LanguageProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

// Hormati prefers-reduced-motion untuk semua animasi Framer Motion,
// dan sediakan bahasa (ID / EN) serta tema (dark / light) ke seluruh halaman.
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </LanguageProvider>
    </ThemeProvider>
  );
}
