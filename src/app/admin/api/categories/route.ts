import { NextResponse } from "next/server";
import { getAdminSession, hasAdminAccess } from "@/lib/admin-auth";
import { deleteCategory, DuplicateCategoryError, listCategories, reorderCategories, upsertCategory } from "@/lib/admin-data";

export async function GET() {
  const session = await getAdminSession();
  if (!hasAdminAccess(session)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ categories: await listCategories() });
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

  if (Array.isArray(body.ids)) {
    await reorderCategories(body.ids);
    return NextResponse.json({ message: "Categories reordered" });
  }

  try {
    const category = await upsertCategory(null, body);
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    if (error instanceof DuplicateCategoryError) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }
    throw error;
  }
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!hasAdminAccess(session, "owner")) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "Category id is required" }, { status: 400 });
  }

  await deleteCategory(id);
  return NextResponse.json({ message: "Category deleted" });
}