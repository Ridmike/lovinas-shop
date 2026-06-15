import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Gift, Package, Sparkles, Star, Users } from "lucide-react";
import type { Category, Product } from "@/types/catalog";
import { formatCurrency } from "@/lib/format";

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9a3d2f]">{eyebrow}</p>
      <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-[#20303d] md:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">{description}</p>
    </div>
  );
}

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(154,61,47,0.16),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(197,139,69,0.18),transparent_32%)]" />
      <div className="content-shell relative grid gap-8 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:py-16">
        <div className="glass-panel rounded-[2.5rem] p-8 md:p-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#9a3d2f] shadow-sm">
            <Sparkles className="h-4 w-4" />
            Thoughtful gifting for every occasion
          </span>
          <h1 className="font-display mt-6 max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-[#20303d] md:text-6xl">
            Beautiful hampers, playful gifts, and craft essentials for Sri Lanka.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 md:text-lg">
            Lovina&apos;s Shop brings together premium gift boxes, plush toys, resin supplies,
            fragrance products, and packaging built for modern mobile shopping.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#9a3d2f] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#9a3d2f]/20 transition hover:bg-[#7d2e23]"
            >
              Shop now
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-6 py-3.5 text-sm font-semibold text-[#20303d] transition hover:border-[#9a3d2f]/20 hover:bg-[#fff9f6]"
            >
              Learn our story
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Gift, label: "Gift-ready packaging", value: "24-hour prep" },
              { icon: Package, label: "Wide catalog mix", value: "5 collections" },
              { icon: Users, label: "Personal support", value: "WhatsApp ready" },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-black/5 bg-white/90 p-4">
                <item.icon className="h-5 w-5 text-[#9a3d2f]" />
                <p className="mt-3 text-sm font-medium text-slate-500">{item.label}</p>
                <p className="mt-1 text-lg font-semibold text-[#20303d]">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-[#20303d] p-6 text-white shadow-2xl shadow-[#20303d]/20">
            <p className="text-xs uppercase tracking-[0.24em] text-white/60">Featured collection</p>
            <h2 className="font-display mt-3 text-3xl font-semibold">Hand-picked hampers</h2>
            <p className="mt-3 max-w-sm text-sm leading-7 text-white/75">
              Designed for birthdays, thank-yous, and seasonal gifting with polished presentation.
            </p>
            <div className="mt-8 rounded-4xl bg-white/10 p-4">
              <p className="text-sm text-white/70">Average order value</p>
              <p className="mt-1 text-3xl font-semibold">{formatCurrency(6400)}</p>
            </div>
          </div>
            <div className="overflow-hidden rounded-[2.5rem] border border-black/5 bg-white p-4 shadow-lg shadow-[#9a3d2f]/5">
              <div className="relative aspect-4/5 overflow-hidden rounded-4xl">
              <Image
                src="https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=1200&q=80"
                alt="Gift boxes arranged on a styled table"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturedProductsSection({ products }: { products: Product[] }) {
  return (
    <section className="content-shell py-10 md:py-14">
      <SectionHeading
        eyebrow="Featured products"
        title="Best-selling picks customers return for"
        description="A curated mix of premium hampers, plush gifts, craft essentials, and lifestyle products selected for quick browsing and confident gifting."
      />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export function CategoriesSection({ categories }: { categories: Category[] }) {
  return (
    <section className="content-shell py-10 md:py-14">
      <SectionHeading
        eyebrow="Categories"
        title="Everything organized for faster mobile shopping"
        description="Explore the five core collections that shape Lovina's Shop catalogue and help buyers jump straight to the right gift."
      />
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/shop?category=${category.slug}`}
            className="group rounded-4xl border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#9a3d2f]/8"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a3d2f]">Collection</p>
            <h3 className="mt-4 font-display text-xl font-semibold text-[#20303d]">
              {category.name}
            </h3>
            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-slate-500 transition group-hover:text-[#20303d]">
              Browse category
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function PromotionSection() {
  return (
    <section className="content-shell py-10 md:py-14">
      <div className="grid gap-5 rounded-[2.5rem] bg-[#9a3d2f] p-8 text-white lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-white/65">Promotion</p>
          <h2 className="font-display mt-3 text-3xl font-semibold md:text-4xl">
            Seasonal gifting with custom notes and fast local delivery.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/78 md:text-base">
            Bundle a hamper, add a plush toy, or finish with stationery and fragrance to create a
            polished gift experience without leaving your phone.
          </p>
        </div>
        <div className="rounded-4xl bg-white/12 p-6">
          <p className="text-sm text-white/70">Designed for</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {["Birthdays", "Anniversaries", "Teacher gifts", "Corporate hampers"].map((label) => (
              <span key={label} className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SocialSection() {
  return (
    <section className="content-shell py-10 md:py-14">
      <SectionHeading
        eyebrow="Social media"
        title="Built to look good on Instagram, WhatsApp, and Facebook"
        description="The brand experience stays visual, friendly, and easy to share across the channels your customers already use."
      />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          { label: "Instagram ready", value: "Story-friendly gift reveals and reels" },
          { label: "WhatsApp orders", value: "Fast replies and shareable product links" },
          { label: "Facebook shop", value: "Collections that map cleanly to catalog ads" },
        ].map((item) => (
          <div key={item.label} className="rounded-4xl border border-black/5 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9a3d2f]">{item.label}</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">{item.value}</p>
            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#20303d]">
              <Star className="h-4 w-4 text-[#c58b45]" />
              Shareable by design
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group overflow-hidden rounded-4xl border border-black/5 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#9a3d2f]/10"
    >
      <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-[#f4ece0]">
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
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a3d2f]">
          {product.categoryName ?? "Collection"}
        </p>
        <h3 className="mt-2 text-lg font-semibold text-[#20303d]">{product.name}</h3>
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
