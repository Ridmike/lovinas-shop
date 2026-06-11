import type { Metadata } from "next";
import { categories, featuredProducts } from "@/lib/data";
import { CategoriesSection, FeaturedProductsSection, HeroBanner, PromotionSection, SocialSection } from "@/components/marketing-sections";

export const metadata: Metadata = {
  title: "Home",
  description: "Lovina's Shop homepage for curated gifts, hampers, craft supplies, and packaging.",
};

export default function HomePage() {
  return (
    <div>
      <HeroBanner />
      <FeaturedProductsSection products={featuredProducts.slice(0, 6)} />
      <CategoriesSection categories={categories} />
      <PromotionSection />
      <SocialSection />
    </div>
  );
}
