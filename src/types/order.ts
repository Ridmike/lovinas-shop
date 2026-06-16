import type { CartItem } from "@/store/cart-store";

export type PaymentMethod = "COD" | "BankTransfer";
export type PaymentStatus = "unpaid" | "paid" | "failed";
export type OrderStatus = "pending" | "processing" | "dispatched" | "delivered" | "cancelled";

export interface OrderItem extends CartItem {
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    notes?: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentSlipUrl?: string;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutFormData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes?: string;
}
