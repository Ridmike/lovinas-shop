"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type BaseProps = {
  currentPage: number;
  totalPages: number;
  /** Link mode: base pathname (e.g. "/shop"). Other query params to preserve. */
  basePath?: string;
  query?: Record<string, string>;
  /** Callback mode: handle page change in client state. */
  onPageChange?: (page: number) => void;
  className?: string;
};

/**
 * Shared pagination. Pass `onPageChange` for client-state lists (admin),
 * or `basePath`/`query` for URL-driven navigation (shop). Falls back to a
 * disabled button when neither is provided.
 */
export function Pagination({ currentPage, totalPages, basePath, query, onPageChange, className }: BaseProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = buildPageList(currentPage, totalPages);

  const hrefFor = (page: number) => {
    const params = new URLSearchParams(query ?? {});
    params.set("page", String(page));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : (basePath ?? "");
  };

  const baseClass =
    "inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition";
  const activeClass = "bg-[#9a3d2f] text-white";
  const idleClass = "bg-white text-slate-700 hover:bg-[#fff4ea]";
  const disabledClass = "cursor-not-allowed bg-white text-slate-300";

  function renderCell(page: number, label: React.ReactNode, key: string, disabled = false) {
    const isActive = page === currentPage;
    const cls = `${baseClass} ${disabled ? disabledClass : isActive ? activeClass : idleClass}`;
    const aria = typeof label === "number" ? `Go to page ${label}` : undefined;

    if (disabled) {
      return <span key={key} className={cls} aria-disabled="true">{label}</span>;
    }

    if (onPageChange) {
      return (
        <button key={key} type="button" onClick={() => onPageChange(page)} aria-label={aria} aria-current={isActive ? "page" : undefined} className={cls}>
          {label}
        </button>
      );
    }

    return (
      <Link key={key} href={hrefFor(page)} aria-label={aria} aria-current={isActive ? "page" : undefined} className={cls}>
        {label}
      </Link>
    );
  }

  return (
    <nav aria-label="Pagination" className={`flex flex-wrap items-center justify-center gap-2 ${className ?? ""}`}>
      {renderCell(currentPage - 1, <ChevronLeft className="h-4 w-4" />, "prev", currentPage <= 1)}
      {pages.map((page, index) =>
        page === "…" ? (
          <span key={`gap-${index}`} className="px-1 text-sm text-slate-400">…</span>
        ) : (
          renderCell(page, page, `page-${page}`)
        ),
      )}
      {renderCell(currentPage + 1, <ChevronRight className="h-4 w-4" />, "next", currentPage >= totalPages)}
    </nav>
  );
}

/** First, last, current ±1, with "…" gaps. */
function buildPageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const result: (number | "…")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) result.push("…");
    result.push(p);
    prev = p;
  }
  return result;
}
