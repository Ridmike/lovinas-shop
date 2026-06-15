import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_DURATION_MS } from "@/lib/admin-constants";
import { getAdminAuth, getAdminFirestore, getFirebaseAdminConfigMessage } from "@/lib/firebase-admin";
import type { AdminRole, AdminUser } from "@/types/admin";

const ADMIN_USERS_COLLECTION = "adminUsers";

export async function createAdminSession(idToken: string) {
  const auth = getAdminAuth();
  if (!auth) {
    throw new Error(getFirebaseAdminConfigMessage());
  }

  const cookieValue = await auth.createSessionCookie(idToken, {
    expiresIn: ADMIN_SESSION_DURATION_MS,
  });

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(ADMIN_SESSION_DURATION_MS / 1000),
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

async function resolveRole(uid: string, email: string): Promise<AdminRole> {
  const firestore = getAdminFirestore();

  if (!firestore) {
    return email === process.env.ADMIN_OWNER_EMAIL ? "owner" : "staff";
  }

  const snapshot = await firestore.collection(ADMIN_USERS_COLLECTION).doc(uid).get();
  if (snapshot.exists) {
    const data = snapshot.data() as { role?: AdminRole; active?: boolean };
    if (data.active === false) {
      throw new Error("Admin account is disabled");
    }

    return data.role ?? "staff";
  }

  if (email === process.env.ADMIN_OWNER_EMAIL) {
    await firestore.collection(ADMIN_USERS_COLLECTION).doc(uid).set({
      uid,
      email,
      role: "owner",
      active: true,
      createdAt: new Date().toISOString(),
    });
    return "owner";
  }

  return "staff";
}

export async function getAdminSession(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!sessionCookie) {
    return null;
  }

  const auth = getAdminAuth();
  if (!auth) {
    return null;
  }

  const decoded = await auth.verifySessionCookie(sessionCookie, true).catch(() => null);
  if (!decoded) {
    return null;
  }

  const email = decoded.email ?? "";
  const role = await resolveRole(decoded.uid, email);

  return {
    uid: decoded.uid,
    email,
    displayName: decoded.name ?? email,
    role,
    photoURL: decoded.picture ?? null,
  };
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

export function hasAdminAccess(session: AdminUser | null, role?: AdminRole) {
  if (!session) {
    return false;
  }

  if (!role) {
    return true;
  }

  if (session.role === "owner") {
    return true;
  }

  return session.role === role;
}