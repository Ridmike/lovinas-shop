import { NextResponse } from "next/server";
import { getAdminSession, hasAdminAccess } from "@/lib/admin-auth";
import { deleteMessage, listMessages, markMessageRead } from "@/lib/admin-data";

export async function GET() {
  const session = await getAdminSession();
  if (!hasAdminAccess(session, "owner")) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ messages: await listMessages() });
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!hasAdminAccess(session, "owner")) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.id) {
    return NextResponse.json({ message: "id is required" }, { status: 400 });
  }

  await markMessageRead(String(body.id));
  return NextResponse.json({ message: "Message marked read" });
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!hasAdminAccess(session, "owner")) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "Message id is required" }, { status: 400 });
  }

  await deleteMessage(id);
  return NextResponse.json({ message: "Message deleted" });
}