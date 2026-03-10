import { Suspense } from "react";

import { SectionHeading } from "@/components/shared/section-heading";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

import { getCategories } from "@/features/products/server/get-categories";

export async function CachedProductsPanel() {
  const categories = await getCategories();
  const topCategories = categories.slice(0, 6);

  return (
    <section className="space-y-3 rounded-lg border bg-card p-4">
      <SectionHeading
        title="Cached categories (server)"
        subtitle="This block uses React cache() + force-cache fetch to reuse data across requests."
      />
      <div className="flex flex-wrap gap-2 text-xs">
        {topCategories.map((category) => (
          <span
            key={category}
            className="rounded-full border bg-muted px-3 py-1 text-muted-foreground"
          >
            {category}
          </span>
        ))}
      </div>
    </section>
  );
}

export function CachedProductsPanelWithFallback() {
  return (
    <Suspense
      fallback={
        <section className="space-y-3 rounded-lg border bg-card p-4">
          <SectionHeading title="Cached categories (server)" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <LoadingSkeleton key={index} className="h-6 w-20 rounded-full" />
            ))}
          </div>
        </section>
      }
    >
      {/* @ts-expect-error Server Component in Suspense */}
      <CachedProductsPanel />
    </Suspense>
  );
}

