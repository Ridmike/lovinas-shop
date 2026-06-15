"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function MarketingPixels() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "PageView");
    }
    if (typeof window !== "undefined" && window.ttq) {
      window.ttq.page();
    }
  }, [pathname]);

  return null;
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: { page: () => void; track: (event: string, data?: Record<string, unknown>) => void };
  }
}