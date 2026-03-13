import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SectionHeading } from "@/components/shared/section-heading";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { ProductSkeleton } from "@/features/products/components/product-skeleton";

export default function ProductDetailLoading() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: "Loading…" },
        ]}
      />

      <section className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <LoadingSkeleton className="h-80 w-full rounded-xl" />
        <div className="space-y-4">
          <SectionHeading title="Loading product…" />
          <LoadingSkeleton className="h-4 w-24" />
          <LoadingSkeleton className="h-7 w-40" />
          <LoadingSkeleton className="h-20 w-full" />
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeading title="Related products" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      </section>
    </main>
  );
}

