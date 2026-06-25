import { fetchReferences } from "@/lib/api";
import { requireSessionOrRedirect } from "@/lib/auth";
import { ThoughtCard } from "@/components/ThoughtCard";
import { getParsedReference } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ReferencesPage() {
  const { apiKey } = await requireSessionOrRedirect();

  let data;
  try {
    data = await fetchReferences(apiKey);
  } catch (err) {
    return (
      <div className="space-y-6">
        <h1 className="font-serif font-light text-3xl tracking-tight">References</h1>
        <p className="text-danger text-sm">
          Failed to load references.{" "}
          {err instanceof Error ? err.message : ""}
        </p>
      </div>
    );
  }

  const references = data.data.filter((t) => t.type === "reference");
  const bookmarks = data.data.filter((t) => t.type === "bookmark");
  const unread = bookmarks.filter((t) => getParsedReference(t)?.unread);
  const read = bookmarks.filter((t) => !getParsedReference(t)?.unread);

  return (
    <div className="space-y-10">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet mb-2">
          Library
        </p>
        <h1 className="font-serif font-light text-3xl tracking-tight text-text-primary">
          References
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          {references.length} reference{references.length === 1 ? "" : "s"}
          {" · "}
          {bookmarks.length} bookmark{bookmarks.length === 1 ? "" : "s"}
          {unread.length > 0 && ` (${unread.length} unread)`}
        </p>
      </div>

      {/* References library */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-[0.16em] pb-2 border-b border-border">
          Library
        </h2>
        {references.length === 0 ? (
          <p className="text-text-muted text-sm">No references yet.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {references.map((t) => (
              <ThoughtCard key={t.id} thought={t} />
            ))}
          </div>
        )}
      </section>

      {/* Bookmarks reading list */}
      {bookmarks.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-[0.16em] pb-2 border-b border-border">
            🔖 Reading list
          </h2>

          {unread.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs text-violet font-semibold uppercase tracking-wider">
                Unread ({unread.length})
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                {unread.map((t) => (
                  <ThoughtCard key={t.id} thought={t} />
                ))}
              </div>
            </div>
          )}

          {read.length > 0 && (
            <div className="space-y-3 pt-2">
              <p className="text-xs text-text-muted font-medium">
                Read ({read.length})
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                {read.map((t) => (
                  <ThoughtCard key={t.id} thought={t} />
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
