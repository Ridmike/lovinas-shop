import { NextResponse } from "next/server";
import { getAdminSession, hasAdminAccess } from "@/lib/admin-auth";
import { listOrders, updateOrderStatus } from "@/lib/admin-data";

export async function GET() {
  const session = await getAdminSession();
  if (!hasAdminAccess(session)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ orders: await listOrders() });
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!hasAdminAccess(session, "staff")) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.id || !body?.status) {
    return NextResponse.json({ message: "id and status are required" }, { status: 400 });
  }

  await updateOrderStatus(String(body.id), body.status);
  return NextResponse.json({ message: "Order status updated" });
}