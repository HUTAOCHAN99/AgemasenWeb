"use client";

import { MotionConfig } from "framer-motion";

// Hormati prefers-reduced-motion untuk semua animasi Framer Motion.
export function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
