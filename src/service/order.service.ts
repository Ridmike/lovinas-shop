import {
  collection,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getFirebaseFirestore } from "@/lib/firebase";
import type { Order, OrderItem, CheckoutFormData, PaymentStatus, OrderStatus } from "@/types/order";
import type { CartItem } from "@/store/cart-store";

const ORDERS_COLLECTION = "orders";
const TAX_RATE = 0.0; // No tax for now, can be configured

/**
 * Generate a unique order number
 * Format: OD-YYYYMMDD-XXXXX (e.g., OD-20260612-00001)
 */
export function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const random = String(Math.floor(Math.random() * 100000)).padStart(5, "0");
  return `OD-${year}${month}${day}-${random}`;
}

/**
 * Calculate order totals
 */
function calculateOrderTotals(items: CartItem[]): {
  subtotal: number;
  tax: number;
  total: number;
} {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;

  return { subtotal, tax, total };
}

/**
 * Create a new order in Firestore
 */
export async function createOrder(
  checkoutData: CheckoutFormData,
  cartItems: CartItem[],
): Promise<Order> {
  const firestore = getFirebaseFirestore();

  if (!firestore) {
    throw new Error("Firebase not configured");
  }

  if (cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  const orderNumber = generateOrderNumber();
  const now = new Date().toISOString();
  const { subtotal, tax, total } = calculateOrderTotals(cartItems);

  const orderItems: OrderItem[] = cartItems.map((item) => ({
    ...item,
    subtotal: item.price * item.quantity,
  }));

  const order: Order = {
    id: "", // Will be set by Firestore
    orderNumber,
    customer: {
      fullName: checkoutData.fullName,
      email: checkoutData.email,
      phone: checkoutData.phone,
      address: checkoutData.address,
      city: checkoutData.city,
      notes: checkoutData.notes,
    },
    items: orderItems,
    subtotal,
    tax,
    total,
    paymentMethod: "COD",
    paymentStatus: "unpaid",
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };

  try {
    const ordersRef = collection(firestore, ORDERS_COLLECTION);
    const docRef = doc(ordersRef);
    const orderWithId: Order = { ...order, id: docRef.id };

    await setDoc(docRef, orderWithId);

    return orderWithId;
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Failed to create order");
  }
}

/**
 * Retrieve an order by ID
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  const firestore = getFirebaseFirestore();

  if (!firestore) {
    throw new Error("Firebase not configured");
  }

  try {
    const orderRef = doc(firestore, ORDERS_COLLECTION, orderId);
    const orderSnap = await getDoc(orderRef);

    if (orderSnap.exists()) {
      return orderSnap.data() as Order;
    }

    return null;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw new Error("Failed to fetch order");
  }
}

/**
 * Retrieve orders by customer email
 */
export async function getOrdersByEmail(email: string): Promise<Order[]> {
  const firestore = getFirebaseFirestore();

  if (!firestore) {
    throw new Error("Firebase not configured");
  }

  try {
    const q = query(
      collection(firestore, ORDERS_COLLECTION),
      where("customer.email", "==", email),
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => doc.data() as Order);
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    throw new Error("Failed to fetch customer orders");
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<void> {
  const firestore = getFirebaseFirestore();

  if (!firestore) {
    throw new Error("Firebase not configured");
  }

  try {
    const orderRef = doc(firestore, ORDERS_COLLECTION, orderId);
    await setDoc(
      orderRef,
      {
        status,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error("Failed to update order status");
  }
}

/**
 * Update payment status
 */
export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: PaymentStatus,
): Promise<void> {
  const firestore = getFirebaseFirestore();

  if (!firestore) {
    throw new Error("Firebase not configured");
  }

  try {
    const orderRef = doc(firestore, ORDERS_COLLECTION, orderId);
    await setDoc(
      orderRef,
      {
        paymentStatus,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw new Error("Failed to update payment status");
  }
}
