import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/service/order.service";
import { sendOrderConfirmationEmail, sendAdminNotificationEmail } from "@/service/email.service";
import type { CheckoutFormData } from "@/types/order";
import type { CartItem } from "@/store/cart-store";
import { z } from "zod";

// Request validation schema
const orderRequestSchema = z.object({
  customer: z.object({
    fullName: z.string().min(2),
    phone: z.string().regex(/^[0-9]{10}$/),
    email: z.string().email(),
    address: z.string().min(5),
    city: z.string().min(2),
    notes: z.string().optional(),
  }),
  items: z.array(
    z.object({
      productId: z.string(),
      slug: z.string(),
      name: z.string(),
      price: z.number().positive(),
      image: z.string(),
      quantity: z.number().int().positive(),
    }),
  ),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    const validation = orderRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid request data",
          errors: validation.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { customer, items } = validation.data;

    // Validate cart is not empty
    if (!items || items.length === 0) {
      return NextResponse.json(
        { message: "Cart is empty" },
        { status: 400 },
      );
    }

    // Create order in Firestore
    const order = await createOrder(customer as CheckoutFormData, items as CartItem[]);

    // Send confirmation email to customer
    try {
      await sendOrderConfirmationEmail(order);
    } catch (emailError) {
      console.error("Failed to send customer confirmation email:", emailError);
      // Don't fail the request if email fails
    }

    // Send notification email to admin
    try {
      await sendAdminNotificationEmail(order);
    } catch (emailError) {
      console.error("Failed to send admin notification email:", emailError);
      // Don't fail the request if admin email fails
    }

    return NextResponse.json(
      {
        message: "Order created successfully",
        order,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Order creation error:", error);

    const message = error instanceof Error ? error.message : "Failed to create order";
    const statusCode = message.includes("Firebase not configured") ? 503 : 500;

    return NextResponse.json(
      { message },
      { status: statusCode },
    );
  }
}

// GET endpoint for retrieving order
export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("id");

  if (!orderId) {
    return NextResponse.json(
      { message: "Order ID is required" },
      { status: 400 },
    );
  }

  try {
    const { getOrderById } = await import("@/service/order.service");
    const order = await getOrderById(orderId);

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    console.error("Order retrieval error:", error);
    return NextResponse.json(
      { message: "Failed to retrieve order" },
      { status: 500 },
    );
  }
}
