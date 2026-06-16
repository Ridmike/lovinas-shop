"use client";

import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Category } from "@/types/catalog";
import type { AdminCategoryFormValues } from "@/types/admin";
import { Pagination } from "@/components/ui/pagination";
import { usePagination } from "@/components/ui/use-pagination";

const emptyCategory: AdminCategoryFormValues = { name: "", slug: "", parentCategory: null, sortOrder: 1 };
const PAGE_SIZE = 8;

export function CategoryManager({ categories }: { categories: (Category & { sortOrder?: number })[] }) {
  const [items, setItems] = useState(categories);
  const [form, setForm] = useState<AdminCategoryFormValues>(emptyCategory);
  const [saving, setSaving] = useState(false);
  const { page, setPage, totalPages, pageItems, startIndex } = usePagination(items, PAGE_SIZE);

  async function save() {
    setSaving(true);
    try {
      const response = await fetch("/admin/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message ?? "Unable to save category");
      setItems((current) => [payload.category, ...current.filter((item) => item.id !== payload.category.id)]);
      setForm(emptyCategory);
      toast.success("Category saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save category");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    const response = await fetch(`/admin/api/categories?id=${id}`, { method: "DELETE" });
    if (!response.ok) {
      toast.error("Unable to delete category");
      return;
    }
    setItems((current) => current.filter((item) => item.id !== id));
    toast.success("Category deleted");
  }

  async function reorder(nextItems: typeof items) {
    setItems(nextItems);
    await fetch("/admin/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: nextItems.map((item) => item.id) }),
    });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-4">
          <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Category name" className="rounded-2xl border border-black/10 bg-surface px-4 py-3 transition focus:border-brand/40 focus:outline-none focus:ring-4 focus:ring-(--ring-soft)" />
          <input value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} placeholder="category-slug" className="rounded-2xl border border-black/10 bg-surface px-4 py-3 transition focus:border-brand/40 focus:outline-none focus:ring-4 focus:ring-(--ring-soft)" />
          <input type="number" value={form.sortOrder} onChange={(event) => setForm((current) => ({ ...current, sortOrder: Number(event.target.value) }))} className="rounded-2xl border border-black/10 bg-surface px-4 py-3 transition focus:border-brand/40 focus:outline-none focus:ring-4 focus:ring-(--ring-soft)" />
          <button type="button" onClick={save} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-strong disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add category
          </button>
        </div>
      </section>

      <section className="space-y-3">
        {pageItems.map((category, localIndex) => {
          const index = startIndex + localIndex;
          return (
          <article key={category.id} className="flex items-center justify-between rounded-[1.5rem] border border-black/5 bg-white p-4 shadow-sm">
            <div>
              <p className="font-semibold text-[#20303d]">{category.name}</p>
              <p className="text-sm text-slate-500">{category.slug}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" disabled={index === 0} onClick={() => {
                const next = [...items];
                [next[index - 1], next[index]] = [next[index], next[index - 1]];
                void reorder(next);
              }} className="rounded-full border border-black/10 px-3 py-2 text-sm">Up</button>
              <button type="button" disabled={index === items.length - 1} onClick={() => {
                const next = [...items];
                [next[index + 1], next[index]] = [next[index], next[index + 1]];
                void reorder(next);
              }} className="rounded-full border border-black/10 px-3 py-2 text-sm">Down</button>
              <button type="button" onClick={() => remove(category.id)} className="inline-flex items-center gap-2 rounded-full bg-destructive-bg px-3 py-2 text-sm font-semibold text-destructive transition hover:bg-destructive hover:text-white">
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </article>
          );
        })}
      </section>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}