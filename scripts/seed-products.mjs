/**
 * Seed 10 demo products into the `products` Firestore collection.
 * Usage: node scripts/seed-products.mjs
 * Uses the same service account the app auto-discovers.
 */
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";

const SERVICE_ACCOUNT = "./lovinas-shop-firebase-adminsdk-fbsvc-ea22bd3c99.json";

const sa = JSON.parse(readFileSync(SERVICE_ACCOUNT, "utf8"));
if (!getApps().length) {
  initializeApp({ credential: cert(sa) });
}
const db = getFirestore();

// Unsplash host is whitelisted in next.config.ts.
const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

const PRODUCTS = [
  { name: "Lavender Soy Candle", description: "Hand-poured soy candle with calming lavender essential oil.", price: 1800, featured: true, images: [img("photo-1602874801006-e26c4c5b5b6a")] },
  { name: "Kraft Gift Hamper Box", description: "Sturdy kraft hamper box, perfect for custom gift sets.", price: 950, featured: false, images: [img("photo-1513885535751-8b9238bd345a")] },
  { name: "Resin Coaster Set", description: "Set of 4 ocean-themed resin coasters with gold flakes.", price: 2400, featured: true, images: [img("photo-1600623471616-8c1966c91ff6")] },
  { name: "Dried Flower Bouquet", description: "Long-lasting dried flower arrangement in muted tones.", price: 3200, featured: false, images: [img("photo-1487070183336-b863922373d4")] },
  { name: "Scented Wax Melts", description: "Vanilla and sandalwood wax melts for warmers.", price: 750, featured: false, images: [img("photo-1608181831718-c9ffd8728e5e")] },
  { name: "Personalised Mug", description: "Ceramic mug with custom name printing.", price: 1200, featured: true, images: [img("photo-1514228742587-6b1558fcca3d")] },
  { name: "Macrame Wall Hanging", description: "Handwoven cotton macrame for boho decor.", price: 2800, featured: false, images: [img("photo-1493663284031-b7e3aefcae8e")] },
  { name: "Mini Succulent Pot", description: "Faux succulent in a hand-painted concrete pot.", price: 1100, featured: false, images: [img("photo-1485955900006-10f4d324d411")] },
  { name: "Greeting Card Pack", description: "Pack of 6 illustrated greeting cards with envelopes.", price: 600, featured: false, images: [img("photo-1607344645866-009c320b63e0")] },
  { name: "Bath Bomb Trio", description: "Three fizzing bath bombs with relaxing scents.", price: 1500, featured: true, images: [img("photo-1608248543803-ba4f8c70ae0b")] },
];

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

async function main() {
  const categorySnap = await db.collection("categories").orderBy("sortOrder", "asc").get();
  const categoryIds = categorySnap.docs.map((d) => d.id);
  if (!categoryIds.length) {
    console.warn("No categories found — products will be seeded with empty categoryId.");
  }

  const now = new Date().toISOString();
  const batch = db.batch();

  PRODUCTS.forEach((product, index) => {
    const ref = db.collection("products").doc();
    batch.set(ref, {
      name: product.name,
      slug: slugify(product.name),
      description: product.description,
      price: product.price,
      categoryId: categoryIds.length ? categoryIds[index % categoryIds.length] : "",
      images: product.images,
      featured: product.featured,
      stockStatus: "In stock",
      createdAt: now,
      updatedAt: now,
    });
  });

  await batch.commit();
  console.log(`Seeded ${PRODUCTS.length} products into "products".`);
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
