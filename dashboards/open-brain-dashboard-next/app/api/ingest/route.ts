import { NextRequest, NextResponse } from "next/server";
import { captureThought } from "@/lib/api";
import { requireSession, AuthError } from "@/lib/auth";

// ── GET — ingestion job history is not enabled in this deployment ────────────

export async function GET() {
  // Jobs require the smart-ingest schema (stubbed in this deployment). Return an
  // empty list so the Add page renders cleanly without erroring.
  return NextResponse.json([]);
}

// ── POST — Add to Brain (single capture via upsert_thought) ─────────────────

export async function POST(request: NextRequest) {
  let apiKey: string;
  try {
    ({ apiKey } = await requireSession());
  } catch (err) {
    if (err instanceof AuthError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    throw err;
  }

  try {
    const body = await request.json();
    const { text } = body as { text: string };

    if (!text?.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // v1: every Add-to-Brain capture goes through /capture (upsert_thought + embed),
    // identical to Slack/MCP captures. The multi-thought "extract" path depends on the
    // smart-ingest endpoint, which is stubbed (501) in this deployment.
    const result = await captureThought(apiKey, text.trim());
    return NextResponse.json({
      path: "single" as const,
      thought_id: result.thought_id,
      type: result.type,
      message: "Saved to Open Brain",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed" },
      { status: 500 }
    );
  }
}
