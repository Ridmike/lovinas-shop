import type { Metadata } from "next";
import { OrderManager } from "@/components/admin/order-manager";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminSession } from "@/lib/admin-auth";
import { listOrders } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Orders", description: "Manage customer orders", robots: { index: false, follow: false } };

export default async function AdminOrdersPage() {
  const session = await requireAdminSession();
  const orders = await listOrders();
  return (
    <AdminShell session={session}>
      <OrderManager orders={orders} />
    </AdminShell>
  );
}