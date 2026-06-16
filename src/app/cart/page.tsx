"use client";

import { Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import Image from "next/image";
import { useEffect, useState } from "react";
import { PageContainer, PageTitle, Card, buttonClass } from "@/components/ui";

export default function CartPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { items, removeItem, setQuantity } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <PageContainer>
        <div className="h-96 animate-pulse rounded-[var(--radius-card)] bg-black/5" />
      </PageContainer>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = 0;
  const total = subtotal + tax;

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-8">
        <PageTitle className="mb-2">Shopping Cart</PageTitle>
        <p className="text-[var(--ink)]/70">Review your items before checkout</p>
      </div>

      {items.length === 0 ? (
        <div className="py-20 text-center">
          <div className="mb-6 flex justify-center">
            <ShoppingCart className="h-16 w-16 text-[var(--ink)]/20" />
          </div>
          <h2 className="mb-2 font-display text-2xl font-semibold text-[var(--ink)]">
            Your cart is empty
          </h2>
          <p className="mb-6 text-[var(--ink)]/70">Start adding items to your cart!</p>
          <Link href="/shop" className={buttonClass("primary")}>
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 border-b border-[var(--border-soft)] bg-[var(--surface-accent)] p-4">
                <div className="col-span-6 text-sm font-semibold text-[var(--ink)]">
                  Product
                </div>
                <div className="col-span-2 text-center text-sm font-semibold text-[var(--ink)]">
                  Quantity
                </div>
                <div className="col-span-2 text-right text-sm font-semibold text-[var(--ink)]">
                  Price
                </div>
                <div className="col-span-2 text-right text-sm font-semibold text-[var(--ink)]">
                  Total
                </div>
              </div>

              {/* Items */}
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="grid grid-cols-12 items-center gap-4 border-b border-[var(--border-soft)] p-4 transition hover:bg-[var(--surface-accent)]"
                >
                  {/* Product */}
                  <div className="col-span-6">
                    <Link href={`/products/${item.slug}`} className="group flex gap-3">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl bg-black/5">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover transition group-hover:scale-105"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--ink)] transition group-hover:text-[var(--brand)]">
                          {item.name}
                        </p>
                        <p className="text-sm text-[var(--ink)]/50">ID: {item.productId}</p>
                      </div>
                    </Link>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-2 flex justify-center">
                    <div className="flex items-center gap-2 rounded-full border border-[var(--border)] px-2 py-1">
                      <button
                        onClick={() => setQuantity(item.productId, Math.max(1, item.quantity - 1))}
                        className="text-lg font-semibold text-[var(--ink)]/60 hover:text-[var(--ink)]"
                      >
                        −
                      </button>
                      <span className="w-6 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => setQuantity(item.productId, item.quantity + 1)}
                        className="text-lg font-semibold text-[var(--ink)]/60 hover:text-[var(--ink)]"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-2 text-right">
                    <p className="font-semibold text-[var(--ink)]">
                      ₹{item.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Total & Remove */}
                  <div className="col-span-2 flex items-center justify-end gap-3">
                    <p className="font-semibold text-[var(--ink)]">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="rounded-full p-2 text-[var(--destructive)] transition hover:bg-[var(--destructive-bg)]"
                      title="Remove from cart"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </Card>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link
                href="/shop"
                className="flex items-center gap-2 font-semibold text-[var(--brand)] hover:text-[var(--brand-strong)]"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 rounded-[var(--radius-card)] bg-[var(--ink)] p-6 text-white shadow-sm">
              <h2 className="mb-6 font-display text-lg font-semibold">Order Summary</h2>

              {/* Summary Items */}
              <div className="mb-6 space-y-3 border-b border-white/20 pb-6">
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
              <div className="mb-6 flex justify-between text-lg">
                <span className="font-bold">Total</span>
                <span className="font-bold">₹{total.toLocaleString()}</span>
              </div>

              {/* Payment Info */}
              <div className="mb-6 rounded-2xl bg-white/10 p-3 text-sm">
                <p className="mb-1 font-semibold">💳 Payment Method</p>
                <p>Cash on Delivery (COD)</p>
                <p className="mt-2 text-xs opacity-75">Pay at delivery</p>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-3 font-semibold text-[var(--brand)] transition hover:bg-[var(--surface-accent)]"
              >
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </Link>

              {/* Info */}
              <p className="mt-4 text-center text-xs opacity-75">
                Free shipping on orders above ₹5000
              </p>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
