import { ProductsPortalSkeleton } from "@/features/products-portal/components/products-skeleton"

export default function Loading() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
      <ProductsPortalSkeleton />
    </main>
  )
}

