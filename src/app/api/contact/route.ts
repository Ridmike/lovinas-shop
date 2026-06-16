import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getAdminFirestore, getFirebaseAdminConfigMessage } from "@/lib/firebase-admin";
import { contactSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid form submission.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO ?? "hello@lovinasshop.com";

  if (apiKey) {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: process.env.CONTACT_EMAIL_FROM ?? "Lovina's Shop <onboarding@resend.dev>",
      to,
      subject: `Contact form: ${parsed.data.subject}`,
      replyTo: parsed.data.email,
      text: `${parsed.data.name}\n${parsed.data.email}\n\n${parsed.data.message}`,
    });
  }

  const firestore = getAdminFirestore();
  if (!firestore) {
    return NextResponse.json(
      { message: getFirebaseAdminConfigMessage() },
      { status: 503 },
    );
  }

  try {
    await firestore.collection("messages").add({
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
      createdAt: new Date().toISOString(),
      readAt: null,
    });
  } catch (error) {
    console.error("Failed to save contact message", error);
    return NextResponse.json(
      {
        message: "Unable to save your message.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: "Message received." });
}
