"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { ArrowUpRight, IndianRupee, Package2, ShoppingCart, Sparkles } from "lucide-react";
import type { DashboardCardMetrics, TopSellingProduct, TrendPoint } from "@/types/admin";

const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false });
const LineChart = dynamic(() => import("recharts").then((mod) => mod.LineChart), { ssr: false });
const Line = dynamic(() => import("recharts").then((mod) => mod.Line), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then((mod) => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false });
const BarChart = dynamic(() => import("recharts").then((mod) => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import("recharts").then((mod) => mod.Bar), { ssr: false });

export function AdminDashboardClient({
  cards,
  ordersTrend,
  revenueTrend,
  topSellingProducts,
}: {
  cards: DashboardCardMetrics;
  ordersTrend: TrendPoint[];
  revenueTrend: TrendPoint[];
  topSellingProducts: TopSellingProduct[];
}) {
  const metrics = useMemo(
    () => [
      { label: "Total Orders", value: cards.totalOrders.toString(), change: "All time" },
      { label: "Pending Orders", value: cards.pendingOrders.toString(), change: "Needs action" },
      { label: "Revenue", value: `₹${cards.revenue.toLocaleString()}`, change: "COD only" },
      { label: "Products", value: cards.products.toString(), change: "Catalog items" },
    ],
    [cards],
  );

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => {
          const meta = [ShoppingCart, Sparkles, IndianRupee, Package2][index] ?? ShoppingCart;
          const Icon = meta;

          return (
            <div key={metric.label} className="rounded-[1.75rem] border border-black/5 bg-white p-5 shadow-sm">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-[#20303d] to-[#9a3d2f] text-white shadow-lg">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-sm font-medium text-slate-500">{metric.label}</p>
              <div className="mt-2 flex items-end justify-between gap-2">
                <p className="font-display text-3xl font-semibold text-[#20303d]">{metric.value}</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#fff7f3] px-2.5 py-1 text-xs font-semibold text-[#9a3d2f]">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  {metric.change}
                </span>
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[1.75rem] border border-black/5 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.24em] text-[#9a3d2f]">Orders Trend</p>
            <h2 className="font-display text-2xl font-semibold text-[#20303d]">Orders and revenue over time</h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ordersTrend.map((point, index) => ({ ...point, revenue: revenueTrend[index]?.value ?? 0 }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1e7da" />
                <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#9a3d2f" strokeWidth={3} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="revenue" stroke="#20303d" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-black/5 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.24em] text-[#9a3d2f]">Top Selling Products</p>
            <h2 className="font-display text-2xl font-semibold text-[#20303d]">Best movers</h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSellingProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1e7da" />
                <XAxis type="number" tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis dataKey="name" type="category" width={120} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="quantitySold" fill="#9a3d2f" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}