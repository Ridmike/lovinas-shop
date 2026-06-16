import { cn } from "./cn";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "destructive";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--ring-soft)]";

const variants: Record<Variant, string> = {
  primary: "bg-[var(--brand)] text-white hover:bg-[var(--brand-strong)]",
  secondary:
    "border border-[var(--brand)]/20 bg-white text-[var(--brand)] hover:border-[var(--brand)]/40 hover:bg-[var(--surface-accent)]",
  ghost: "text-[var(--ink)] hover:bg-[var(--surface-accent)]",
  destructive:
    "bg-[var(--destructive-bg)] text-[var(--destructive)] hover:bg-[var(--destructive)] hover:text-white",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

/** Shared class string for non-button elements (e.g. <Link>) that should look like a Button. */
export function buttonClass(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string,
) {
  return cn(base, variants[variant], sizes[size], className);
}
