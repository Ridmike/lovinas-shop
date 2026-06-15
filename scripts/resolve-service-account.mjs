import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

function normalizeServiceAccount(raw) {
  const projectId = raw.projectId ?? raw.project_id ?? "";
  const clientEmail = raw.clientEmail ?? raw.client_email ?? "";
  const privateKey = (raw.privateKey ?? raw.private_key ?? "").replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return { projectId, clientEmail, privateKey };
}

function loadServiceAccountFromFile() {
  const configuredPath = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_PATH;
  const candidates = configuredPath
    ? [configuredPath]
    : ["firebase-service-account.json", "serviceAccountKey.json"];

  for (const candidate of candidates) {
    const fullPath = resolve(process.cwd(), candidate);
    if (!existsSync(fullPath)) {
      continue;
    }

    try {
      const parsed = JSON.parse(readFileSync(fullPath, "utf8"));
      return normalizeServiceAccount(parsed);
    } catch {
      continue;
    }
  }

  return null;
}

export function resolveServiceAccount() {
  const encoded = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT;

  if (encoded) {
    return normalizeServiceAccount(JSON.parse(encoded));
  }

  const fromFile = loadServiceAccountFromFile();
  if (fromFile) {
    return fromFile;
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin credentials. Save firebase-service-account.json in the project root or set FIREBASE_ADMIN_SERVICE_ACCOUNT / FIREBASE_ADMIN_* env vars.",
    );
  }

  return { projectId, clientEmail, privateKey };
}
