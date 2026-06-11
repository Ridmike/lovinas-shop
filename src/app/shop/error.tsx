"use client";

import { ErrorState } from "@/components/states";

export default function ShopError() {
  return (
    <div className="content-shell py-10 md:py-14">
      <ErrorState
        title="We could not load the shop"
        description="Refresh the page or try again in a moment. The catalogue data may be temporarily unavailable."
      />
    </div>
  );
}
