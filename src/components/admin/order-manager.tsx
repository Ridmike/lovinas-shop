"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import type { Order } from "@/types/order";
import { Pagination } from "@/components/ui/pagination";
import { usePagination } from "@/components/ui/use-pagination";

const statuses = ["pending", "processing", "dispatched", "delivered", "cancelled"] as const;
const PAGE_SIZE = 8;

export function OrderManager({ orders }: { orders: Order[] }) {
  const [items, setItems] = useState(orders);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("all");

  const filtered = useMemo(() => {
    return items.filter((order) => {
      const matchesQuery = !query || order.orderNumber.toLowerCase().includes(query.toLowerCase()) || order.customer.fullName.toLowerCase().includes(query.toLowerCase()) || order.customer.email.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === "all" || order.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [items, query, status]);

  const { page, setPage, totalPages, pageItems } = usePagination(filtered, PAGE_SIZE);

  async function update(id: string, nextStatus: Order["status"]) {
    const response = await fetch("/admin/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: nextStatus }),
    });
    if (!response.ok) {
      toast.error("Unable to update order");
      return;
    }
    setItems((current) => current.map((order) => (order.id === id ? { ...order, status: nextStatus } : order)));
    toast.success("Order status updated");
  }

  function exportCsv() {
    const rows = [
      ["Order Number", "Customer", "Email", "Total", "Status", "Created At"],
      ...filtered.map((order) => [order.orderNumber, order.customer.fullName, order.customer.email, String(order.total), order.status, order.createdAt]),
    ];
    const blob = new Blob([rows.map((row) => row.join(",")).join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-sm md:grid-cols-[1.2fr_0.8fr_auto]">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search orders" className="rounded-2xl border border-black/10 bg-[var(--surface)] px-4 py-3 transition focus:border-[var(--brand)]/40 focus:outline-none focus:ring-4 focus:ring-[var(--ring-soft)]" />
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="cursor-pointer rounded-2xl border border-black/10 bg-[var(--surface)] px-4 py-3 transition focus:border-[var(--brand)]/40 focus:outline-none focus:ring-4 focus:ring-[var(--ring-soft)]">
          <option value="all">All statuses</option>
          {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <button type="button" onClick={exportCsv} className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-strong)]">
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </section>

      <section className="space-y-3">
        {pageItems.map((order) => (
          <article key={order.id} className="rounded-[1.5rem] border border-black/5 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-semibold text-[#20303d]">{order.orderNumber}</p>
                <p className="text-sm text-slate-500">{order.customer.fullName} · {order.customer.email}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                    {order.paymentMethod === "BankTransfer" ? "Bank Transfer" : "Cash on Delivery"}
                  </span>
                  {order.paymentMethod === "BankTransfer" && order.paymentSlipUrl ? (
                    <a href={order.paymentSlipUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-[#9a3d2f] underline">
                      View slip
                    </a>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#fff7f3] px-3 py-1 text-xs font-semibold text-[#9a3d2f]">LKR {order.total.toLocaleString()}</span>
                <select value={order.status} onChange={(event) => update(order.id, event.target.value as Order["status"])} className="rounded-full border border-black/10 px-3 py-2 text-sm">
                  {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
            </div>
          </article>
        ))}
      </section>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}