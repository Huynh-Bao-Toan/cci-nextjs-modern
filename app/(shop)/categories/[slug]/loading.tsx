import { SectionHeading } from "@/components/shared/section-heading";
import { ProductSkeleton } from "@/features/products/components/product-skeleton";

export default function CategoryLoading() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
      <SectionHeading title="Loading category…" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    </main>
  );
}

