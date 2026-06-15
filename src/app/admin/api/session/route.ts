import { NextResponse } from "next/server";
import { createAdminSession } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const idToken = body?.idToken;

  if (typeof idToken !== "string" || !idToken) {
    return NextResponse.json({ message: "idToken is required" }, { status: 400 });
  }

  try {
    await createAdminSession(idToken);
    return NextResponse.json({ message: "Session created" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create session";
    return NextResponse.json({ message }, { status: 500 });
  }
}