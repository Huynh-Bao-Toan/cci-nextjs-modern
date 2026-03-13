export function AppFooter() {
  return (
    <footer className="border-t bg-background/80">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
        <p>
          Mini Commerce Catalog · Built with Next.js 16 &amp; DummyJSON products
          API.
        </p>
        <p className="text-[11px] sm:text-xs">
          Demo project focused on routing, data fetching, caching, and
          performance patterns.
        </p>
      </div>
    </footer>
  );
}

