"use client";

import { Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function CartPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { items, removeItem, setQuantity } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="h-96 bg-gray-200 animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = 0;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">Review your items before checkout</p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="flex justify-center mb-6">
              <ShoppingCart className="w-16 h-16 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Start adding items to your cart!</p>
            <Link
              href="/shop"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50">
                  <div className="col-span-6 text-sm font-semibold text-gray-700">
                    Product
                  </div>
                  <div className="col-span-2 text-sm font-semibold text-gray-700 text-center">
                    Quantity
                  </div>
                  <div className="col-span-2 text-sm font-semibold text-gray-700 text-right">
                    Price
                  </div>
                  <div className="col-span-2 text-sm font-semibold text-gray-700 text-right">
                    Total
                  </div>
                </div>

                {/* Items */}
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 items-center hover:bg-gray-50 transition"
                  >
                    {/* Product */}
                    <div className="col-span-6">
                      <Link href={`/products/${item.slug}`} className="flex gap-3 group">
                        <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover group-hover:scale-105 transition"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-purple-600 transition">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500">ID: {item.productId}</p>
                        </div>
                      </Link>
                    </div>

                    {/* Quantity */}
                    <div className="col-span-2 flex justify-center">
                      <div className="flex items-center gap-2 bg-gray-100 rounded px-2 py-1">
                        <button
                          onClick={() => setQuantity(item.productId, Math.max(1, item.quantity - 1))}
                          className="text-gray-600 hover:text-gray-900 font-semibold text-lg"
                        >
                          −
                        </button>
                        <span className="w-6 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => setQuantity(item.productId, item.quantity + 1)}
                          className="text-gray-600 hover:text-gray-900 font-semibold text-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="col-span-2 text-right">
                      <p className="font-semibold text-gray-900">
                        ₹{item.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Total & Remove */}
                    <div className="col-span-2 flex items-center justify-end gap-3">
                      <p className="font-semibold text-gray-900">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition"
                        title="Remove from cart"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping */}
              <div className="mt-6">
                <Link
                  href="/shop"
                  className="text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-2"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg shadow-lg p-6 text-white sticky top-4">
                <h2 className="text-lg font-bold mb-6">Order Summary</h2>

                {/* Summary Items */}
                <div className="space-y-3 mb-6 pb-6 border-b border-white/20">
                  <div className="flex justify-between text-sm">
                    <span className="opacity-90">Subtotal</span>
                    <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                  </div>
                  {tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="opacity-90">Tax</span>
                      <span className="font-semibold">₹{tax.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between mb-6 text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">₹{total.toLocaleString()}</span>
                </div>

                {/* Payment Info */}
                <div className="bg-white/10 rounded p-3 mb-6 text-sm">
                  <p className="font-semibold mb-1">💳 Payment Method</p>
                  <p>Cash on Delivery (COD)</p>
                  <p className="text-xs opacity-75 mt-2">
                    Pay at delivery
                  </p>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="w-full bg-white text-purple-600 font-bold py-3 rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Info */}
                <p className="text-xs opacity-75 text-center mt-4">
                  Free shipping on orders above ₹5000
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
