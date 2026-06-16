import { cn } from "./cn";
import type { HTMLAttributes } from "react";

/** Standard storefront page wrapper: centered shell + consistent vertical rhythm. */
export function PageContainer({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("content-shell py-10 md:py-14", className)}
      {...props}
    />
  );
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-strong)] shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export function PageTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        "font-display text-3xl font-semibold text-[var(--ink)] md:text-4xl",
        className,
      )}
      {...props}
    />
  );
}

export function SectionHeading({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "font-display text-2xl font-semibold text-[var(--ink)]",
        className,
      )}
      {...props}
    />
  );
}
