import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/catalog";
import { formatCurrency } from "@/lib/format";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group overflow-hidden rounded-[2rem] border border-black/5 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#9a3d2f]/10"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-[#f4ece0]">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        {product.featured ? (
          <span className="absolute left-4 top-4 rounded-full bg-[#20303d] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
            Featured
          </span>
        ) : null}
      </div>
      <div className="px-1 pb-2 pt-4">
        <h3 className="text-lg font-semibold text-[#20303d]">{product.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{product.description}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="font-display text-xl font-semibold text-[#20303d]">{formatCurrency(product.price)}</p>
          <span className="rounded-full bg-[#fff3ec] px-3 py-1 text-xs font-semibold text-[#9a3d2f]">
            {product.stockStatus}
          </span>
        </div>
      </div>
    </Link>
  );
}
