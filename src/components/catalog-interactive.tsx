"use client";

import { useEffect, useState, startTransition } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Minus, Plus, Search, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Category, Product } from "@/types/catalog";
import { formatCurrency } from "@/lib/format";
import { useCartStore } from "@/store/cart-store";
import { trackFacebookEvent, trackTikTokEvent } from "@/lib/marketing";

export function SearchControls({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "all");

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
    setCategory(searchParams.get("category") ?? "all");
  }, [searchParams]);

  function updateParams(nextQuery: string, nextCategory: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextQuery.trim()) {
      params.set("q", nextQuery.trim());
    } else {
      params.delete("q");
    }

    if (nextCategory !== "all") {
      params.set("category", nextCategory);
    } else {
      params.delete("category");
    }

    params.delete("page");

    startTransition(() => {
      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
    });
  }

  return (
    <div className="grid gap-4 rounded-4xl border border-black/5 bg-white p-4 shadow-sm md:grid-cols-[1.2fr_0.8fr_auto]">
      <label className="flex items-center gap-3 rounded-2xl border border-black/10 bg-[#fffaf4] px-4 py-3">
        <Search className="h-4 w-4 text-slate-500" />
        <input
          value={query}
          onChange={(event) => {
            const value = event.target.value;
            setQuery(value);
            updateParams(value, category);
          }}
          placeholder="Search products, hampers, fragrance..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </label>

      <label className="rounded-2xl border border-black/10 bg-[#fffaf4] px-4 py-3">
        <select
          value={category}
          onChange={(event) => {
            const value = event.target.value;
            setCategory(value);
            updateParams(query, value);
          }}
          className="w-full bg-transparent text-sm outline-none"
        >
          <option value="all">All categories</option>
          {categories.map((item) => (
            <option key={item.id} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        onClick={() => {
          setQuery("");
          setCategory("all");
          router.push(pathname);
        }}
        className="rounded-2xl bg-[#20303d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#16242f]"
      >
        Reset filters
      </button>
    </div>
  );
}

export function Pagination({
  currentPage,
  totalPages,
  pathname,
  searchParams,
}: {
  currentPage: number;
  totalPages: number;
  pathname: string;
  searchParams: URLSearchParams;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const createHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    const queryString = params.toString();
    return queryString ? `${pathname}?${queryString}` : pathname;
  };

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-2">
      {pages.map((page) => (
        <a
          key={page}
          href={createHref(page)}
          className={`inline-flex h-10 min-w-10 items-center justify-center rounded-full px-4 text-sm font-semibold transition ${
            page === currentPage
              ? "bg-[#9a3d2f] text-white"
              : "bg-white text-slate-700 hover:bg-[#fff4ea]"
          }`}
        >
          {page}
        </a>
      ))}
    </nav>
  );
}

export function ProductGallery({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(product.images[0]);

  useEffect(() => {
    setActiveImage(product.images[0]);
  }, [product.images]);

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-4xl bg-white shadow-lg shadow-[#9a3d2f]/5">
        <Image src={activeImage} alt={product.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {product.images.map((image) => (
          <button
            key={image}
            type="button"
            onClick={() => setActiveImage(image)}
            className={`relative aspect-square overflow-hidden rounded-2xl border transition ${
              image === activeImage ? "border-[#9a3d2f] ring-2 ring-[#9a3d2f]/15" : "border-black/5"
            }`}
          >
            <Image src={image} alt={`${product.name} preview`} fill className="object-cover" sizes="160px" />
          </button>
        ))}
      </div>
    </div>
  );
}

export function QuantityStepper({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <div className="inline-flex items-center rounded-full border border-black/10 bg-white p-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-[#fff4ea]"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="min-w-12 px-2 text-center text-sm font-semibold text-[#20303d]">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-[#fff4ea]"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <QuantityStepper value={quantity} onChange={setQuantity} />
      <button
        type="button"
        onClick={() => {
          addItem(
            {
              productId: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              image: product.images[0],
            },
            quantity,
          );
          trackFacebookEvent("AddToCart", { content_name: product.name, content_ids: [product.id], value: product.price * quantity, currency: "INR" });
          trackTikTokEvent("AddToCart", { content_name: product.name, content_id: product.id, value: product.price * quantity, currency: "INR" });
          toast.success(`${product.name} added to your cart.`);
        }}
        className="inline-flex items-center gap-2 rounded-full bg-[#9a3d2f] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#9a3d2f]/20 transition hover:bg-[#7d2e23]"
      >
        <ShoppingCart className="h-4 w-4" />
        Add to cart
      </button>
    </div>
  );
}

export function CartSummary({ className }: { className?: string }) {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <aside className={className ?? ""}>
      <div className="rounded-4xl border border-black/5 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold text-[#20303d]">Cart summary</h2>
          <button type="button" onClick={clearCart} className="text-sm font-medium text-[#9a3d2f]">
            Clear cart
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {items.length ? (
            items.map((item) => (
              <div key={item.productId} className="flex gap-4 rounded-2xl border border-black/5 p-3">
                <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-[#fff5ee]">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#20303d]">{item.name}</p>
                  <p className="mt-1 text-sm text-slate-600">{formatCurrency(item.price)}</p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <QuantityStepper value={item.quantity} onChange={(value) => setQuantity(item.productId, value)} />
                    <button type="button" onClick={() => removeItem(item.productId)} className="text-slate-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm leading-6 text-slate-500">Your cart is empty. Add a product to see the summary here.</p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-black/5 pt-4">
          <span className="text-sm font-medium text-slate-600">Subtotal</span>
          <span className="font-display text-2xl font-semibold text-[#20303d]">{formatCurrency(subtotal)}</span>
        </div>
      </div>
    </aside>
  );
}
