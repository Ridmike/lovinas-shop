import Link from "next/link";

export default function NotFound() {
  return (
    <div className="content-shell flex min-h-[60vh] items-center justify-center py-16 text-center">
      <div className="max-w-xl rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm">
        <p className="font-display text-4xl font-semibold text-[#20303d]">Page not found</p>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          The page you were looking for is not available. Use the shop to continue browsing.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex rounded-full bg-[#9a3d2f] px-6 py-3 text-sm font-semibold text-white"
        >
          Back to shop
        </Link>
      </div>
    </div>
  );
}
