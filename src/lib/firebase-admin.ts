import { existsSync, readdirSync, readFileSync } from "fs";
import { resolve } from "path";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

type ServiceAccountCredentials = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

function normalizeServiceAccount(raw: Record<string, string>): ServiceAccountCredentials | null {
  const projectId = raw.projectId ?? raw.project_id ?? "";
  const clientEmail = raw.clientEmail ?? raw.client_email ?? "";
  const privateKey = (raw.privateKey ?? raw.private_key ?? "").replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return { projectId, clientEmail, privateKey };
}

function readServiceAccountFile(filePath: string): ServiceAccountCredentials | null {
  if (!existsSync(filePath)) {
    return null;
  }

  try {
    const parsed = JSON.parse(readFileSync(filePath, "utf8")) as Record<string, string>;
    return normalizeServiceAccount(parsed);
  } catch {
    return null;
  }
}

function loadServiceAccountFromFile(): ServiceAccountCredentials | null {
  const configuredPath = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_PATH;
  const candidates = configuredPath
    ? [configuredPath]
    : ["firebase-service-account.json", "serviceAccountKey.json"];

  for (const candidate of candidates) {
    const credentials = readServiceAccountFile(resolve(process.cwd(), candidate));
    if (credentials) {
      return credentials;
    }
  }

  try {
    const adminKeyFile = readdirSync(process.cwd()).find(
      (file) => file.endsWith(".json") && file.includes("-firebase-adminsdk-"),
    );

    if (adminKeyFile) {
      return readServiceAccountFile(resolve(process.cwd(), adminKeyFile));
    }
  } catch {
    // ignore filesystem errors
  }

  return null;
}

function resolveServiceAccount(): ServiceAccountCredentials | null {
  const encoded = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT;

  if (encoded) {
    try {
      const parsed = JSON.parse(encoded) as Record<string, string>;
      return normalizeServiceAccount(parsed);
    } catch {
      return null;
    }
  }

  const fromFile = loadServiceAccountFromFile();
  if (fromFile) {
    return fromFile;
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "";
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL ?? "";
  const privateKey = (process.env.FIREBASE_ADMIN_PRIVATE_KEY ?? "").replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return { projectId, clientEmail, privateKey };
}

const serviceAccount = resolveServiceAccount();

let app: App | null = null;

export const firebaseAdminReady = Boolean(serviceAccount);

export function getFirebaseAdminConfigMessage() {
  return "Firebase Admin is not configured. Download a service account JSON from Firebase Console (Project settings → Service accounts → Generate new private key), save it as firebase-service-account.json in the project root, or set FIREBASE_ADMIN_SERVICE_ACCOUNT / FIREBASE_ADMIN_* env vars in .env.local.";
}

function resolveApp() {
  if (!serviceAccount) {
    return null;
  }

  if (!app) {
    app = getApps().length ? getApps()[0] : initializeApp({ credential: cert(serviceAccount) });
  }

  return app;
}

export function getAdminAuth(): Auth | null {
  const resolved = resolveApp();
  return resolved ? getAuth(resolved) : null;
}

export function getAdminFirestore(): Firestore | null {
  const resolved = resolveApp();
  return resolved ? getFirestore(resolved) : null;
}
