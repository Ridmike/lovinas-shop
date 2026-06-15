import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/storefront-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://lovinasshop.com";
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/cart`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/checkout`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/shipping-policy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...products.map((product) => ({ url: `${baseUrl}/products/${product.slug}`, lastModified: new Date(product.createdAt), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...categories.map((category) => ({ url: `${baseUrl}/shop?category=${category.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 })),
  ];
}