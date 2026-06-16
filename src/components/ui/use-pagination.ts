import { useEffect, useState } from "react";

/**
 * Client-side pagination over an in-memory array. Returns the current page's
 * slice plus the controls the shared <Pagination> component needs. Clamps the
 * page when the source list shrinks (delete, filter).
 */
export function usePagination<T>(items: T[], pageSize: number) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  return { page: safePage, setPage, totalPages, pageItems, startIndex: start };
}
