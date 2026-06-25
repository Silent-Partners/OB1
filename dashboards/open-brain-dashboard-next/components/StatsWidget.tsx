import type { StatsResponse } from "@/lib/types";
import { TYPE_EMOJI, prettifyType } from "@/lib/types";

/**
 * Editorial "ledger" — one paper band split by hairline rules, not three
 * identical cards. The total is a serif numeral (the anchor); type distribution
 * and top topics read as a contents page beside it.
 */
export function StatsWidget({ stats }: { stats: StatsResponse }) {
  const allTypes = Object.entries(stats.types).sort(
    (a, b) => (b[1] as number) - (a[1] as number)
  );
  const types = allTypes.slice(0, 6);
  const hiddenTypes = allTypes.slice(6);
  const hiddenCount = hiddenTypes.reduce((sum, [, c]) => sum + (c as number), 0);

  const topics = stats.top_topics?.slice(0, 5) ?? [];

  return (
    <div className="bg-bg-surface border border-border rounded-sm shadow-sm grid grid-cols-1 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1fr)] divide-y md:divide-y-0 md:divide-x divide-border-subtle">
      {/* Anchor — total thoughts as a serif numeral */}
      <div className="p-6 flex flex-col justify-center">
        <p className="text-xs text-text-muted">In your brain</p>
        <p className="font-serif font-light text-6xl tracking-tight text-text-primary tabular-nums mt-1 leading-none">
          {stats.total_thoughts.toLocaleString()}
        </p>
        <p className="text-xs text-text-muted mt-2">
          {stats.window_days === "all"
            ? "thoughts, all time"
            : `thoughts · last ${stats.window_days} days`}
        </p>
      </div>

      {/* By type — definition-list rhythm */}
      <div className="p-6">
        <p className="text-xs text-text-muted mb-3">By type</p>
        <dl className="space-y-1.5">
          {types.map(([type, count]) => (
            <div key={type} className="flex items-baseline gap-2 text-sm">
              <dt className="flex items-center gap-1.5 text-text-secondary min-w-0">
                <span aria-hidden className="text-sm">
                  {TYPE_EMOJI[type] ?? "•"}
                </span>
                <span className="truncate">{prettifyType(type)}</span>
              </dt>
              <span className="flex-1 border-b border-dotted border-border-subtle translate-y-[-2px]" />
              <dd className="text-text-primary tabular-nums">
                {(count as number).toLocaleString()}
              </dd>
            </div>
          ))}
          {hiddenCount > 0 && (
            <p className="text-xs text-text-muted pt-0.5">
              +{hiddenTypes.length} more types · {hiddenCount.toLocaleString()}
            </p>
          )}
          {types.length === 0 && (
            <p className="text-text-muted text-sm">No thoughts yet</p>
          )}
        </dl>
      </div>

      {/* Top topics */}
      <div className="p-6">
        <p className="text-xs text-text-muted mb-3">Top topics</p>
        <ol className="space-y-1.5">
          {topics.map((t, i) => (
            <li key={t.topic} className="flex items-baseline gap-2 text-sm">
              <span className="text-text-muted tabular-nums w-4 shrink-0">{i + 1}</span>
              <span className="text-text-secondary truncate min-w-0">{t.topic}</span>
              <span className="flex-1 border-b border-dotted border-border-subtle translate-y-[-2px]" />
              <span className="text-text-primary tabular-nums">{t.count}</span>
            </li>
          ))}
          {topics.length === 0 && (
            <p className="text-text-muted text-sm">No topic data</p>
          )}
        </ol>
      </div>
    </div>
  );
}
