"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import Link from "next/link";
import { ShoppingCart, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { trackFacebookEvent, trackTikTokEvent } from "@/lib/marketing";
import {
  PageContainer,
  PageTitle,
  SectionHeading,
  Card,
  Button,
  Input,
  Textarea,
  Label,
} from "@/components/ui";

// Validation schema
const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().regex(/^[0-9]{10}$/, "Phone must be a valid 10-digit number"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1 flex items-center gap-1 text-sm text-[var(--destructive)]">
      <AlertCircle className="h-4 w-4" />
      {message}
    </p>
  );
}

export default function CheckoutPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = 0;
  const total = subtotal + tax;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    setIsMounted(true);
    trackFacebookEvent("InitiateCheckout", { value: subtotal, currency: "INR" });
    trackTikTokEvent("InitiateCheckout", { value: subtotal, currency: "INR" });
    if (items.length === 0 && isMounted) {
      router.push("/cart");
    }
  }, [items, isMounted, router, subtotal]);

  if (!isMounted) {
    return (
      <PageContainer>
        <div className="h-screen animate-pulse rounded-[var(--radius-card)] bg-black/5" />
      </PageContainer>
    );
  }

  if (items.length === 0) {
    return null;
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: data,
          items,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create order");
      }

      const { order } = await response.json();

      trackFacebookEvent("Purchase", { value: total, currency: "INR", order_id: order.orderNumber });
      trackTikTokEvent("CompletePayment", { value: total, currency: "INR", order_id: order.orderNumber });

      // Clear cart and redirect to success page
      clearCart();
      toast.success("Order created successfully!");
      router.push(`/order-success/${order.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create order";
      toast.error(message);
      console.error("Checkout error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-8">
        <PageTitle className="mb-2">Checkout</PageTitle>
        <p className="text-[var(--ink)]/70">Complete your purchase</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Shipping Information */}
            <Card className="p-6">
              <SectionHeading className="mb-6 text-xl">Shipping Information</SectionHeading>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <Label className="mb-2 block">Full Name *</Label>
                  <Input {...register("fullName")} type="text" placeholder="John Doe" />
                  <FieldError message={errors.fullName?.message} />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2 block">Email *</Label>
                    <Input {...register("email")} type="email" placeholder="john@example.com" />
                    <FieldError message={errors.email?.message} />
                  </div>

                  <div>
                    <Label className="mb-2 block">Phone Number *</Label>
                    <Input {...register("phone")} type="tel" placeholder="9876543210" />
                    <FieldError message={errors.phone?.message} />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <Label className="mb-2 block">Street Address *</Label>
                  <Input {...register("address")} type="text" placeholder="123 Main Street" />
                  <FieldError message={errors.address?.message} />
                </div>

                {/* City */}
                <div>
                  <Label className="mb-2 block">City *</Label>
                  <Input {...register("city")} type="text" placeholder="Mumbai" />
                  <FieldError message={errors.city?.message} />
                </div>

                {/* Notes */}
                <div>
                  <Label className="mb-2 block">Special Instructions (Optional)</Label>
                  <Textarea
                    {...register("notes")}
                    placeholder="Any special instructions for delivery..."
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </div>
            </Card>

            {/* Payment Information */}
            <Card className="p-6">
              <SectionHeading className="mb-4 text-xl">Payment Method</SectionHeading>
              <div className="flex items-start gap-3 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-accent)] p-4">
                <div className="text-2xl">💳</div>
                <div>
                  <p className="font-semibold text-[var(--ink)]">Cash on Delivery (COD)</p>
                  <p className="mt-1 text-sm text-[var(--ink)]/70">
                    Pay the full amount at the time of delivery. Our delivery partner will collect payment from you.
                  </p>
                </div>
              </div>
            </Card>

            {/* Submit Button */}
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5" />
                  Place Order
                </>
              )}
            </Button>

            {/* Back to Cart */}
            <div>
              <Link
                href="/cart"
                className="font-semibold text-[var(--brand)] hover:text-[var(--brand-strong)]"
              >
                ← Back to Cart
              </Link>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 rounded-[var(--radius-card)] bg-[var(--ink)] p-6 text-white shadow-sm">
            <h2 className="mb-6 font-display text-lg font-semibold">Order Summary</h2>

            {/* Items */}
            <div className="mb-6 max-h-64 space-y-3 overflow-y-auto border-b border-white/20 pb-6">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="opacity-90">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
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

            {/* Info */}
            <div className="rounded-2xl bg-white/10 p-3 text-sm">
              <p className="mb-2 font-semibold">✓ Items {items.length}</p>
              <p className="text-xs opacity-75">
                You will receive a confirmation email after placing your order.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
