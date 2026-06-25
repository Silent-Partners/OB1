import { NextRequest, NextResponse } from "next/server";
import { deleteThought, ApiError } from "@/lib/api";
import { requireSession, AuthError } from "@/lib/auth";

// DELETE — remove a single thought. Used by the capture "Undo" affordance and
// by thought-detail deletion.
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let apiKey: string;
  try {
    ({ apiKey } = await requireSession());
  } catch (err) {
    if (err instanceof AuthError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    throw err;
  }

  const { id } = await params;

  try {
    await deleteThought(apiKey, id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const status = err instanceof ApiError ? err.status : 500;
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed" },
      { status }
    );
  }
}
