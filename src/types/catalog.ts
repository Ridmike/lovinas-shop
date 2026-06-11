export type StockStatus = "In stock" | "Low stock" | "Out of stock";

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentCategory: string | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId: string;
  images: string[];
  featured: boolean;
  stockStatus: StockStatus;
  createdAt: string;
}
