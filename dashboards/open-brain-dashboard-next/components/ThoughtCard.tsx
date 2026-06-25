import Link from "next/link";
import type { Thought } from "@/lib/types";
import { getParsedReference, TYPE_EMOJI, prettifyType } from "@/lib/types";
import { FormattedDate } from "@/components/FormattedDate";

// Editorial system = one accent. The per-type emoji carries the signal; the
// chip stays a single neutral ink tint so the screen reads as one brand.
const BADGE_CLASS =
  "bg-bg-elevated text-text-secondary border-border-subtle";

export function TypeBadge({ type }: { type: string }) {
  const emoji = TYPE_EMOJI[type];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-medium border ${BADGE_CLASS}`}
    >
      {emoji && <span aria-hidden>{emoji}</span>}
      {prettifyType(type)}
    </span>
  );
}

/**
 * Clean, clickable reference / bookmark card built from the gateway-parsed
 * fields (title → url, author · source, summary, why-saved chip, unread badge).
 */
export function ReferenceCard({ thought }: { thought: Thought }) {
  const ref = getParsedReference(thought)!;
  const title = ref.title || ref.url || "(untitled reference)";
  const byline = [ref.author, ref.source].filter(Boolean).join(" · ");

  return (
    <div className="bg-bg-surface border border-border-subtle rounded-sm p-4 transition-[border-color,box-shadow] duration-150 hover:border-border hover:shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <TypeBadge type={thought.type} />
          {ref.kind === "bookmark" && ref.unread && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium bg-bg-elevated text-text-secondary border border-border-subtle">
              unread
            </span>
          )}
        </div>
        <FormattedDate
          date={thought.created_at}
          className="text-xs text-text-muted whitespace-nowrap"
        />
      </div>

      {ref.url ? (
        <a
          href={ref.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-sm font-medium text-text-primary hover:text-violet transition-colors break-words"
        >
          {title}
        </a>
      ) : (
        <span className="block text-sm font-medium text-text-primary break-words">
          {title}
        </span>
      )}

      {byline && (
        <p className="text-xs text-text-muted mt-0.5">{byline}</p>
      )}

      {ref.summary && (
        <p className="text-sm text-text-secondary leading-relaxed mt-2">
          {ref.summary}
        </p>
      )}

      <div className="flex items-center gap-2 flex-wrap mt-2">
        {ref.why_saved && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-violet-surface text-violet text-xs">
            💡 {ref.why_saved}
          </span>
        )}
        {ref.published && (
          <span className="text-xs text-text-muted">{ref.published}</span>
        )}
        {ref.file && (
          <span className="text-xs text-text-muted">📎 {ref.file}</span>
        )}
        <Link
          href={`/thoughts/${thought.id}`}
          className="text-xs text-text-muted hover:text-violet transition-colors ml-auto"
        >
          details →
        </Link>
      </div>
    </div>
  );
}

export function ThoughtCard({
  thought,
  showLink = true,
}: {
  thought: Thought;
  showLink?: boolean;
}) {
  // Reference and bookmark captures render as structured cards.
  if (getParsedReference(thought)) {
    return <ReferenceCard thought={thought} />;
  }

  const preview =
    thought.content.length > 200
      ? thought.content.slice(0, 200) + "..."
      : thought.content;

  const inner = (
    <div className="bg-bg-surface border border-border-subtle rounded-sm p-4 transition-[border-color,box-shadow] duration-150 hover:border-border hover:shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-2">
        <TypeBadge type={thought.type} />
        <FormattedDate date={thought.created_at} className="text-xs text-text-muted whitespace-nowrap" />
      </div>
      <p className="text-sm text-text-secondary leading-relaxed">{preview}</p>
    </div>
  );

  if (showLink) {
    return <Link href={`/thoughts/${thought.id}`}>{inner}</Link>;
  }
  return inner;
}
