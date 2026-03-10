import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function MarketingHomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-16 px-4 py-16 sm:px-6 lg:px-8">
      <section className="grid gap-10 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-center">
        <div className="space-y-6">
          <p className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Mini Commerce Catalog
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Explore products with modern{" "}
            <span className="text-primary">Next.js 16</span> patterns.
          </h1>
          <p className="max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
            A production-style mini e-commerce catalog powered by the DummyJSON
            API. Built to showcase routing, data fetching, caching, streaming,
            and client interaction patterns for frontend teams.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/products">Start browsing products</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/lab">Open performance lab</Link>
            </Button>
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-medium text-muted-foreground">
            Highlights
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex items-start justify-between gap-3">
              <dt className="font-medium text-foreground">
                Server-first rendering
              </dt>
              <dd className="max-w-xs text-right text-muted-foreground">
                Product lists and details render on the server with predictable
                caching and URL-driven state.
              </dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="font-medium text-foreground">
                Client-side favorites
              </dt>
              <dd className="max-w-xs text-right text-muted-foreground">
                Persisted favorites powered by Zustand with a dedicated
                favorites view.
              </dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="font-medium text-foreground">
                Performance playground
              </dt>
              <dd className="max-w-xs text-right text-muted-foreground">
                A lab page to compare server components, client components,
                caching, and streaming behavior.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <Link
          href="/products"
          className="group rounded-xl border bg-card p-5 transition hover:border-primary/50 hover:shadow-sm"
        >
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
            Catalog
          </h3>
          <p className="mb-3 text-sm text-muted-foreground">
            Browse the product catalog with search, filters, sort, and
            pagination all driven by URL state.
          </p>
          <span className="text-xs font-medium text-primary group-hover:underline">
            Go to products →
          </span>
        </Link>

        <Link
          href="/favorites"
          className="group rounded-xl border bg-card p-5 transition hover:border-primary/50 hover:shadow-sm"
        >
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
            Favorites
          </h3>
          <p className="mb-3 text-sm text-muted-foreground">
            Keep track of products you like. Favorites are stored locally and
            persist between sessions.
          </p>
          <span className="text-xs font-medium text-primary group-hover:underline">
            View favorites →
          </span>
        </Link>

        <Link
          href="/lab"
          className="group rounded-xl border bg-card p-5 transition hover:border-primary/50 hover:shadow-sm"
        >
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
            Performance Lab
          </h3>
          <p className="mb-3 text-sm text-muted-foreground">
            Inspect different rendering strategies, Suspense streaming, and
            caching blocks in a single page.
          </p>
          <span className="text-xs font-medium text-primary group-hover:underline">
            Open lab →
          </span>
        </Link>
      </section>
    </main>
  );
}

