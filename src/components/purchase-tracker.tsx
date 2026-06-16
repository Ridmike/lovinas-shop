"use client";

import { useEffect } from "react";
import { trackFacebookEvent, trackTikTokEvent } from "@/lib/marketing";

export function PurchaseTracker({ orderNumber, total }: { orderNumber: string; total: number }) {
  useEffect(() => {
    trackFacebookEvent("Purchase", { order_id: orderNumber, value: total, currency: "LKR" });
    trackTikTokEvent("CompletePayment", { order_id: orderNumber, value: total, currency: "LKR" });
  }, [orderNumber, total]);

  return null;
}