import { Suspense } from "react";
import Link from "next/link";
import { fetchStats, fetchThoughts } from "@/lib/api";
import { requireSessionOrRedirect, getSession } from "@/lib/auth";
import { StatsWidget } from "@/components/StatsWidget";
import { ThoughtCard } from "@/components/ThoughtCard";
import { AddToBrain } from "@/components/AddToBrain";
import { Greeting } from "@/components/Greeting";
import { EmptyBrain } from "@/components/EmptyBrain";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Resolve auth before rendering (redirects if needed). The shell — masthead
  // and capture — then streams immediately; data sections stream in behind
  // Suspense so a slow API never blocks the first paint.
  await requireSessionOrRedirect();

  return (
    <div className="space-y-12">
      <Masthead />

      <Suspense fallback={<StatsSkeleton />}>
        <StatsSection />
      </Suspense>

      {/* Capture — the primary action, available instantly */}
      <section>
        <SectionHead title="Capture">
          <span
            className="text-text-muted"
            title="Open Brain reads each capture, picks the right type, and stores it as a searchable, semantically-embedded thought."
          >
            classified &amp; embedded automatically
          </span>
        </SectionHead>
        <AddToBrain rows={3} />
      </section>

      {/* Recent activity */}
      <section>
        <SectionHead title="Recent">
          <Link
            href="/thoughts"
            className="text-text-muted hover:text-violet transition-colors"
          >
            All thoughts →
          </Link>
        </SectionHead>
        <Suspense fallback={<RecentSkeleton />}>
          <RecentSection />
        </Suspense>
      </section>
    </div>
  );
}

/** Streams the stat ledger once stats resolve. */
async function StatsSection() {
  const { apiKey } = await requireSessionOrRedirect();
  const session = await getSession();
  const excludeRestricted = !session.restrictedUnlocked;
  let stats;
  try {
    stats = await fetchStats(apiKey, undefined, excludeRestricted);
  } catch (err) {
    return <LoadError what="stats" err={err} />;
  }
  return <StatsWidget stats={stats} />;
}

/** Streams the recent-thoughts list once it resolves. */
async function RecentSection() {
  const { apiKey } = await requireSessionOrRedirect();
  const session = await getSession();
  const excludeRestricted = !session.restrictedUnlocked;
  let recent;
  try {
    recent = await fetchThoughts(apiKey, {
      page: 1,
      per_page: 5,
      exclude_restricted: excludeRestricted,
    });
  } catch (err) {
    return <LoadError what="recent activity" err={err} />;
  }
  if (recent.data.length === 0) return <EmptyBrain />;
  return (
    <div className="space-y-2.5">
      {recent.data.map((thought) => (
        <ThoughtCard key={thought.id} thought={thought} />
      ))}
    </div>
  );
}

function LoadError({ what, err }: { what: string; err: unknown }) {
  return (
    <div className="bg-danger/10 border border-danger/30 rounded-sm p-4 text-danger text-sm">
      Couldn&apos;t load {what}. Check the API connection.
      <br />
      <span className="text-text-muted">
        {err instanceof Error ? err.message : "Unknown error"}
      </span>
    </div>
  );
}

/** Skeleton matching the stat-ledger grid. */
function StatsSkeleton() {
  return (
    <div
      className="bg-bg-surface border border-border rounded-sm shadow-sm grid grid-cols-1 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1fr)] divide-y md:divide-y-0 md:divide-x divide-border-subtle animate-pulse"
      aria-hidden="true"
    >
      <div className="p-6 space-y-3">
        <div className="h-3 w-20 bg-bg-elevated rounded-sm" />
        <div className="h-12 w-28 bg-bg-elevated rounded-sm" />
        <div className="h-3 w-24 bg-bg-elevated rounded-sm" />
      </div>
      <div className="p-6 space-y-2.5">
        <div className="h-3 w-16 bg-bg-elevated rounded-sm mb-3" />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-3 w-full bg-bg-elevated rounded-sm" />
        ))}
      </div>
      <div className="p-6 space-y-2.5">
        <div className="h-3 w-20 bg-bg-elevated rounded-sm mb-3" />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-3 w-full bg-bg-elevated rounded-sm" />
        ))}
      </div>
    </div>
  );
}

/** Skeleton matching the recent-thoughts list. */
function RecentSkeleton() {
  return (
    <div className="space-y-2.5 animate-pulse" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="bg-bg-surface border border-border-subtle rounded-sm p-4 space-y-2.5"
        >
          <div className="flex justify-between">
            <div className="h-4 w-20 bg-bg-elevated rounded-sm" />
            <div className="h-3 w-28 bg-bg-elevated rounded-sm" />
          </div>
          <div className="h-3 w-full bg-bg-elevated rounded-sm" />
          <div className="h-3 w-2/3 bg-bg-elevated rounded-sm" />
        </div>
      ))}
    </div>
  );
}

/** Editorial masthead: one kicker, a serif title, and a warm dateline. */
function Masthead() {
  return (
    <header>
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="type-overline mb-1.5">Open Brain</p>
          <h1 className="font-serif font-light text-4xl tracking-tight text-text-primary">
            Dashboard
          </h1>
        </div>
        <Greeting />
      </div>
      <div className="rule-masthead mt-4" />
    </header>
  );
}

/** Section head: serif title + hairline rule + optional right-aligned meta. */
function SectionHead({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border pb-2 mb-4">
      <h2 className="font-serif text-xl font-normal text-text-primary">{title}</h2>
      <span className="text-xs">{children}</span>
    </div>
  );
}
