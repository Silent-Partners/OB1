"use client";

import { AddToBrain } from "@/components/AddToBrain";

export default function AddToBrainPage() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet mb-2">
          Capture
        </p>
        <h1 className="font-serif font-light text-3xl tracking-tight text-text-primary">
          Add to Brain
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Capture a thought, note, reference, or task. Open Brain classifies and
          embeds it automatically, the same path as Slack and MCP captures.
        </p>
      </div>

      <div className="bg-bg-surface border border-border rounded-sm p-5">
        <AddToBrain rows={6} />
      </div>
    </div>
  );
}
