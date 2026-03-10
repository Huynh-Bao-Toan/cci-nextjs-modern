export function RenderStrategyExplainer() {
  return (
    <section className="space-y-3 rounded-lg border bg-muted/40 p-4 text-xs text-muted-foreground">
      <h2 className="text-sm font-semibold text-foreground">
        Rendering strategies in this app
      </h2>
      <ul className="list-disc space-y-1 pl-4">
        <li>
          <span className="font-semibold text-foreground">Server-first pages</span>{" "}
          like <code className="font-mono text-[11px]">/products</code> and{" "}
          <code className="font-mono text-[11px]">/products/[id]</code> fetch on the
          server and stream HTML to the client.
        </li>
        <li>
          <span className="font-semibold text-foreground">
            Client components for interaction
          </span>{" "}
          are limited to filters, favorites, and URL state control.
        </li>
        <li>
          <span className="font-semibold text-foreground">Cached blocks</span> like
          categories use React&apos;s <code className="font-mono text-[11px]">cache()</code>{" "}
          plus <code className="font-mono text-[11px]">force-cache</code> fetch to avoid
          refetching on each request.
        </li>
        <li>
          <span className="font-semibold text-foreground">Dynamic sections</span> such
          as search results opt out of caching for freshness.
        </li>
        <li>
          <span className="font-semibold text-foreground">Streaming</span> is used on
          product detail and this lab page to delay non-critical related content
          behind a Suspense boundary.
        </li>
      </ul>
    </section>
  );
}

