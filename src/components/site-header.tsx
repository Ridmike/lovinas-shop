"use client";

import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCartStore } from "@/store/cart-store";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/shipping-policy", label: "Shipping" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const itemCount = useCartStore((state) => state.items.reduce((count, item) => count + item.quantity, 0));

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[rgba(245,239,228,0.82)] backdrop-blur-xl">
      <div className="content-shell flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#9a3d2f] text-sm font-semibold text-white shadow-lg shadow-[#9a3d2f]/20">
            LS
          </span>
          <span>
            <span className="font-display block text-xl font-semibold tracking-tight text-[#20303d]">
              Lovina&apos;s Shop
            </span>
            <span className="block text-xs uppercase tracking-[0.24em] text-[#9a3d2f]">
              Gifts and craft
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  active
                    ? "bg-[#20303d] text-white"
                    : "text-slate-700 hover:bg-white hover:text-[#20303d]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/shop"
            className="hidden rounded-full border border-[#9a3d2f]/20 bg-white px-4 py-2 text-sm font-medium text-[#9a3d2f] transition hover:border-[#9a3d2f]/30 hover:bg-[#fff7f3] sm:inline-flex"
          >
            Browse shop
          </Link>
          <Link
            href="/shop"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#20303d] text-white shadow-lg shadow-[#20303d]/15"
            aria-label="View shop"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#c58b45] px-1 text-[11px] font-semibold text-white">
                {itemCount}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-slate-800 lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-black/5 bg-white/95 lg:hidden">
          <div className="content-shell flex flex-col gap-2 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-[#fff7f3]"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
