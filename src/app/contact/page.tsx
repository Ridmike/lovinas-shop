import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { SectionHeading } from "@/components/marketing-sections";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Lovina's Shop for orders, custom hampers, and support.",
};

export default function ContactPage() {
  return (
    <div className="content-shell py-10 md:py-14">
      <SectionHeading
        eyebrow="Contact"
        title="Talk to us about custom orders and support"
        description="Use the form below to request a hamper, ask about stock, or get help with a recent order."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[2rem] bg-[#20303d] p-6 text-white md:p-8">
          <h2 className="font-display text-2xl font-semibold">Quick contact details</h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-white/75">
            <p>Email: hello@lovinasshop.com</p>
            <p>Business hours: Monday to Saturday</p>
            <p>Best for: custom gift boxes, wholesale packaging, and order support.</p>
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
