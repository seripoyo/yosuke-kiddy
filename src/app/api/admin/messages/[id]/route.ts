import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { deleteGuestbookEntry } from "@/lib/notion";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    await deleteGuestbookEntry(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete message:", err);
    return NextResponse.json(
      { error: "削除に失敗しました。" },
      { status: 500 }
    );
  }
}
