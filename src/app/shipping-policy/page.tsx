import type { Metadata } from "next";
import { SectionHeading } from "@/components/marketing-sections";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Shipping policy for Lovina's Shop.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="content-shell py-10 md:py-14">
      <SectionHeading
        eyebrow="Policy"
        title="Shipping policy"
        description="Clear delivery guidance for local orders, custom hampers, and gift packaging."
      />
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {[
          {
            title: "Processing time",
            text: "Most ready-made items are packed within 1 to 2 business days. Custom hampers may take longer depending on contents.",
          },
          {
            title: "Delivery",
            text: "Delivery timelines depend on location and courier availability. Customers receive updates once orders are dispatched.",
          },
          {
            title: "Custom orders",
            text: "Bespoke gift boxes and special packaging requests should be discussed ahead of time so stock and assembly can be planned.",
          },
        ].map((item) => (
          <div key={item.title} className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
            <h2 className="font-display text-2xl font-semibold text-[#20303d]">{item.title}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
