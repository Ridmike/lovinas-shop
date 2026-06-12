import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, MapPin, Mail, Phone } from "lucide-react";
import { getOrderById } from "@/service/order.service";

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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-200 rounded-full animate-pulse" />
              <CheckCircle className="w-20 h-20 text-green-600 relative z-10" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase at Lovina's Shop
          </p>
        </div>

        {/* Order Number Card */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg shadow-lg p-8 text-white text-center mb-8">
          <p className="text-sm font-semibold opacity-90 mb-2">ORDER NUMBER</p>
          <p className="text-4xl font-bold tracking-wider">{order.orderNumber}</p>
          <p className="text-sm opacity-75 mt-4">
            Confirmation email sent to <strong>{order.customer.email}</strong>
          </p>
        </div>

        {/* Order Details Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-600" />
              Order Details
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Items</span>
                <span className="font-semibold">{order.items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">₹{order.subtotal.toLocaleString()}</span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">₹{order.tax.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-lg text-green-600">₹{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-600" />
              Shipping Address
            </h2>
            <div className="space-y-2 text-gray-700">
              <p className="font-semibold">{order.customer.fullName}</p>
              <p>{order.customer.address}</p>
              <p>{order.customer.city}</p>
              <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  {order.customer.phone}
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  {order.customer.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Items Ordered</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.productId} className="flex justify-between items-center pb-4 border-b border-gray-200 last:border-b-0">
                <div>
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    ₹{item.price.toLocaleString()} × {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-gray-900">
                  ₹{item.subtotal.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment & Status Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Payment Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-bold text-gray-900 mb-3">💳 Payment Information</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <strong>Method:</strong> {order.paymentMethod === "COD" ? "Cash on Delivery" : order.paymentMethod}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                  {order.paymentStatus === "unpaid" ? "Pending" : order.paymentStatus}
                </span>
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Payment will be collected at delivery
              </p>
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-bold text-gray-900 mb-3">📦 Order Status</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <strong>Current Status:</strong>{" "}
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                  {order.status === "pending" ? "Processing" : order.status}
                </span>
              </p>
              <p className="text-xs text-gray-600 mt-2">
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
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-gray-900 mb-2">📝 Special Instructions</h3>
            <p className="text-gray-700">{order.customer.notes}</p>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 mb-8">
          <h3 className="font-bold text-gray-900 mb-3">✨ What Happens Next?</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✓ We're preparing your order for shipment</li>
            <li>✓ You'll receive a shipping confirmation email</li>
            <li>✓ Our delivery partner will contact you to schedule delivery</li>
            <li>✓ Payment is collected at the time of delivery</li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/shop"
            className="flex-1 text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="flex-1 text-center border-2 border-purple-600 text-purple-600 font-bold py-3 px-6 rounded-lg hover:bg-purple-50 transition"
          >
            Back to Home
          </Link>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>
            Questions? Contact us at support@lovinas-shop.com or check your email for updates
          </p>
        </div>
      </div>
    </div>
  );
}
