"use client";

import { ErrorState } from "@/components/states";

export default function ProductError() {
  return (
    <div className="content-shell py-10 md:py-14">
      <ErrorState
        title="We could not load this product"
        description="Refresh the page or return to the shop to continue browsing the catalogue."
      />
    </div>
  );
}
