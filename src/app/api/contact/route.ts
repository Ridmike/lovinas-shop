import { NextResponse } from "next/server";
import { Resend } from "resend";
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

  return NextResponse.json({ message: "Message received." });
}
