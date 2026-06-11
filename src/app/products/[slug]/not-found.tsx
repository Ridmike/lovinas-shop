import Link from "next/link";

export default function NotFoundProduct() {
  return (
    <div className="content-shell py-16 text-center">
      <p className="font-display text-4xl font-semibold text-[#20303d]">Product not found</p>
      <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-600">
        This item may no longer be available. Explore the catalog to find another gift or craft item.
      </p>
      <Link href="/shop" className="mt-6 inline-flex rounded-full bg-[#9a3d2f] px-6 py-3 text-sm font-semibold text-white">
        Browse shop
      </Link>
    </div>
  );
}
