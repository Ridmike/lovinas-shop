import type { Metadata } from "next";
import { CategoryManager } from "@/components/admin/category-manager";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminSession } from "@/lib/admin-auth";
import { listCategories } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Categories", description: "Manage product categories", robots: { index: false, follow: false } };

export default async function AdminCategoriesPage() {
  const session = await requireAdminSession();
  const categories = await listCategories();
  return (
    <AdminShell session={session}>
      <CategoryManager categories={categories} />
    </AdminShell>
  );
}