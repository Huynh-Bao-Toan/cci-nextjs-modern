import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";

import { SectionHeading } from "@/components/shared/section-heading";
import {
  getDefaultProductsSearchParams,
  parseProductsSearchParams,
} from "@/features/products-portal/presentation/lib/products.params";
import { productsQueries } from "@/features/products-portal/presentation/lib/products.queries";
import { ProductsPortalPage } from "@/features/products-portal/presentation/components/products-page.client";

type ProductsPortalPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProductsPortalRoute({
  searchParams,
}: ProductsPortalPageProps) {
  const resolvedSearchParams = await searchParams;
  const params =
    parseProductsSearchParams(resolvedSearchParams) ??
    getDefaultProductsSearchParams();

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(productsQueries.categories()),
    queryClient.prefetchQuery(productsQueries.list(params)),
  ]);

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
      <SectionHeading
        title="Products Portal"
        subtitle="Manage products with search, filters, sorting and CRUD. State is shareable via URL without page navigation."
      />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductsPortalPage />
      </HydrationBoundary>
    </main>
  );
}
