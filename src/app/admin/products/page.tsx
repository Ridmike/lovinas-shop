import type { Metadata } from "next";
import { ProductManager } from "@/components/admin/product-manager";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminSession } from "@/lib/admin-auth";
import { listCategories, listProducts } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Products", description: "Manage Lovina's Shop products", robots: { index: false, follow: false } };

export default async function AdminProductsPage() {
  const session = await requireAdminSession();
  const [products, categories] = await Promise.all([listProducts(), listCategories()]);
  return (
    <AdminShell session={session}>
      <ProductManager products={products} categories={categories} />
    </AdminShell>
  );
}