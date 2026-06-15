"use client";

import { useEffect } from "react";
import { trackFacebookEvent, trackTikTokEvent } from "@/lib/marketing";

export function PurchaseTracker({ orderNumber, total }: { orderNumber: string; total: number }) {
  useEffect(() => {
    trackFacebookEvent("Purchase", { order_id: orderNumber, value: total, currency: "INR" });
    trackTikTokEvent("CompletePayment", { order_id: orderNumber, value: total, currency: "INR" });
  }, [orderNumber, total]);

  return null;
}