import type { Metadata } from "next";
import { AdminDashboardClient } from "@/components/admin/admin-dashboard-client";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminSession } from "@/lib/admin-auth";
import { getDashboardMetrics } from "@/lib/admin-data";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Admin overview with orders, revenue, and top products",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const session = await requireAdminSession();
  const stats = await getDashboardMetrics();

  return (
    <AdminShell session={session}>
      <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.24em] text-[#9a3d2f]">Dashboard</p>
        <h2 className="font-display mt-3 text-3xl font-semibold text-[#20303d]">Operations at a glance</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          Monitor store performance, watch order movement, and review top sellers without leaving the admin area.
        </p>
      </section>

      <AdminDashboardClient
        cards={stats.cards}
        ordersTrend={stats.ordersTrend}
        revenueTrend={stats.revenueTrend}
        topSellingProducts={stats.topSellingProducts}
      />
      </div>
    </AdminShell>
  );
}