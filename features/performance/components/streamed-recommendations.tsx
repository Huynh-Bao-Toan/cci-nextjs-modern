import { Suspense } from "react";

import { SectionHeading } from "@/components/shared/section-heading";
import { ProductSkeleton } from "@/features/products/components/product-skeleton";
import { ProductGrid } from "@/features/products/components/product-grid";
import { getProducts } from "@/features/products/server/get-products";

async function StreamedRecommendationsServer() {
  // Intentionally fetch a small page with no caching to emulate dynamic data.
  const page = await getProducts({
    q: undefined,
    category: undefined,
    sort: "rating-desc",
    page: 1,
    pageSize: 4,
    minRating: 4,
  });

  return (
    <section className="space-y-3 rounded-lg border bg-card p-4">
      <SectionHeading
        title="Streamed recommendations"
        subtitle="This section is wrapped in Suspense, so it streams after the main lab content."
      />
      <ProductGrid products={page.items} />
    </section>
  );
}

export function StreamedRecommendations() {
  return (
    <Suspense
      fallback={
        <section className="space-y-3 rounded-lg border bg-card p-4">
          <SectionHeading title="Streamed recommendations" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        </section>
      }
    >
      {/* @ts-expect-error Async Server Component under Suspense */}
      <StreamedRecommendationsServer />
    </Suspense>
  );
}

