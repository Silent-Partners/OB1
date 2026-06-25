"use client";

/**
 * First-run empty state for the Recent list. Teaches the second-brain concept
 * by example: each chip seeds the capture box above (by id) so the first
 * capture is one click away, not a blank-page act of faith.
 */
const EXAMPLES = [
  "Decided to ship the editorial dashboard refresh this week.",
  "Idea: show the predicted type in the capture box as I type.",
  "https://stitch.withgoogle.com/docs/design-md/format — read later",
];

function seed(text: string) {
  const el = document.getElementById(
    "add-to-brain-input"
  ) as HTMLTextAreaElement | null;
  if (!el) return;
  // Use the native setter so React's controlled onChange fires.
  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype,
    "value"
  )?.set;
  setter?.call(el, text);
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.focus();
  el.scrollIntoView({ block: "center" });
}

export function EmptyBrain() {
  return (
    <div className="bg-bg-surface border border-border-subtle rounded-sm p-6 text-center">
      <p className="font-serif text-lg text-text-primary">Your brain is empty — for now.</p>
      <p className="text-sm text-text-secondary mt-1 max-w-md mx-auto leading-relaxed">
        Capture anything: a task, an idea, a link, a decision. Open Brain sorts and
        connects it for you. Try one to start:
      </p>
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {EXAMPLES.map((ex, i) => (
          <button
            key={i}
            type="button"
            onClick={() => seed(ex)}
            className="text-xs text-text-secondary bg-bg-elevated border border-border-subtle rounded-sm px-3 py-1.5 text-left max-w-[15rem] truncate hover:border-violet hover:text-text-primary transition-colors"
            title={ex}
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
