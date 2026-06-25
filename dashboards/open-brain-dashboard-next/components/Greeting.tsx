"use client";

import { useState } from "react";

/**
 * Warm, time-of-day dateline for the dashboard masthead. Computed on the client
 * so the greeting and date match the viewer's local time, not the server's.
 * Falls back to a stable string on the server to avoid a hydration mismatch.
 */
const NAME = "Andrew";

function compute() {
  const now = new Date();
  const h = now.getHours();
  const part =
    h < 5 ? "Still up" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  const greeting = `${part}, ${NAME}`;
  const date = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  return { greeting, date };
}

export function Greeting() {
  // Computed once on the client (null on the server). No effect needed; the
  // intentional hydration difference is suppressed on the text nodes below.
  const [v] = useState<{ greeting: string; date: string } | null>(() =>
    typeof window === "undefined" ? null : compute()
  );

  // Reserve height so the text fades in on hydration instead of swapping words
  // (avoids a visible "Welcome back" → greeting flash).
  return (
    <div className="text-right leading-tight min-h-[2.75rem]">
      <p
        className="font-serif italic text-lg text-text-primary"
        suppressHydrationWarning
      >
        {v?.greeting ?? " "}
      </p>
      <p
        className="text-xs text-text-muted mt-0.5 tabular-nums"
        suppressHydrationWarning
      >
        {v?.date ?? " "}
      </p>
    </div>
  );
}
