import { NextResponse } from "next/server";
import { getAdminSession, hasAdminAccess } from "@/lib/admin-auth";
import { deleteProduct, listProducts, upsertProduct } from "@/lib/admin-data";

export async function GET() {
  const session = await getAdminSession();
  if (!hasAdminAccess(session)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const products = await listProducts();
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!hasAdminAccess(session, "owner")) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  const product = await upsertProduct(null, body);
  return NextResponse.json({ product }, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!hasAdminAccess(session, "owner")) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "Product id is required" }, { status: 400 });
  }

  await deleteProduct(id);
  return NextResponse.json({ message: "Product deleted" });
}