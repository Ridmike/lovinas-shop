"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Loader2, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { getFirebaseStorage } from "@/lib/firebase";
import type { Product, Category } from "@/types/catalog";
import type { AdminProductFormValues } from "@/types/admin";

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

export function ProductManager({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [items, setItems] = useState(products);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<AdminProductFormValues>(emptyForm);

  const categoryOptions = useMemo(() => categories, [categories]);

  function startEdit(product: Product) {
    setEditingId(product.id);
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
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function submit() {
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
    const storage = getFirebaseStorage();
    if (!storage) {
      toast.error("Firebase Storage is not configured");
      return;
    }

    setUploading(true);
    try {
      const imageRef = ref(storage, `admin/products/${Date.now()}-${file.name}`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      setForm((current) => ({ ...current, images: [...current.images, url] }));
      toast.success("Image uploaded");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#9a3d2f]">Product Management</p>
            <h2 className="font-display text-2xl font-semibold text-[#20303d]">Create, edit, upload, and publish</h2>
          </div>
          <button type="button" onClick={resetForm} className="rounded-full bg-[#fff7f3] px-4 py-2 text-sm font-semibold text-[#9a3d2f]">
            New product
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Product name" className="rounded-2xl border border-black/10 bg-[var(--surface)] px-4 py-3 transition focus:border-[var(--brand)]/40 focus:outline-none focus:ring-4 focus:ring-[var(--ring-soft)]" />
          <input value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} placeholder="product-slug" className="rounded-2xl border border-black/10 bg-[var(--surface)] px-4 py-3 transition focus:border-[var(--brand)]/40 focus:outline-none focus:ring-4 focus:ring-[var(--ring-soft)]" />
          <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="Product description" rows={4} className="md:col-span-2 rounded-2xl border border-black/10 bg-[var(--surface)] px-4 py-3 transition focus:border-[var(--brand)]/40 focus:outline-none focus:ring-4 focus:ring-[var(--ring-soft)]" />
          <input type="number" value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: Number(event.target.value) }))} placeholder="Price" className="rounded-2xl border border-black/10 bg-[var(--surface)] px-4 py-3 transition focus:border-[var(--brand)]/40 focus:outline-none focus:ring-4 focus:ring-[var(--ring-soft)]" />
          <select value={form.categoryId} onChange={(event) => setForm((current) => ({ ...current, categoryId: event.target.value }))} className="rounded-2xl border border-black/10 bg-[var(--surface)] px-4 py-3 transition focus:border-[var(--brand)]/40 focus:outline-none focus:ring-4 focus:ring-[var(--ring-soft)]">
            <option value="">Select category</option>
            {categoryOptions.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 rounded-2xl border border-black/10 bg-[var(--surface)] px-4 py-3 transition focus:border-[var(--brand)]/40 focus:outline-none focus:ring-4 focus:ring-[var(--ring-soft)]">
            <input type="checkbox" checked={form.featured} onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))} />
            Featured
          </label>
          <label className="flex items-center gap-2 rounded-2xl border border-black/10 bg-[var(--surface)] px-4 py-3 transition focus:border-[var(--brand)]/40 focus:outline-none focus:ring-4 focus:ring-[var(--ring-soft)]">
            <input type="checkbox" checked={form.inStock} onChange={(event) => setForm((current) => ({ ...current, inStock: event.target.checked }))} />
            In stock
          </label>
        </div>

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
          <button type="button" onClick={submit} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-strong disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {editingId ? "Update product" : "Create product"}
          </button>
        </div>

        {form.images.length ? (
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {form.images.map((image) => (
              <button key={image} type="button" onClick={() => setForm((current) => ({ ...current, images: current.images.filter((item) => item !== image) }))} className="relative aspect-square overflow-hidden rounded-2xl">
                <Image src={image} alt="Uploaded preview" fill className="object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </section>

      <section className="grid gap-4">
        {items.map((product) => (
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
                <p className="mt-2 text-sm font-semibold text-[#20303d]">₹{product.price.toLocaleString()}</p>
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
    </div>
  );
}