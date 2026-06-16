"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Loader2, AlertCircle, Banknote, Wallet, Upload, X } from "lucide-react";
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
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "BankTransfer">("COD");
  const [slipUrl, setSlipUrl] = useState("");
  const [uploadingSlip, setUploadingSlip] = useState(false);
  const [slipError, setSlipError] = useState("");
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
    trackFacebookEvent("InitiateCheckout", { value: subtotal, currency: "LKR" });
    trackTikTokEvent("InitiateCheckout", { value: subtotal, currency: "LKR" });
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

  async function uploadSlip(file: File) {
    setUploadingSlip(true);
    try {
      const data = new FormData();
      data.append("file", file);
      const response = await fetch("/api/upload", { method: "POST", body: data });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.message ?? "Slip upload failed");
      }
      setSlipUrl(payload.url);
      setSlipError("");
      toast.success("Bank slip uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Slip upload failed");
    } finally {
      setUploadingSlip(false);
    }
  }

  const onSubmit = async (data: CheckoutFormData) => {
    if (paymentMethod === "BankTransfer" && !slipUrl) {
      setSlipError("Please upload your bank transfer slip");
      toast.error("Bank transfer slip is required");
      return;
    }

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
          paymentMethod,
          paymentSlipUrl: paymentMethod === "BankTransfer" ? slipUrl : undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create order");
      }

      const { order } = await response.json();

      trackFacebookEvent("Purchase", { value: total, currency: "LKR", order_id: order.orderNumber });
      trackTikTokEvent("CompletePayment", { value: total, currency: "LKR", order_id: order.orderNumber });

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

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("COD")}
                  className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                    paymentMethod === "COD"
                      ? "border-[var(--brand)] bg-[var(--surface-accent)] ring-2 ring-[var(--brand)]/30"
                      : "border-[var(--border-soft)] hover:border-[var(--brand)]/40"
                  }`}
                >
                  <Wallet className="h-6 w-6 text-[var(--brand)]" />
                  <div>
                    <p className="font-semibold text-[var(--ink)]">Cash on Delivery</p>
                    <p className="mt-1 text-sm text-[var(--ink)]/70">Pay when your order is delivered.</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("BankTransfer")}
                  className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                    paymentMethod === "BankTransfer"
                      ? "border-[var(--brand)] bg-[var(--surface-accent)] ring-2 ring-[var(--brand)]/30"
                      : "border-[var(--border-soft)] hover:border-[var(--brand)]/40"
                  }`}
                >
                  <Banknote className="h-6 w-6 text-[var(--brand)]" />
                  <div>
                    <p className="font-semibold text-[var(--ink)]">Bank Transfer</p>
                    <p className="mt-1 text-sm text-[var(--ink)]/70">Transfer and upload your deposit slip.</p>
                  </div>
                </button>
              </div>

              {paymentMethod === "BankTransfer" && (
                <div className="mt-4 space-y-4 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-accent)] p-4">
                  <div className="text-sm text-[var(--ink)]/80">
                    <p className="font-semibold text-[var(--ink)]">Transfer to:</p>
                    <p className="mt-1">Lovina&apos;s Shop · Bank of Ceylon</p>
                    <p>Account No: 0000 0000 0000</p>
                    <p>Branch: Colombo</p>
                  </div>

                  <div>
                    <Label className="mb-2 block">Upload Bank Transfer Slip *</Label>

                    {slipUrl ? (
                      <div className="relative inline-block">
                        <div className="relative h-40 w-40 overflow-hidden rounded-2xl border border-[var(--border-soft)] bg-white">
                          <Image src={slipUrl} alt="Bank transfer slip" fill className="object-cover" />
                        </div>
                        <button
                          type="button"
                          onClick={() => setSlipUrl("")}
                          className="absolute -right-2 -top-2 rounded-full bg-[var(--destructive)] p-1.5 text-white shadow"
                          title="Remove slip"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--brand)]/30 bg-white px-4 py-2 text-sm font-semibold text-[var(--brand)] transition hover:border-[var(--brand)]/50">
                        {uploadingSlip ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        {uploadingSlip ? "Uploading..." : "Upload slip"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) void uploadSlip(file);
                          }}
                        />
                      </label>
                    )}

                    <FieldError message={slipError} />
                  </div>
                </div>
              )}
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
                  <span className="font-semibold">LKR {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mb-6 space-y-3 border-b border-white/20 pb-6">
              <div className="flex justify-between text-sm">
                <span className="opacity-90">Subtotal</span>
                <span className="font-semibold">LKR {subtotal.toLocaleString()}</span>
              </div>
              {tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="opacity-90">Tax</span>
                  <span className="font-semibold">LKR {tax.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="mb-6 flex justify-between text-lg">
              <span className="font-bold">Total</span>
              <span className="font-bold">LKR {total.toLocaleString()}</span>
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
