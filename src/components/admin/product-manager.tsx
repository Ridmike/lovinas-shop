"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { Loader2, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import type { Product, Category } from "@/types/catalog";
import type { AdminProductFormValues } from "@/types/admin";
import { Pagination } from "@/components/ui/pagination";
import { usePagination } from "@/components/ui/use-pagination";

const PAGE_SIZE = 8;

const emptyForm: AdminProductFormValues = {
  name: "",
  slug: "",
  description: "",
  price: 0,
  categoryId: "",
  images: [],
  featured: false,
  inStock: true,
};

type FormErrors = Partial<Record<keyof AdminProductFormValues, string>>;

const fieldClass =
  "w-full rounded-2xl border bg-[var(--surface)] px-4 py-3 transition focus:outline-none focus:ring-4 focus:ring-[var(--ring-soft)]";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#20303d]/60";

function borderClass(hasError: boolean) {
  return hasError ? "border-destructive focus:border-destructive" : "border-black/10 focus:border-[var(--brand)]/40";
}

export function ProductManager({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [items, setItems] = useState(products);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<AdminProductFormValues>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const formRef = useRef<HTMLDivElement>(null);

  const categoryOptions = useMemo(() => categories, [categories]);
  const { page, setPage, totalPages, pageItems } = usePagination(items, PAGE_SIZE);

  function update<K extends keyof AdminProductFormValues>(key: K, value: AdminProductFormValues[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function validate(): boolean {
    const next: FormErrors = {};

    if (form.name.trim().length < 2) next.name = "Name must be at least 2 characters";
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug.trim())) next.slug = "Use lowercase letters, numbers and hyphens";
    if (form.description.trim().length < 5) next.description = "Description must be at least 5 characters";
    if (!(form.price > 0)) next.price = "Price must be greater than 0";
    if (!form.categoryId) next.categoryId = "Select a category";
    if (form.images.length === 0) next.images = "Upload at least one image";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setErrors({});
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId,
      images: product.images,
      featured: product.featured,
      inStock: product.stockStatus !== "Out of stock",
    });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function resetForm() {
    setEditingId(null);
    setErrors({});
    setForm(emptyForm);
  }

  async function submit() {
    if (!validate()) {
      toast.error("Please fix the highlighted fields");
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(editingId ? `/admin/api/products/${editingId}` : "/admin/api/products", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          stockStatus: form.inStock ? "In stock" : "Out of stock",
        }),
      });

      if (!response.ok) {
        throw new Error((await response.json()).message ?? "Unable to save product");
      }

      const payload = await response.json();
      const saved = payload.product as Product;
      setItems((current) => {
        const filtered = current.filter((item) => item.id !== saved.id);
        return [saved, ...filtered];
      });
      toast.success(editingId ? "Product updated" : "Product created");
      resetForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save product");
    } finally {
      setSaving(false);
    }
  }

  async function removeProduct(id: string) {
    if (!confirm("Delete this product?")) {
      return;
    }

    const response = await fetch(`/admin/api/products?id=${id}`, { method: "DELETE" });
    if (!response.ok) {
      toast.error("Unable to delete product");
      return;
    }

    setItems((current) => current.filter((item) => item.id !== id));
    toast.success("Product deleted");
  }

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);

      const response = await fetch("/api/upload", { method: "POST", body: data });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message ?? "Image upload failed");
      }

      update("images", [...form.images, payload.url]);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <section ref={formRef} className="scroll-mt-24 rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#9a3d2f]">Product Management</p>
            <h2 className="font-display text-2xl font-semibold text-[#20303d]">
              {editingId ? "Editing product" : "Create, edit, upload, and publish"}
            </h2>
          </div>
          <button type="button" onClick={resetForm} className="rounded-full bg-[#fff7f3] px-4 py-2 text-sm font-semibold text-[#9a3d2f]">
            New product
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="product-name">Product name</label>
            <input id="product-name" value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="e.g. Bubble Resin Keychain" className={`${fieldClass} ${borderClass(!!errors.name)}`} />
            {errors.name ? <p className="mt-1 text-xs text-destructive">{errors.name}</p> : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="product-slug">Slug</label>
            <input id="product-slug" value={form.slug} onChange={(event) => update("slug", event.target.value)} placeholder="bubble-resin-keychain" className={`${fieldClass} ${borderClass(!!errors.slug)}`} />
            {errors.slug ? <p className="mt-1 text-xs text-destructive">{errors.slug}</p> : null}
          </div>

          <div className="md:col-span-2">
            <label className={labelClass} htmlFor="product-description">Description</label>
            <textarea id="product-description" value={form.description} onChange={(event) => update("description", event.target.value)} placeholder="Describe the product, materials, size…" rows={4} className={`${fieldClass} ${borderClass(!!errors.description)}`} />
            {errors.description ? <p className="mt-1 text-xs text-destructive">{errors.description}</p> : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="product-price">Price (LKR)</label>
            <input id="product-price" type="number" min={0} value={form.price} onChange={(event) => update("price", Number(event.target.value))} placeholder="1600" className={`${fieldClass} ${borderClass(!!errors.price)}`} />
            {errors.price ? <p className="mt-1 text-xs text-destructive">{errors.price}</p> : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="product-category">Category</label>
            <select id="product-category" value={form.categoryId} onChange={(event) => update("categoryId", event.target.value)} className={`${fieldClass} ${borderClass(!!errors.categoryId)}`}>
              <option value="">Select category</option>
              {categoryOptions.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            {errors.categoryId ? <p className="mt-1 text-xs text-destructive">{errors.categoryId}</p> : null}
          </div>

          <label className="flex items-center gap-2 rounded-2xl border border-black/10 bg-[var(--surface)] px-4 py-3">
            <input type="checkbox" checked={form.featured} onChange={(event) => update("featured", event.target.checked)} />
            Featured
          </label>
          <label className="flex items-center gap-2 rounded-2xl border border-black/10 bg-[var(--surface)] px-4 py-3">
            <input type="checkbox" checked={form.inStock} onChange={(event) => update("inStock", event.target.checked)} />
            In stock
          </label>
        </div>

        <div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-brand/20 bg-white px-4 py-2 text-sm font-semibold text-brand transition hover:border-brand/40 hover:bg-surface-accent">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Upload image
              <input type="file" accept="image/*" className="hidden" onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void uploadImage(file);
                }
              }} />
            </label>
          </div>
          {errors.images ? <p className="mt-1 text-xs text-destructive">{errors.images}</p> : null}
        </div>

        {form.images.length ? (
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {form.images.map((image) => (
              <button key={image} type="button" onClick={() => update("images", form.images.filter((item) => item !== image))} className="relative aspect-square overflow-hidden rounded-2xl">
                <Image src={image} alt="Uploaded preview" fill className="object-cover" />
              </button>
            ))}
          </div>
        ) : null}

        <div className="mt-6 flex justify-end border-t border-black/5 pt-5">
          <button type="button" onClick={submit} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-strong disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {editingId ? "Update product" : "Create product"}
          </button>
        </div>
      </section>

      <section className="grid gap-4">
        {pageItems.map((product) => (
          <article key={product.id} className="rounded-[1.5rem] border border-black/5 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-[#fff7f3]">
                <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-xl font-semibold text-[#20303d]">{product.name}</h3>
                  {product.featured ? <span className="rounded-full bg-[#fff7f3] px-3 py-1 text-xs font-semibold text-[#9a3d2f]">Featured</span> : null}
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{product.stockStatus}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600 line-clamp-2">{product.description}</p>
                <p className="mt-2 text-sm font-semibold text-[#20303d]">LKR {product.price.toLocaleString()}</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button type="button" onClick={() => startEdit(product)} className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold">Edit</button>
                <button type="button" onClick={() => removeProduct(product.id)} className="inline-flex items-center gap-2 rounded-full bg-destructive-bg px-4 py-2 text-sm font-semibold text-destructive transition hover:bg-destructive hover:text-white">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
