import type { Timestamp } from "firebase/firestore";

export interface FirestoreProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId: string;
  images: string[];
  featured: boolean;
  stockStatus: string;
  createdAt: Date | Timestamp;
}

export interface FirestoreCategory {
  id: string;
  name: string;
  slug: string;
  parentCategory: string | null;
}
