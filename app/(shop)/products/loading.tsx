import { SectionHeading } from "@/components/shared/section-heading";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { ProductSkeleton } from "@/features/products/components/product-skeleton";

export default function ProductsLoading() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
      <SectionHeading title="Products" />
      <div className="rounded-lg border bg-muted/40 p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <LoadingSkeleton className="h-8 w-full sm:w-1/2" />
          <LoadingSkeleton className="h-8 w-full sm:w-40" />
          <LoadingSkeleton className="h-8 w-full sm:w-36" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    </main>
  );
}

