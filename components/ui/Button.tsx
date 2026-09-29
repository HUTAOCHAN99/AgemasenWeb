import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  variant?: "primary" | "ghost";
  size?: "sm" | "md" | "lg";
  external?: boolean;
  block?: boolean;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
};

const sizes = {
  sm: "h-9 px-4 text-[11px]",
  md: "min-h-12 px-6 text-xs",
  lg: "min-h-14 px-8 text-[13px]",
} as const;

const variants = {
  primary: "bg-[#7c3aed] text-white hover:bg-ag-magenta",
  ghost: "btn-ghost text-white",
} as const;

// Sengaja memakai <a> biasa (bukan next/link): /home dan /admin adalah
// halaman HTML statis di luar router Next, jadi butuh navigasi penuh.
export function Button({
  href,
  variant = "primary",
  size = "md",
  external,
  block,
  className = "",
  onClick,
  children,
}: ButtonProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={[
        "cut group relative inline-flex select-none items-center justify-center gap-2 font-bold uppercase tracking-[0.14em] transition-colors duration-200",
        sizes[size],
        variants[variant],
        block ? "w-full" : "",
        className,
      ].join(" ")}
    >
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </a>
  );
}
