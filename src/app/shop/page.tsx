import type { Metadata } from "next";
import Link from "next/link";
import { getCategories, filterProducts } from "@/lib/storefront-data";
import { SearchControls } from "@/components/catalog-interactive";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/states";
import { SectionHeading } from "@/components/marketing-sections";
import { ProductGrid } from "@/components/catalog-static";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse Lovina's Shop product catalogue with search, categories, and pagination.",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function firstString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolvedSearchParams = await searchParams;
  const categories = await getCategories();
  const query = firstString(resolvedSearchParams.q) ?? "";
  const category = firstString(resolvedSearchParams.category) ?? "";
  const page = Number(firstString(resolvedSearchParams.page) ?? "1");
  const result = await filterProducts({ query, category, page, pageSize: 6 });

  return (
    <div className="content-shell py-10 md:py-14">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="Shop"
          title="Browse the Lovina's Shop catalogue"
          description="Search by name, filter by category, and jump through pages without losing your place."
        />
        <p className="text-sm text-slate-500">
          Showing {result.products.length} of {result.total} products
        </p>
      </div>

      <div className="mt-8">
        <SearchControls categories={categories} />
      </div>

      <div className="mt-8">
        {result.products.length ? (
          <ProductGrid products={result.products} />
        ) : (
          <EmptyState
            title="No products matched your filters"
            description="Try a different search term or clear the category filter to see the full collection."
          />
        )}
      </div>

      <div className="mt-10">
        <Pagination
          currentPage={result.currentPage}
          totalPages={result.totalPages}
          basePath="/shop"
          query={{
            ...(query ? { q: query } : {}),
            ...(category ? { category } : {}),
          }}
        />
      </div>

      <section className="mt-14 grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="rounded-4xl bg-[#20303d] p-6 text-white">
          <p className="text-xs uppercase tracking-[0.24em] text-white/55">Need help choosing?</p>
          <h2 className="font-display mt-3 text-3xl font-semibold">Products selected for easy gifting</h2>
          <p className="mt-3 text-sm leading-7 text-white/75">
            The catalogue is split into clear collections so customers can get to a fit quickly on
            mobile and move straight to checkout or WhatsApp ordering.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {categories.slice(0, 6).map((categoryItem) => {
            const count = result.products.filter((product) => product.categoryId === categoryItem.id).length;
            return (
              <Link
                key={categoryItem.id}
                href={`/shop?category=${categoryItem.slug}`}
                className="rounded-4xl border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#9a3d2f]/10"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a3d2f]">Collection</p>
                <h3 className="mt-3 font-display text-xl font-semibold text-[#20303d]">{categoryItem.name}</h3>
                <p className="mt-3 text-sm text-slate-500">{count} products shown on this page</p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
