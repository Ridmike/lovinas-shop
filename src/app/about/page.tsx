import type { Metadata } from "next";
import { SectionHeading } from "@/components/marketing-sections";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Lovina's Shop and the story behind the brand.",
};

export default function AboutPage() {
  return (
    <div className="content-shell py-10 md:py-14">
      <SectionHeading
        eyebrow="About"
        title="A Sri Lankan gifting brand with a practical, personal edge"
        description="Lovina's Shop is built around making small and large celebrations feel polished without making the buying experience complicated."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm md:p-8">
          <h2 className="font-display text-2xl font-semibold text-[#20303d]">What we do</h2>
          <p className="mt-4 text-sm leading-8 text-slate-600">
            We curate gift boxes, plush toys, resin supplies, fragrance products, and stationery so
            customers can buy for birthdays, holidays, business gifting, and last-minute surprises
            from one simple storefront.
          </p>
          <p className="mt-4 text-sm leading-8 text-slate-600">
            The storefront is designed mobile-first for Sri Lankan shoppers, with clear collections,
            quick product pages, and easy-to-read policies.
          </p>
        </div>
        <div className="rounded-[2rem] bg-[#20303d] p-6 text-white md:p-8">
          <h2 className="font-display text-2xl font-semibold">Why customers return</h2>
          <ul className="mt-5 space-y-4 text-sm leading-7 text-white/75">
            <li>Thoughtful product curation instead of overwhelming catalogues.</li>
            <li>Gift-ready presentation and clear, honest stock status.</li>
            <li>Responsive support for custom bundles and repeat orders.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
