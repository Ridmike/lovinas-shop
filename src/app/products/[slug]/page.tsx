import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton, ProductGallery } from "@/components/catalog-interactive";
import { ProductGrid } from "@/components/catalog-static";
import { SectionHeading } from "@/components/marketing-sections";
import { EmptyState } from "@/components/states";
import { categoryLookup, getProductsByCategoryId, getProductBySlug } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/format";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetailsPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const category = categoryLookup.get(product.categoryId) ?? null;
  const relatedProducts = getProductsByCategoryId(product.categoryId, product.slug).slice(0, 3);

  return (
    <div className="content-shell py-10 md:py-14">
      <div className="mb-8 flex flex-wrap gap-3 text-sm text-slate-500">
        <Link href="/" className="hover:text-[#9a3d2f]">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-[#9a3d2f]">
          Shop
        </Link>
        <span>/</span>
        <span className="text-slate-700">{product.name}</span>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
        <ProductGallery product={product} />

        <div className="space-y-6 rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm md:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a3d2f]">
              {category?.name ?? "Collection"}
            </p>
            <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-[#20303d]">
              {product.name}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="font-display text-3xl font-semibold text-[#20303d]">{formatCurrency(product.price)}</span>
            <span className="rounded-full bg-[#fff3ec] px-3 py-1 text-xs font-semibold text-[#9a3d2f]">
              {product.stockStatus}
            </span>
          </div>

          <p className="text-sm leading-8 text-slate-600 md:text-base">{product.description}</p>

          <div className="rounded-[1.5rem] bg-[#fff8f0] p-5 text-sm leading-7 text-slate-700">
            <p className="font-semibold text-[#20303d]">Product details</p>
            <ul className="mt-3 space-y-2">
              <li>Added to catalogue on {formatDate(product.createdAt)}</li>
              <li>Carefully styled for mobile-first gifting and easy sharing.</li>
              <li>Ready for collection, courier delivery, or custom order handling.</li>
            </ul>
          </div>

          <AddToCartButton product={product} />

          <div className="border-t border-black/5 pt-4 text-sm leading-7 text-slate-600">
            <p>
              Need a larger order or custom hamper?{' '}
              <Link href="/contact" className="font-semibold text-[#9a3d2f]">
                Talk to us
              </Link>{' '}
              and we&apos;ll help you build it.
            </p>
          </div>
        </div>
      </div>

      <section className="mt-14">
        <SectionHeading
          eyebrow="Related products"
          title="More from this collection"
          description="Similar items from the same category are shown below to keep browsing quick and useful on mobile."
        />
        <div className="mt-8">
          {relatedProducts.length ? (
            <ProductGrid products={relatedProducts} />
          ) : (
            <EmptyState
              title="No related items yet"
              description="This collection will show companion products here once more catalogue items are added."
            />
          )}
        </div>
      </section>
    </div>
  );
}
