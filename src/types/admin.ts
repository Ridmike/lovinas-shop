export type AdminRole = "owner" | "staff";
export type OrderManagementStatus = "pending" | "processing" | "dispatched" | "delivered" | "cancelled";
export type CustomerMessageStatus = "unread" | "read";

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: AdminRole;
  photoURL?: string | null;
}

export interface DashboardCardMetrics {
  totalOrders: number;
  pendingOrders: number;
  revenue: number;
  products: number;
}

export interface TrendPoint {
  label: string;
  value: number;
}

export interface TopSellingProduct {
  productId: string;
  name: string;
  quantitySold: number;
  revenue: number;
}

export interface AdminProductFormValues {
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId: string;
  images: string[];
  featured: boolean;
  inStock: boolean;
}

export interface AdminCategoryFormValues {
  name: string;
  slug: string;
  parentCategory: string | null;
  sortOrder: number;
}

export interface AdminMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: CustomerMessageStatus;
  createdAt: string;
  readAt?: string | null;
}
