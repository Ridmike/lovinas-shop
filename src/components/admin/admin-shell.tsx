"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { BarChart3, Boxes, LayoutDashboard, LogOut, Mail, Shapes, ShoppingCart } from "lucide-react";
import type { AdminUser } from "@/types/admin";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Boxes },
  { href: "/admin/categories", label: "Categories", icon: Shapes },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/messages", label: "Messages", icon: Mail },
];

export function AdminShell({ session, children }: { session: AdminUser; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/admin/api/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(154,61,47,0.12),_transparent_35%),linear-gradient(180deg,#faf4ea_0%,#fffaf4_100%)] text-slate-900">
      <header className="border-b border-black/5 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#9a3d2f]">Lovina&apos;s Shop Admin</p>
            <div className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-[#20303d]" />
              <h1 className="font-display text-xl font-semibold text-[#20303d]">{session.role} access</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-full bg-[#fff7f3] px-3 py-1 text-sm font-semibold text-[#9a3d2f] sm:block">
              {session.email}
            </div>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white lg:hidden"
            >
              <span className="sr-only">Toggle navigation</span>
              ☰
            </button>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--brand)]/20 bg-white px-4 py-2 text-sm font-semibold text-[var(--brand)] transition hover:border-[var(--brand)]/40 hover:bg-[var(--surface-accent)]"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
        <aside className={`${open ? "block" : "hidden"} lg:block`}>
          <nav className="sticky top-6 rounded-[1.75rem] border border-black/5 bg-white/80 p-3 shadow-sm backdrop-blur-xl">
            {navItems.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    active ? "bg-[var(--brand)] text-white" : "text-slate-700 hover:bg-[var(--surface-accent)] hover:text-[var(--brand)]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}