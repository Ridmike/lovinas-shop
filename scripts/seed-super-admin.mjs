import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { resolveServiceAccount } from "./resolve-service-account.mjs";

const serviceAccount = resolveServiceAccount();
const app = initializeApp({ credential: cert(serviceAccount) });
const auth = getAuth(app);
const firestore = getFirestore(app);

const email = process.env.ADMIN_OWNER_EMAIL;
const password = process.env.ADMIN_OWNER_PASSWORD;
const displayName = process.env.ADMIN_OWNER_NAME || "Super Admin";

if (!email || !password) {
  throw new Error("ADMIN_OWNER_EMAIL and ADMIN_OWNER_PASSWORD are required.");
}

const existingUser = await auth.getUserByEmail(email).catch(() => null);
const user = existingUser
  ? await auth.updateUser(existingUser.uid, {
      password,
      displayName,
      disabled: false,
    })
  : await auth.createUser({
      email,
      password,
      displayName,
      disabled: false,
    });

await auth.setCustomUserClaims(user.uid, {
  admin: true,
  role: "owner",
});

await firestore.collection("adminUsers").doc(user.uid).set(
  {
    uid: user.uid,
    email,
    displayName,
    role: "owner",
    active: true,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  { merge: true },
);

console.log(`Seeded super admin: ${email} (${user.uid})`);