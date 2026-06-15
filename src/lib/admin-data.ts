import { categories as fallbackCategories, products as fallbackProducts } from "@/lib/data";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { getFirebaseAdminConfigMessage } from "@/lib/firebase-admin";
import type { AdminCategoryFormValues, AdminMessage, AdminProductFormValues, DashboardCardMetrics, TopSellingProduct, TrendPoint } from "@/types/admin";
import type { Category, Product } from "@/types/catalog";
import type { Order } from "@/types/order";

const PRODUCT_COLLECTION = "products";
const CATEGORY_COLLECTION = "categories";
const ORDER_COLLECTION = "orders";
const MESSAGE_COLLECTION = "messages";

function toIsoDate(value: unknown) {
  if (!value) {
    return new Date().toISOString();
  }

  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "object" && value && "toDate" in value && typeof (value as { toDate?: () => Date }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }

  return new Date().toISOString();
}

function serializeProduct(id: string, data: Partial<Product> & { createdAt?: unknown }): Product {
  return {
    id,
    name: data.name ?? "Untitled product",
    slug: data.slug ?? id,
    description: data.description ?? "",
    price: Number(data.price ?? 0),
    categoryId: data.categoryId ?? "",
    images: Array.isArray(data.images) ? data.images : [],
    featured: Boolean(data.featured),
    stockStatus: data.stockStatus ?? "In stock",
    createdAt: toIsoDate(data.createdAt),
  };
}

function serializeCategory(id: string, data: Partial<Category> & { sortOrder?: number }) {
  return {
    id,
    name: data.name ?? "Untitled category",
    slug: data.slug ?? id,
    parentCategory: data.parentCategory ?? null,
    sortOrder: Number(data.sortOrder ?? 0),
  };
}

function serializeOrder(id: string, data: Record<string, unknown>): Order {
  return {
    id,
    orderNumber: String(data.orderNumber ?? id),
    customer: (data.customer as Order["customer"]) ?? {
      fullName: "Unknown customer",
      email: "",
      phone: "",
      address: "",
      city: "",
    },
    items: (data.items as Order["items"]) ?? [],
    subtotal: Number(data.subtotal ?? 0),
    tax: Number(data.tax ?? 0),
    total: Number(data.total ?? 0),
    paymentMethod: (data.paymentMethod as Order["paymentMethod"]) ?? "COD",
    paymentStatus: (data.paymentStatus as Order["paymentStatus"]) ?? "unpaid",
    status: (data.status as Order["status"]) ?? "pending",
    createdAt: toIsoDate(data.createdAt),
    updatedAt: toIsoDate(data.updatedAt),
  };
}

function serializeMessage(id: string, data: Record<string, unknown>): AdminMessage {
  return {
    id,
    name: String(data.name ?? ""),
    email: String(data.email ?? ""),
    subject: String(data.subject ?? ""),
    message: String(data.message ?? ""),
    status: (data.readAt ? "read" : "unread") as AdminMessage["status"],
    createdAt: toIsoDate(data.createdAt),
    readAt: data.readAt ? toIsoDate(data.readAt) : null,
  };
}

function fallbackCategoryList() {
  return fallbackCategories.map((category, index) => ({ ...category, sortOrder: index + 1 }));
}

export async function listProducts() {
  const firestore = getAdminFirestore();
  if (!firestore) {
    return fallbackProducts;
  }

  const snapshot = await firestore.collection(PRODUCT_COLLECTION).orderBy("createdAt", "desc").get();
  return snapshot.docs.map((doc) => serializeProduct(doc.id, doc.data() as Partial<Product> & { createdAt?: unknown }));
}

export async function listCategories() {
  const firestore = getAdminFirestore();
  if (!firestore) {
    return fallbackCategoryList();
  }

  const snapshot = await firestore.collection(CATEGORY_COLLECTION).orderBy("sortOrder", "asc").get();
  return snapshot.docs.map((doc) => serializeCategory(doc.id, doc.data() as Partial<Category> & { sortOrder?: number }));
}

export async function listOrders() {
  const firestore = getAdminFirestore();
  if (!firestore) {
    return [];
  }

  const snapshot = await firestore.collection(ORDER_COLLECTION).orderBy("createdAt", "desc").get();
  return snapshot.docs.map((doc) => serializeOrder(doc.id, doc.data() as Record<string, unknown>));
}

export async function listMessages() {
  const firestore = getAdminFirestore();
  if (!firestore) {
    return [];
  }

  const snapshot = await firestore.collection(MESSAGE_COLLECTION).orderBy("createdAt", "desc").get();
  return snapshot.docs.map((doc) => serializeMessage(doc.id, doc.data() as Record<string, unknown>));
}

export async function getDashboardMetrics(): Promise<{ cards: DashboardCardMetrics; ordersTrend: TrendPoint[]; revenueTrend: TrendPoint[]; topSellingProducts: TopSellingProduct[] }> {
  const [products, categories, orders] = await Promise.all([listProducts(), listCategories(), listOrders()]);

  const cards: DashboardCardMetrics = {
    totalOrders: orders.length,
    pendingOrders: orders.filter((order) => order.status === "pending").length,
    revenue: orders.reduce((sum, order) => sum + order.total, 0),
    products: products.length || categories.length,
  };

  const byDay = new Map<string, { orders: number; revenue: number }>();
  const topProducts = new Map<string, TopSellingProduct>();

  for (const order of orders) {
    const day = order.createdAt.slice(0, 10);
    const current = byDay.get(day) ?? { orders: 0, revenue: 0 };
    byDay.set(day, { orders: current.orders + 1, revenue: current.revenue + order.total });

    for (const item of order.items) {
      const existing = topProducts.get(item.productId) ?? {
        productId: item.productId,
        name: item.name,
        quantitySold: 0,
        revenue: 0,
      };
      existing.quantitySold += item.quantity;
      existing.revenue += item.subtotal;
      topProducts.set(item.productId, existing);
    }
  }

  const ordersTrend = Array.from(byDay.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .slice(-7)
    .map(([label, value]) => ({ label, value: value.orders }));

  const revenueTrend = Array.from(byDay.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .slice(-7)
    .map(([label, value]) => ({ label, value: value.revenue }));

  return {
    cards,
    ordersTrend: ordersTrend.length ? ordersTrend : [{ label: "No data", value: 0 }],
    revenueTrend: revenueTrend.length ? revenueTrend : [{ label: "No data", value: 0 }],
    topSellingProducts: Array.from(topProducts.values()).sort((left, right) => right.quantitySold - left.quantitySold).slice(0, 5),
  };
}

export async function upsertProduct(id: string | null, values: AdminProductFormValues) {
  const firestore = getAdminFirestore();
  if (!firestore) {
    throw new Error(getFirebaseAdminConfigMessage());
  }

  const payload = {
    ...values,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  if (id) {
    await firestore.collection(PRODUCT_COLLECTION).doc(id).set(payload, { merge: true });
    return { id, ...payload };
  }

  const docRef = firestore.collection(PRODUCT_COLLECTION).doc();
  await docRef.set(payload);
  return { id: docRef.id, ...payload };
}

export async function deleteProduct(id: string) {
  const firestore = getAdminFirestore();
  if (!firestore) {
    throw new Error(getFirebaseAdminConfigMessage());
  }

  await firestore.collection(PRODUCT_COLLECTION).doc(id).delete();
}

export async function upsertCategory(id: string | null, values: AdminCategoryFormValues) {
  const firestore = getAdminFirestore();
  if (!firestore) {
    throw new Error(getFirebaseAdminConfigMessage());
  }

  const payload = {
    ...values,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  if (id) {
    await firestore.collection(CATEGORY_COLLECTION).doc(id).set(payload, { merge: true });
    return { id, ...payload };
  }

  const docRef = firestore.collection(CATEGORY_COLLECTION).doc();
  await docRef.set(payload);
  return { id: docRef.id, ...payload };
}

export async function deleteCategory(id: string) {
  const firestore = getAdminFirestore();
  if (!firestore) {
    throw new Error(getFirebaseAdminConfigMessage());
  }

  await firestore.collection(CATEGORY_COLLECTION).doc(id).delete();
}

export async function reorderCategories(ids: string[]) {
  const firestore = getAdminFirestore();
  if (!firestore) {
    throw new Error(getFirebaseAdminConfigMessage());
  }

  const batch = firestore.batch();
  ids.forEach((id, index) => {
    batch.set(firestore.collection(CATEGORY_COLLECTION).doc(id), { sortOrder: index + 1, updatedAt: new Date().toISOString() }, { merge: true });
  });
  await batch.commit();
}

export async function updateOrderStatus(id: string, status: Order["status"]) {
  const firestore = getAdminFirestore();
  if (!firestore) {
    throw new Error(getFirebaseAdminConfigMessage());
  }

  await firestore.collection(ORDER_COLLECTION).doc(id).set({ status, updatedAt: new Date().toISOString() }, { merge: true });
}

export async function markMessageRead(id: string) {
  const firestore = getAdminFirestore();
  if (!firestore) {
    throw new Error(getFirebaseAdminConfigMessage());
  }

  await firestore.collection(MESSAGE_COLLECTION).doc(id).set({ readAt: new Date().toISOString() }, { merge: true });
}

export async function deleteMessage(id: string) {
  const firestore = getAdminFirestore();
  if (!firestore) {
    throw new Error(getFirebaseAdminConfigMessage());
  }

  await firestore.collection(MESSAGE_COLLECTION).doc(id).delete();
}