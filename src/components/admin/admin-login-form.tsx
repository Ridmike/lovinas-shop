"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { Loader2, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { getFirebaseAuth } from "@/lib/firebase";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const auth = getFirebaseAuth();
    if (!auth) {
      toast.error("Firebase Auth is not configured.");
      return;
    }

    setLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await credential.user.getIdToken();

      const response = await fetch("/admin/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message ?? "Unable to create session");
      }

      toast.success("Signed in successfully.");
      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign in";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          className="w-full rounded-2xl border border-black/10 bg-[#fffaf4] px-4 py-3 text-sm outline-none focus:border-[#9a3d2f]/40 focus:ring-4 focus:ring-[#9a3d2f]/10"
          placeholder="admin@example.com"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          className="w-full rounded-2xl border border-black/10 bg-[#fffaf4] px-4 py-3 text-sm outline-none focus:border-[#9a3d2f]/40 focus:ring-4 focus:ring-[#9a3d2f]/10"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-strong)] disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
        {loading ? "Signing in..." : "Access dashboard"}
      </button>
    </form>
  );
}