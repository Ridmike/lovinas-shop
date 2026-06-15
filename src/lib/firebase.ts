import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "",
};

const isConfigured = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.storageBucket,
  firebaseConfig.messagingSenderId,
  firebaseConfig.appId,
].every(Boolean);

let firebaseApp: FirebaseApp | null = null;
let firebaseAnalytics: Analytics | null = null;

function resolveApp() {
  if (!isConfigured) {
    return null;
  }

  if (!firebaseApp) {
    firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
  }

  return firebaseApp;
}

export function getFirebaseApp(): FirebaseApp | null {
  return resolveApp();
}

export function getFirebaseAuth(): Auth | null {
  const app = resolveApp();
  return app ? getAuth(app) : null;
}

export function getFirebaseFirestore(): Firestore | null {
  const app = resolveApp();
  return app ? getFirestore(app) : null;
}

export function getFirebaseStorage(): FirebaseStorage | null {
  const app = resolveApp();
  return app ? getStorage(app) : null;
}

export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  const app = resolveApp();
  if (!app || typeof window === "undefined" || !firebaseConfig.measurementId) {
    return null;
  }

  if (!firebaseAnalytics) {
    const supported = await isSupported();
    if (!supported) {
      return null;
    }
    firebaseAnalytics = getAnalytics(app);
  }

  return firebaseAnalytics;
}

export const firebaseReady = isConfigured;
