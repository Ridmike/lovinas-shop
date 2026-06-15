import { NextResponse } from "next/server";
import { getAdminSession, hasAdminAccess } from "@/lib/admin-auth";
import { deleteProduct, upsertProduct } from "@/lib/admin-data";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!hasAdminAccess(session, "owner")) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  const product = await upsertProduct(id, body);
  return NextResponse.json({ product });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!hasAdminAccess(session, "owner")) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await deleteProduct(id);
  return NextResponse.json({ message: "Product deleted" });
}