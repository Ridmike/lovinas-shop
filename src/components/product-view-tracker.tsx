"use client";

import { useEffect } from "react";
import { trackFacebookEvent, trackTikTokEvent } from "@/lib/marketing";

export function ProductViewTracker({ productId, name, price }: { productId: string; name: string; price: number }) {
  useEffect(() => {
    trackFacebookEvent("ViewContent", { content_name: name, content_ids: [productId], value: price, currency: "LKR" });
    trackTikTokEvent("ViewContent", { content_name: name, content_id: productId, value: price, currency: "LKR" });
  }, [name, price, productId]);

  return null;
}