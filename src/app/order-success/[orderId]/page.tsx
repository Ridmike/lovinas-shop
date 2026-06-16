import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, MapPin, Mail, Phone } from "lucide-react";
import { getOrderById } from "@/service/order.service";
import { PurchaseTracker } from "@/components/purchase-tracker";
import { Card, buttonClass } from "@/components/ui";

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export const metadata = {
  title: "Order Confirmed | Lovina's Shop",
  description: "Your order has been successfully placed",
};

export default async function OrderSuccessPage({ params }: PageProps) {
  const { orderId } = await params;

  let order;
  try {
    order = await getOrderById(orderId);
  } catch (error) {
    console.error("Error fetching order:", error);
  }

  if (!order) {
    notFound();
  }

  const createdDate = new Date(order.createdAt);

  return (
    <div className="content-shell max-w-2xl py-10 md:py-14">
      <PurchaseTracker orderNumber={order.orderNumber} total={order.total} />
      {/* Success Header */}
      <div className="mb-12 text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-[var(--brand)]/15" />
            <CheckCircle className="relative z-10 h-20 w-20 text-[var(--brand)]" />
          </div>
        </div>
        <h1 className="mb-2 font-display text-3xl font-semibold text-[var(--ink)] md:text-4xl">
          Order Confirmed!
        </h1>
        <p className="text-lg text-[var(--ink)]/70">
          Thank you for your purchase at Lovina&apos;s Shop
        </p>
      </div>

      {/* Order Number Card */}
      <div className="mb-8 rounded-[var(--radius-card)] bg-[var(--ink)] p-8 text-center text-white shadow-sm">
        <p className="mb-2 text-sm font-semibold opacity-90">ORDER NUMBER</p>
        <p className="font-display text-4xl font-semibold tracking-wider">{order.orderNumber}</p>
        <p className="mt-4 text-sm opacity-75">
          Confirmation email sent to <strong>{order.customer.email}</strong>
        </p>
      </div>

      {/* Order Details Sections */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Order Summary */}
        <Card className="p-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-[var(--ink)]">
            <Package className="h-5 w-5 text-[var(--brand)]" />
            Order Details
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[var(--ink)]/60">Items</span>
              <span className="font-semibold">{order.items.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--ink)]/60">Subtotal</span>
              <span className="font-semibold">₹{order.subtotal.toLocaleString()}</span>
            </div>
            {order.tax > 0 && (
              <div className="flex justify-between">
                <span className="text-[var(--ink)]/60">Tax</span>
                <span className="font-semibold">₹{order.tax.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-[var(--border-soft)] pt-3">
              <span className="font-bold text-[var(--ink)]">Total</span>
              <span className="text-lg font-bold text-[var(--brand)]">₹{order.total.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        {/* Shipping Address */}
        <Card className="p-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-[var(--ink)]">
            <MapPin className="h-5 w-5 text-[var(--brand)]" />
            Shipping Address
          </h2>
          <div className="space-y-2 text-[var(--ink)]/80">
            <p className="font-semibold">{order.customer.fullName}</p>
            <p>{order.customer.address}</p>
            <p>{order.customer.city}</p>
            <div className="mt-3 space-y-2 border-t border-[var(--border-soft)] pt-3">
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[var(--ink)]/50" />
                {order.customer.phone}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[var(--ink)]/50" />
                {order.customer.email}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Items List */}
      <Card className="mb-8 p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-[var(--ink)]">Items Ordered</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between border-b border-[var(--border-soft)] pb-4 last:border-b-0"
            >
              <div>
                <p className="font-semibold text-[var(--ink)]">{item.name}</p>
                <p className="text-sm text-[var(--ink)]/60">
                  ₹{item.price.toLocaleString()} × {item.quantity}
                </p>
              </div>
              <p className="font-semibold text-[var(--ink)]">
                ₹{item.subtotal.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Payment & Status Info */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Payment Info */}
        <div className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-accent)] p-6">
          <h3 className="mb-3 font-semibold text-[var(--ink)]">💳 Payment Information</h3>
          <div className="space-y-2 text-sm text-[var(--ink)]/80">
            <p>
              <strong>Method:</strong> {order.paymentMethod === "COD" ? "Cash on Delivery" : order.paymentMethod}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="inline-block rounded-full bg-[var(--accent)]/15 px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                {order.paymentStatus === "unpaid" ? "Pending" : order.paymentStatus}
              </span>
            </p>
            <p className="mt-2 text-xs text-[var(--ink)]/60">
              Payment will be collected at delivery
            </p>
          </div>
        </div>

        {/* Order Status */}
        <div className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-accent)] p-6">
          <h3 className="mb-3 font-semibold text-[var(--ink)]">📦 Order Status</h3>
          <div className="space-y-2 text-sm text-[var(--ink)]/80">
            <p>
              <strong>Current Status:</strong>{" "}
              <span className="inline-block rounded-full bg-[var(--brand)]/10 px-3 py-1 text-xs font-semibold text-[var(--brand)]">
                {order.status === "pending" ? "Processing" : order.status}
              </span>
            </p>
            <p className="mt-2 text-xs text-[var(--ink)]/60">
              Order placed on {createdDate.toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Special Instructions */}
      {order.customer.notes && (
        <div className="mb-8 rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface)] p-6">
          <h3 className="mb-2 font-semibold text-[var(--ink)]">📝 Special Instructions</h3>
          <p className="text-[var(--ink)]/80">{order.customer.notes}</p>
        </div>
      )}

      {/* Next Steps */}
      <div className="mb-8 rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-accent)] p-6">
        <h3 className="mb-3 font-semibold text-[var(--ink)]">✨ What Happens Next?</h3>
        <ul className="space-y-2 text-sm text-[var(--ink)]/80">
          <li>✓ We&apos;re preparing your order for shipment</li>
          <li>✓ You&apos;ll receive a shipping confirmation email</li>
          <li>✓ Our delivery partner will contact you to schedule delivery</li>
          <li>✓ Payment is collected at the time of delivery</li>
        </ul>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link href="/shop" className={buttonClass("primary", "md", "flex-1")}>
          Continue Shopping
        </Link>
        <Link href="/" className={buttonClass("secondary", "md", "flex-1")}>
          Back to Home
        </Link>
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center text-sm text-[var(--ink)]/60">
        <p>
          Questions? Contact us at support@lovinas-shop.com or check your email for updates
        </p>
      </div>
    </div>
  );
}
