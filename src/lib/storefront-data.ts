import "server-only";

import { cache } from "react";
import { listCategories, listProducts } from "@/lib/admin-data";
import type { Category, Product } from "@/types/catalog";

type CatalogProduct = Product & { categoryName?: string };

type CatalogState = {
  categories: Category[];
  products: CatalogProduct[];
  categoryById: Map<string, Category>;
  categoryBySlug: Map<string, Category>;
};

function toCatalogState(categories: Category[], products: Product[]): CatalogState {
  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));

  return {
    categories,
    products: products.map((product) => ({
      ...product,
      categoryName: categoryById.get(product.categoryId)?.name,
    })),
    categoryById,
    categoryBySlug,
  };
}

const loadCatalog = cache(async () => {
  const [categories, products] = await Promise.all([listCategories(), listProducts()]);
  return toCatalogState(categories, products);
});

export async function getCategories() {
  return (await loadCatalog()).categories;
}

export async function getProducts() {
  return (await loadCatalog()).products;
}

export async function getFeaturedProducts(limit = 6) {
  const { products } = await loadCatalog();
  return products.filter((product) => product.featured).slice(0, limit);
}

export async function getCategoryBySlug(slug: string) {
  return (await loadCatalog()).categoryBySlug.get(slug) ?? null;
}

export async function getCategoryById(categoryId: string) {
  return (await loadCatalog()).categoryById.get(categoryId) ?? null;
}

export async function getProductBySlug(slug: string) {
  return (await loadCatalog()).products.find((product) => product.slug === slug) ?? null;
}

export async function getProductsByCategoryId(categoryId: string, excludeSlug?: string) {
  return (await loadCatalog()).products.filter(
    (product) => product.categoryId === categoryId && product.slug !== excludeSlug,
  );
}

function normalize(value: string) {
  return value.toLowerCase().trim();
}

export async function filterProducts({
  query,
  category,
  page = 1,
  pageSize = 6,
}: {
  query?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}) {
  const { categories, products, categoryBySlug } = await loadCatalog();
  const normalizedQuery = normalize(query ?? "");
  const categoryRecord = category ? categoryBySlug.get(category) ?? null : null;

  const filtered = products
    .filter((product) => (categoryRecord ? product.categoryId === categoryRecord.id : true))
    .filter((product) => {
      if (!normalizedQuery) {
        return true;
      }

      const haystack = normalize(
        `${product.name} ${product.description} ${product.categoryName ?? categories.find((item) => item.id === product.categoryId)?.name ?? ""}`,
      );
      return haystack.includes(normalizedQuery);
    })
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * pageSize;

  return {
    products: filtered.slice(start, start + pageSize),
    total,
    totalPages,
    currentPage,
    category: categoryRecord,
  };
}
