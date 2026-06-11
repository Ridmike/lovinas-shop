import type { Category, Product } from "@/types/catalog";

export const categories: Category[] = [
  { id: "cat-hampers", name: "Gift Boxes & Hampers", slug: "gift-boxes-hampers", parentCategory: null },
  { id: "cat-plush", name: "Plush Toys & Novelties", slug: "plush-toys-novelties", parentCategory: null },
  { id: "cat-craft", name: "Craft & Resin Supplies", slug: "craft-resin-supplies", parentCategory: null },
  { id: "cat-fragrance", name: "Fragrance Products", slug: "fragrance-products", parentCategory: null },
  { id: "cat-stationery", name: "Stationery & Packaging", slug: "stationery-packaging", parentCategory: null },
];

export const products: Product[] = [
  {
    id: "prd-moonlight-hamper",
    name: "Moonlight Celebration Hamper",
    slug: "moonlight-celebration-hamper",
    description: "A premium gift hamper with tea, chocolates, candles, and a handwritten note card for birthdays and milestones.",
    price: 8500,
    categoryId: "cat-hampers",
    images: [
      "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1528140752006-95f36f4b6b30?auto=format&fit=crop&w=1200&q=80",
    ],
    featured: true,
    stockStatus: "In stock",
    createdAt: "2026-05-18T09:30:00.000Z",
  },
  {
    id: "prd-cuddle-bear",
    name: "Cuddle Bear Plush",
    slug: "cuddle-bear-plush",
    description: "Soft premium plush toy with stitched details, ideal for gifting and keepsake shelves.",
    price: 4200,
    categoryId: "cat-plush",
    images: [
      "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1513599893563-64f7f5f9c7c8?auto=format&fit=crop&w=1200&q=80",
    ],
    featured: true,
    stockStatus: "Low stock",
    createdAt: "2026-05-20T11:00:00.000Z",
  },
  {
    id: "prd-resin-kit",
    name: "Resin Starter Kit",
    slug: "resin-starter-kit",
    description: "Everything needed to begin resin crafting: measuring cups, pigments, molds, and mixing tools.",
    price: 9800,
    categoryId: "cat-craft",
    images: [
      "https://images.unsplash.com/photo-1612198191649-6e5c0bb95f36?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1587411765333-89b1bb6b41d6?auto=format&fit=crop&w=1200&q=80",
    ],
    featured: true,
    stockStatus: "In stock",
    createdAt: "2026-05-25T15:40:00.000Z",
  },
  {
    id: "prd-amber-dream",
    name: "Amber Dream Perfume Oil",
    slug: "amber-dream-perfume-oil",
    description: "A warm, long-lasting fragrance oil with amber, vanilla, and jasmine notes.",
    price: 3600,
    categoryId: "cat-fragrance",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=80",
    ],
    featured: false,
    stockStatus: "In stock",
    createdAt: "2026-05-28T08:10:00.000Z",
  },
  {
    id: "prd-bloom-pack",
    name: "Bloom Stationery Pack",
    slug: "bloom-stationery-pack",
    description: "A curated packaging set with kraft boxes, ribbons, cards, and labels for gifting businesses.",
    price: 2900,
    categoryId: "cat-stationery",
    images: [
      "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
    ],
    featured: true,
    stockStatus: "In stock",
    createdAt: "2026-05-30T12:20:00.000Z",
  },
  {
    id: "prd-little-joy-box",
    name: "Little Joy Gift Box",
    slug: "little-joy-gift-box",
    description: "An affordable gift box for thank-you moments, teacher gifts, and small celebrations.",
    price: 2400,
    categoryId: "cat-hampers",
    images: [
      "https://images.unsplash.com/photo-1607344645866-009c320c5ab7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
    ],
    featured: false,
    stockStatus: "In stock",
    createdAt: "2026-06-01T10:00:00.000Z",
  },
  {
    id: "prd-soft-sky",
    name: "Soft Sky Rabbit Plush",
    slug: "soft-sky-rabbit-plush",
    description: "A charming rabbit plush with a velvety finish and pastel accessories.",
    price: 3900,
    categoryId: "cat-plush",
    images: [
      "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1504465033501-8e4f5e2b6f4c?auto=format&fit=crop&w=1200&q=80",
    ],
    featured: false,
    stockStatus: "Low stock",
    createdAt: "2026-06-02T14:15:00.000Z",
  },
  {
    id: "prd-crystal-pour",
    name: "Crystal Pouring Molds",
    slug: "crystal-pouring-molds",
    description: "Reusable silicone molds for coasters, trays, keychains, and resin decor pieces.",
    price: 5200,
    categoryId: "cat-craft",
    images: [
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617997467631-5f6d7c4a1f5e?auto=format&fit=crop&w=1200&q=80",
    ],
    featured: false,
    stockStatus: "In stock",
    createdAt: "2026-06-04T09:45:00.000Z",
  },
  {
    id: "prd-garden-mist",
    name: "Garden Mist Reed Diffuser",
    slug: "garden-mist-reed-diffuser",
    description: "A fresh room fragrance for calm homes, boutiques, and gifting hampers.",
    price: 4700,
    categoryId: "cat-fragrance",
    images: [
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80",
    ],
    featured: false,
    stockStatus: "In stock",
    createdAt: "2026-06-05T16:10:00.000Z",
  },
];

export const categoryLookup = new Map(categories.map((category) => [category.id, category]));

export const featuredProducts = products.filter((product) => product.featured);

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug) ?? null;
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug) ?? null;
}

export function getProductsByCategoryId(categoryId: string, excludeSlug?: string) {
  return products.filter(
    (product) => product.categoryId === categoryId && product.slug !== excludeSlug,
  );
}

function normalize(value: string) {
  return value.toLowerCase().trim();
}

export function filterProducts({
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
  const normalizedQuery = normalize(query ?? "");
  const categoryRecord = category ? getCategoryBySlug(category) : null;
  const filtered = products
    .filter((product) => (categoryRecord ? product.categoryId === categoryRecord.id : true))
    .filter((product) => {
      if (!normalizedQuery) {
        return true;
      }

      const haystack = normalize(
        `${product.name} ${product.description} ${categoryLookup.get(product.categoryId)?.name ?? ""}`,
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
