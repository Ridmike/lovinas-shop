import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Sign in to the Lovina's Shop admin dashboard",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(154,61,47,0.16),_transparent_28%),linear-gradient(180deg,#fbf5eb_0%,#fffaf4_100%)] px-4 py-12">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[2rem] bg-[#20303d] p-8 text-white shadow-2xl shadow-[#20303d]/20">
          <p className="text-xs uppercase tracking-[0.24em] text-white/60">Lovina's Shop</p>
          <h1 className="font-display mt-4 text-4xl font-semibold">Admin access</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/75">
            Manage products, categories, orders, and customer messages from a protected dashboard
            with Firebase Authentication and Firestore.
          </p>
          <div className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
            <div className="rounded-3xl bg-white/10 p-4">Owner role: full access</div>
            <div className="rounded-3xl bg-white/10 p-4">Staff role: orders only</div>
            <div className="rounded-3xl bg-white/10 p-4">Protected routes</div>
            <div className="rounded-3xl bg-white/10 p-4">Session cookies</div>
          </div>
          <Link href="/" className="mt-8 inline-flex text-sm font-semibold text-[#f0c18b]">
            Back to storefront
          </Link>
        </div>

        <div className="flex items-center">
          <div className="w-full">
            <Suspense fallback={<div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">Loading login form...</div>}>
              <AdminLoginForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}