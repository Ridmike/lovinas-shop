import type { Metadata } from "next";
import { getCategories, getFeaturedProducts } from "@/lib/storefront-data";
import { CategoriesSection, FeaturedProductsSection, HeroBanner, PromotionSection, SocialSection } from "@/components/marketing-sections";

export const metadata: Metadata = {
  title: "Home",
  description: "Lovina's Shop homepage for curated gifts, hampers, craft supplies, and packaging.",
};

export default async function HomePage() {
  const [categories, featuredProducts] = await Promise.all([getCategories(), getFeaturedProducts(6)]);

  return (
    <div>
      <HeroBanner />
      <FeaturedProductsSection products={featuredProducts} />
      <CategoriesSection categories={categories} />
      <PromotionSection />
      <SocialSection />
    </div>
  );
}
