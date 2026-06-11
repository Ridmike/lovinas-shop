import type { Metadata } from "next";
import { SectionHeading } from "@/components/marketing-sections";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Lovina's Shop.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="content-shell py-10 md:py-14">
      <SectionHeading
        eyebrow="Policy"
        title="Privacy policy"
        description="This page outlines how Lovina's Shop handles customer information, order details, and support requests."
      />
      <div className="mt-8 rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm md:p-8">
        <div className="space-y-5 text-sm leading-8 text-slate-600">
          <p>
            We collect only the information needed to process inquiries, customer orders, and
            support requests. This can include your name, email address, phone number, delivery
            details, and order preferences.
          </p>
          <p>
            When Firebase, analytics, or contact tools are enabled, they are used to support
            storefront operations and improve the customer experience.
          </p>
          <p>
            We do not sell personal information. Data is retained only as long as required for
            order support, legal compliance, and business operations.
          </p>
        </div>
      </div>
    </div>
  );
}
