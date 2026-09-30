import type { ReactNode } from "react";

type ActionButtonProps = {
  type?: "button" | "submit";
  variant?: "primary" | "ghost";
  size?: "sm" | "md" | "lg";
  block?: boolean;
  disabled?: boolean;
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
  ghost: "btn-ghost text-ag-fg",
} as const;

// Versi <button> dari ui/Button (yang berupa <a>): tampilan sama persis,
// dipakai untuk aksi di halaman, bukan navigasi (kirim form, keluar, dst).
export function ActionButton({
  type = "button",
  variant = "primary",
  size = "md",
  block,
  disabled,
  className = "",
  onClick,
  children,
}: ActionButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        "cut group relative inline-flex select-none items-center justify-center gap-2 font-bold uppercase tracking-[0.14em] transition-colors duration-200 disabled:cursor-wait disabled:opacity-60",
        sizes[size],
        variants[variant],
        block ? "w-full" : "",
        className,
      ].join(" ")}
    >
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </button>
  );
}
